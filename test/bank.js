const {
  ether,
  time,
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

var Bank = artifacts.require("Bank");

contract("Bank", function(_accounts) {
  const INTEREST_RATE = 12;
  const ORIGINATION_FEE = 1;
  const COLLATERALIZATION_RATIO = 150;
  const LIQUIDATION_PENALTY = 25;

  beforeEach(async function () {
    this.bank = await Bank.new(INTEREST_RATE, ORIGINATION_FEE, COLLATERALIZATION_RATIO, LIQUIDATION_PENALTY);
    this.depositAmount = ether(new BN(100));
    this.withdrawAmount = ether(new BN(50));
    this.borrowAmount = ether(new BN(66));
    this.largeBorrowAmount = ether(new BN(75));
    this.smallBorrowAmount = ether(new BN(10));
    this.two = new BN(2);
    this.one = new BN(1);
    this.zero = new BN(0);
  });

  it('should create bank with correct parameters', async function () {
    const interestRate = await this.bank.getInterestRate();
    const originationFee = await this.bank.getOriginationFee();
    const collateralizationRatio = await this.bank.getCollateralizationRatio();
    const liquidationPenalty = await this.bank.getLiquidationPenalty();
    const reserveBalance = await this.bank.getReserveBalance();
    const reserveCollateralBalance = await this.bank.getReserveCollateralBalance();
    const owner = await this.bank.owner();

    assert.equal(owner, _accounts[0]);
    assert.equal(interestRate, INTEREST_RATE);
    assert.equal(originationFee, ORIGINATION_FEE);
    assert.equal(collateralizationRatio, COLLATERALIZATION_RATIO);
    assert.equal(liquidationPenalty, LIQUIDATION_PENALTY);
    assert.equal(reserveBalance, 0);
    assert.equal(reserveCollateralBalance, 0);
  });

  it('should allow owner to deposit reserves', async function () {
    await this.bank.reserveDeposit(this.depositAmount);
    const reserveBalance = await this.bank.getReserveBalance();
    expect(reserveBalance).to.be.bignumber.equal(this.depositAmount);
  });

  it('should allow owner to withdraw reserves', async function () {
    await this.bank.reserveDeposit(this.depositAmount);
    const beforeReserveBalance = await this.bank.getReserveBalance();
    await this.bank.reserveWithdraw(this.withdrawAmount);
    const afterReserveBalance = await this.bank.getReserveBalance();
    expect(beforeReserveBalance).to.be.bignumber.equal(this.depositAmount);
    expect(afterReserveBalance).to.be.bignumber.equal(this.withdrawAmount);
  });

  it('should not allow non-owner to deposit reserves', async function () {
    await expectRevert(this.bank.reserveDeposit(ether(new BN(100)), {from: _accounts[1]}), "Ownable: caller is not the owner.");
  });

  it('should not allow non-owner to withdraw reserves', async function () {
    await expectRevert(this.bank.reserveWithdraw(ether(new BN(100)), {from: _accounts[1]}), "Ownable: caller is not the owner.");
  });

  it('should allow user to deposit collateral into vault', async function () {
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    const collateralAmount = await this.bank.getVaultCollateralAmount({from: _accounts[1]});
    const debtAmount = await this.bank.getVaultDebtAmount({from: _accounts[1]});
    expect(collateralAmount).to.be.bignumber.equal(this.depositAmount);
    expect(debtAmount).to.be.bignumber.equal(this.zero);
  });

  it('should allow user to withdraw collateral from vault', async function () {
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultWithdraw({from: _accounts[1]});
    const collateralAmount = await this.bank.getVaultCollateralAmount({from: _accounts[1]});
    const debtAmount = await this.bank.getVaultDebtAmount({from: _accounts[1]});
    expect(collateralAmount).to.be.bignumber.equal(this.zero);
    expect(debtAmount).to.be.bignumber.equal(this.zero);
  });

  it('should add origination fee to a vault\'s borrowed amount', async function () {
    await this.bank.reserveDeposit(this.depositAmount);
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultBorrow(this.borrowAmount, {from: _accounts[1]});
    const collateralAmount = await this.bank.getVaultCollateralAmount({from: _accounts[1]});
    const debtAmount = await this.bank.getVaultDebtAmount({from: _accounts[1]});
    expect(collateralAmount).to.be.bignumber.equal(this.depositAmount);
    var b_amount = parseInt(this.borrowAmount);
    b_amount += (b_amount * ORIGINATION_FEE)/100;
    expect(debtAmount).to.be.bignumber.equal(b_amount.toString());
  });

  it('should accrue interest on a vault\'s borrowed amount', async function () {
    await this.bank.reserveDeposit(this.depositAmount);
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultBorrow(this.borrowAmount, {from: _accounts[1]});
    await time.increase(60*60*24*2+10) // Let two days pass
    const repayAmount = await this.bank.getVaultRepayAmount({from: _accounts[1]});
    var b_amount = new BN(this.borrowAmount);
    b_amount = b_amount.add(b_amount.mul(new BN(ORIGINATION_FEE)).div(new BN(100)));
    b_amount = b_amount.add(b_amount.mul(new BN(INTEREST_RATE)).div(new BN(100)).div(new BN(365))); // Day 1 interest rate
    b_amount = b_amount.add(b_amount.mul(new BN(INTEREST_RATE)).div(new BN(100)).div(new BN(365))); // Day 2 interest rate
    expect(repayAmount).to.be.bignumber.equal(b_amount.toString());
  });

  it('should allow user to withdraw after debt repayment', async function () {
    await this.bank.reserveDeposit(this.depositAmount);
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultBorrow(this.borrowAmount, {from: _accounts[1]});
    await time.increase(60*60*24*2+10) // Let two days pass
    const repayAmount = await this.bank.getVaultRepayAmount({from: _accounts[1]});
    await this.bank.vaultRepay(repayAmount, {from: _accounts[1]});
    const debtAmount = await this.bank.getVaultDebtAmount({from: _accounts[1]});
    expect(debtAmount).to.be.bignumber.equal(this.zero);
  });

  it('should not allow user to withdraw without debt repayment', async function () {
    await this.bank.reserveDeposit(this.depositAmount);
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultBorrow(this.borrowAmount, {from: _accounts[1]});
    await time.increase(60*60*24*2+10) // Let two days pass
    await expectRevert(this.bank.vaultWithdraw({from: _accounts[1]}), "DEBT OWED");
  });

  it('should not allow user to borrow below the collateralization ratio', async function () {
    await this.bank.reserveDeposit(this.depositAmount);
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    await expectRevert(this.bank.vaultBorrow(this.largeBorrowAmount, {from: _accounts[1]}), "NOT ENOUGH COLLATERAL");
  });

  it('should calculate correct collateralization ratio for a user\'s vault', async function () {
    await this.bank.reserveDeposit(this.depositAmount);
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultBorrow(this.borrowAmount, {from: _accounts[1]});
    const collateralizationRatio = await this.bank.getVaultCollateralizationRatio({from: _accounts[1]});
    expect(collateralizationRatio).to.be.bignumber.equal("15002");
  });

  it('should not liquidate overcollateralized vault', async function () {
    await this.bank.reserveDeposit(this.depositAmount);
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultBorrow(this.borrowAmount, {from: _accounts[1]});
    await expectRevert(this.bank.liquidate(_accounts[1]), "VAULT NOT UNDERCOLLATERALIZED");
  });

  it('should liquidate undercollateralized vault', async function () {
    await this.bank.reserveDeposit(this.depositAmount);
    await this.bank.updatePrice(this.one, this.two);
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultBorrow(this.largeBorrowAmount, {from: _accounts[1]});
    var collateralizationRatio = await this.bank.getVaultCollateralizationRatio({from: _accounts[1]});
    expect(collateralizationRatio).to.be.bignumber.equal("26403");
    // Lower the price of collateral, push the vault into undercollateralized
    await this.bank.updatePrice(this.one, this.one);
    collateralizationRatio = await this.bank.getVaultCollateralizationRatio({from: _accounts[1]});
    expect(collateralizationRatio).to.be.bignumber.equal("13201");
    await this.bank.liquidate(_accounts[1]);
    const collateralAmount = await this.bank.getVaultCollateralAmount({from: _accounts[1]});
    const debtAmount = await this.bank.getVaultDebtAmount({from: _accounts[1]});
    const debtReserveBalance = await this.bank.getReserveBalance();
    const collateralReserveBalance = await this.bank.getReserveCollateralBalance();
    expect(collateralAmount).to.be.bignumber.equal(this.zero);
    expect(debtAmount).to.be.bignumber.equal(this.zero);
    expect(debtReserveBalance).to.be.bignumber.equal(ether(new BN(25)));
    expect(collateralReserveBalance).to.be.bignumber.equal(this.depositAmount);
  });



});
