const UsingTellor = artifacts.require("../node_modules/usingtellor/contracts/UsingTellor.sol");
const TellorMaster = artifacts.require("../node_modules/usingtellor/contracts/testContracts/TellorMaster.sol");
const Tellor = artifacts.require("../node_modules/usingtellor/contracts/Tellor.sol"); // globally injected artifacts helper

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
var CT = artifacts.require("GLDToken");
var DT = artifacts.require("USDToken");

contract("Bank", function(_accounts) {
  const INTEREST_RATE = 12;
  const ORIGINATION_FEE = 1;
  const COLLATERALIZATION_RATIO = 150;
  const LIQUIDATION_PENALTY = 25;
  const PERIOD = 86400;

  beforeEach(async function () {
    // Tellor
    this.oracleBase = await Tellor.new()
    this.oracle = await TellorMaster.new(web3.utils.toChecksumAddress(this.oracleBase.address));
    this.master = await new web3.eth.Contract(TellorMaster.abi,this.oracle.address);
    this.oa = (web3.utils.toChecksumAddress(this.oracle.address))
    this.oracle2 = await new web3.eth.Contract(Tellor.abi,this.oa);

    // Bank set up
    this.ct = await CT.new(ether(new BN(10000)));
    this.dt = await DT.new(ether(new BN(10000)));
    this.bank = await Bank.new(INTEREST_RATE, ORIGINATION_FEE, COLLATERALIZATION_RATIO, LIQUIDATION_PENALTY, PERIOD, this.ct.address, 2, 1000, 1000, this.dt.address, 1, 1000, 1000, this.oracle.address);
    this.depositAmount = ether(new BN(100));
    this.largeDepositAmount = ether(new BN(5000));
    this.withdrawAmount = ether(new BN(50));
    this.borrowAmount = ether(new BN(66));
    this.largeBorrowAmount = ether(new BN(75));
    this.smallBorrowAmount = ether(new BN(30));
    this.two = new BN(2);
    this.one = new BN(1);
    this.zero = new BN(0);

    await this.ct.transfer(_accounts[1], ether(new BN(500)));
    await this.dt.transfer(_accounts[1], ether(new BN(500)));



  });

  it("Test getCurrentValue", async function(){
    await web3.eth.sendTransaction({to:this.oa,from:_accounts[0],gas:4000000,data:this.oracle2.methods.requestData("BTC","BTC/USD",1000,0).encodeABI()})
    for(var i = 0;i <=4 ;i++){
      await web3.eth.sendTransaction({to: this.oracle.address,from:_accounts[i],gas:4000000,data:this.oracle2.methods.submitMiningSolution("nonce", 1, 9000000).encodeABI()})
    }
    await web3.eth.sendTransaction({to:this.oa,from:_accounts[0],gas:4000000,data:this.oracle2.methods.requestData("ETH","ETH/USD",1000,0).encodeABI()})
    for(var i = 0;i <=4 ;i++){
      await web3.eth.sendTransaction({to: this.oracle.address,from:_accounts[i],gas:4000000,data:this.oracle2.methods.submitMiningSolution("nonce", 2, 210000).encodeABI()})
    }
    let vars = await this.bank.getCurrentValue.call(1);
    assert(vars[0] == true, "ifRetreive is not true");
    assert(vars[1] == 9000000, "Get last value should work");
    vars = await this.bank.getCurrentValue.call(2);
    assert(vars[0] == true, "ifRetreive is not true");
    assert(vars[1] == 210000, "Get last value should work");

  });

  it('should create bank with correct parameters', async function () {
    const interestRate = await this.bank.getInterestRate();
    const originationFee = await this.bank.getOriginationFee();
    const collateralizationRatio = await this.bank.getCollateralizationRatio();
    const liquidationPenalty = await this.bank.getLiquidationPenalty();
    const reserveBalance = await this.bank.getReserveBalance();
    const reserveCollateralBalance = await this.bank.getReserveCollateralBalance();
    const owner = await this.bank.owner();
    const dtAddress = await this.bank.getDebtTokenAddress()
    const ctAddress = await this.bank.getCollateralTokenAddress()

    assert.equal(owner, _accounts[0]);
    assert.equal(interestRate, INTEREST_RATE);
    assert.equal(originationFee, ORIGINATION_FEE);
    assert.equal(collateralizationRatio, COLLATERALIZATION_RATIO);
    assert.equal(liquidationPenalty, LIQUIDATION_PENALTY);
    assert.equal(reserveBalance, 0);
    assert.equal(reserveCollateralBalance, 0);
    assert.equal(dtAddress, this.dt.address);
    assert.equal(ctAddress, this.ct.address);
  });

  it('should allow owner to deposit reserves', async function () {
    await this.dt.approve(this.bank.address, this.depositAmount);
    await this.bank.reserveDeposit(this.depositAmount);
    const reserveBalance = await this.bank.getReserveBalance();
    const tokenBalance = await this.dt.balanceOf(this.bank.address);
    expect(reserveBalance).to.be.bignumber.equal(this.depositAmount);
    expect(tokenBalance).to.be.bignumber.equal(this.depositAmount);
  });

  it('should allow owner to withdraw reserves', async function () {
    await this.dt.approve(this.bank.address, this.depositAmount);
    await this.bank.reserveDeposit(this.depositAmount);
    const beforeReserveBalance = await this.bank.getReserveBalance();
    await this.bank.reserveWithdraw(this.depositAmount);
    const afterReserveBalance = await this.bank.getReserveBalance();
    const tokenBalance = await this.dt.balanceOf(this.bank.address);
    expect(beforeReserveBalance).to.be.bignumber.equal(this.depositAmount);
    expect(afterReserveBalance).to.be.bignumber.equal(this.zero);
    expect(tokenBalance).to.be.bignumber.equal(this.zero);
  });

  it('should not allow non-owner to deposit reserves', async function () {
    await expectRevert(this.bank.reserveDeposit(ether(new BN(100)), {from: _accounts[1]}), "Ownable: caller is not the owner.");
  });

  it('should not allow non-owner to withdraw reserves', async function () {
    await expectRevert(this.bank.reserveWithdraw(ether(new BN(100)), {from: _accounts[1]}), "Ownable: caller is not the owner.");
  });

  it('should allow user to deposit collateral into vault', async function () {
    await this.ct.approve(this.bank.address, this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    const collateralAmount = await this.bank.getVaultCollateralAmount({from: _accounts[1]});
    const debtAmount = await this.bank.getVaultDebtAmount({from: _accounts[1]});
    const tokenBalance = await this.ct.balanceOf(this.bank.address);
    expect(collateralAmount).to.be.bignumber.equal(this.depositAmount);
    expect(debtAmount).to.be.bignumber.equal(this.zero);
    expect(tokenBalance).to.be.bignumber.equal(this.depositAmount);
  });


  it('should allow user to withdraw collateral from vault', async function () {
    await this.ct.approve(this.bank.address, this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultWithdraw(this.depositAmount, {from: _accounts[1]});
    const collateralAmount = await this.bank.getVaultCollateralAmount({from: _accounts[1]});
    const debtAmount = await this.bank.getVaultDebtAmount({from: _accounts[1]});
    const tokenBalance = await this.ct.balanceOf(this.bank.address);
    expect(collateralAmount).to.be.bignumber.equal(this.zero);
    expect(debtAmount).to.be.bignumber.equal(this.zero);
    expect(tokenBalance).to.be.bignumber.equal(this.zero);
  });

  it('should not allow user to withdraw collateral from vault if undercollateralized', async function () {
    await this.dt.approve(this.bank.address, this.depositAmount);
    await this.bank.reserveDeposit(this.depositAmount);
    await this.ct.approve(this.bank.address, this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultBorrow(this.borrowAmount, {from: _accounts[1]});
    await expectRevert(this.bank.vaultWithdraw(this.depositAmount, {from: _accounts[1]}), "CANNOT UNDERCOLLATERALIZE VAULT");
  });

  it('should add origination fee to a vault\'s borrowed amount', async function () {
    await this.dt.approve(this.bank.address, this.depositAmount);
    await this.bank.reserveDeposit(this.depositAmount);
    await this.ct.approve(this.bank.address, this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultBorrow(this.borrowAmount, {from: _accounts[1]});
    const collateralAmount = await this.bank.getVaultCollateralAmount({from: _accounts[1]});
    const debtAmount = await this.bank.getVaultDebtAmount({from: _accounts[1]});
    expect(collateralAmount).to.be.bignumber.equal(this.depositAmount);
    // Calculate borrowed amount
    var b_amount = parseInt(this.borrowAmount);
    b_amount += (b_amount * ORIGINATION_FEE)/100;
    expect(debtAmount).to.be.bignumber.equal(b_amount.toString());

    const collateralBalance = await this.ct.balanceOf(this.bank.address);
    const debtBalance = await this.dt.balanceOf(this.bank.address);
    expect(collateralBalance).to.be.bignumber.equal(this.depositAmount);
    expect(debtBalance).to.be.bignumber.equal(ether(new BN(34)));
  });

  it('should allow the user to borrow more', async function () {
    await this.dt.approve(this.bank.address, this.depositAmount);
    await this.bank.reserveDeposit(this.depositAmount);
    await this.ct.approve(this.bank.address, this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultBorrow(this.smallBorrowAmount, {from: _accounts[1]});
    await time.increase(60*60*24*2+10);
    await this.bank.vaultBorrow(this.smallBorrowAmount, {from: _accounts[1]});
    //await this.bank.vaultBorrow(this.smallBorrowAmount, {from: _accounts[1]});
    const collateralAmount = await this.bank.getVaultCollateralAmount({from: _accounts[1]});
    const debtAmount = await this.bank.getVaultDebtAmount({from: _accounts[1]});
    expect(collateralAmount).to.be.bignumber.equal(this.depositAmount);
    // Calculate borrowed amount, use pays origination fee on 2 borrows
    var s_amount = new BN(this.smallBorrowAmount);
    var b_amount = s_amount.add(s_amount.mul(new BN(ORIGINATION_FEE)).div(new BN(100)));
    b_amount = b_amount.add(b_amount.mul(new BN(INTEREST_RATE)).div(new BN(100)).div(new BN(365)));
    b_amount = b_amount.add(b_amount.mul(new BN(INTEREST_RATE)).div(new BN(100)).div(new BN(365)));
    b_amount = b_amount.add(s_amount.mul(new BN(ORIGINATION_FEE)).div(new BN(100)));
    b_amount = b_amount.add(s_amount);
    expect(debtAmount).to.be.bignumber.equal(b_amount.toString());

    const collateralBalance = await this.ct.balanceOf(this.bank.address);
    const debtBalance = await this.dt.balanceOf(this.bank.address);
    expect(collateralBalance).to.be.bignumber.equal(this.depositAmount);
    expect(debtBalance).to.be.bignumber.equal(ether(new BN(40)));
  });

  it('should accrue interest on a vault\'s borrowed amount', async function () {
    await this.dt.approve(this.bank.address, this.depositAmount);
    await this.bank.reserveDeposit(this.depositAmount);
    await this.ct.approve(this.bank.address, this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultBorrow(this.borrowAmount, {from: _accounts[1]});
    await time.increase(60*60*24*2+10) // Let two days pass
    const repayAmount = await this.bank.getVaultRepayAmount({from: _accounts[1]});
    var b_amount = new BN(this.borrowAmount);
    b_amount = b_amount.add(b_amount.mul(new BN(ORIGINATION_FEE)).div(new BN(100)));
    b_amount = b_amount.add(b_amount.mul(new BN(INTEREST_RATE)).div(new BN(100)).div(new BN(365))); // Day 1 interest rate
    b_amount = b_amount.add(b_amount.mul(new BN(INTEREST_RATE)).div(new BN(100)).div(new BN(365))); // Day 2 interest rate
    expect(repayAmount).to.be.bignumber.equal(b_amount.toString());
    const collateralBalance = await this.ct.balanceOf(this.bank.address);
    const debtBalance = await this.dt.balanceOf(this.bank.address);
    // Calculate debt, collateral left after borrow
    expect(collateralBalance).to.be.bignumber.equal(this.depositAmount);
    expect(debtBalance).to.be.bignumber.equal(ether(new BN(34)));
  });

  it('should allow user to withdraw after debt repayment', async function () {
    await this.dt.approve(this.bank.address, this.depositAmount);
    await this.bank.reserveDeposit(this.depositAmount);
    await this.ct.approve(this.bank.address, this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultBorrow(this.borrowAmount, {from: _accounts[1]});
    await time.increase(60*60*24*2+10) // Let two days pass
    const repayAmount = await this.bank.getVaultRepayAmount({from: _accounts[1]});
    await this.dt.approve(this.bank.address, repayAmount, {from: _accounts[1]});
    await this.bank.vaultRepay(repayAmount, {from: _accounts[1]});
    const debtAmount = await this.bank.getVaultDebtAmount({from: _accounts[1]});
    expect(debtAmount).to.be.bignumber.equal(this.zero);
    // The debt balance should be the original + fees and interest
    const collateralBalance = await this.ct.balanceOf(this.bank.address);
    const debtBalance = await this.dt.balanceOf(this.bank.address);
    expect(collateralBalance).to.be.bignumber.equal(this.depositAmount);
    expect(debtBalance).to.be.bignumber.equal(new BN("100703838438010883842"));
  });

  it('should not allow user to withdraw without debt repayment', async function () {
    await this.dt.approve(this.bank.address, this.depositAmount);
    await this.bank.reserveDeposit(this.depositAmount);
    await this.ct.approve(this.bank.address, this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultBorrow(this.borrowAmount, {from: _accounts[1]});
    await time.increase(60*60*24*2+10) // Let two days pass
    await expectRevert(this.bank.vaultWithdraw(this.depositAmount, {from: _accounts[1]}), "CANNOT UNDERCOLLATERALIZE VAUL");
  });

  it('should not allow user to borrow below the collateralization ratio', async function () {
    await this.dt.approve(this.bank.address, this.depositAmount);
    await this.bank.reserveDeposit(this.depositAmount);
    await this.ct.approve(this.bank.address, this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    await expectRevert(this.bank.vaultBorrow(this.largeBorrowAmount, {from: _accounts[1]}), "NOT ENOUGH COLLATERAL");
  });

  it('should calculate correct collateralization ratio for a user\'s vault', async function () {

    await this.dt.approve(this.bank.address, this.depositAmount);
    await this.bank.reserveDeposit(this.depositAmount);

    // The first price for the collateral and debt
    await web3.eth.sendTransaction({to:this.oa,from:_accounts[0],gas:4000000,data:this.oracle2.methods.requestData("USDT","USDT/USD",1000,0).encodeABI()})
    for(var i = 0;i <=4 ;i++){
      await web3.eth.sendTransaction({to: this.oracle.address,from:_accounts[i],gas:4000000,data:this.oracle2.methods.submitMiningSolution("nonce", 1, 1000).encodeABI()})
    }
    await web3.eth.sendTransaction({to:this.oa,from:_accounts[0],gas:4000000,data:this.oracle2.methods.requestData("GLD","GLD/USD",1000,0).encodeABI()})
    for(var i = 0;i <=4 ;i++){
      await web3.eth.sendTransaction({to: this.oracle.address,from:_accounts[i],gas:4000000,data:this.oracle2.methods.submitMiningSolution("nonce", 2, 1700000).encodeABI()})
    }
    await this.bank.updateCollateralPrice();
    await this.bank.updateDebtPrice();

    let debtPrice = await this.bank.getDebtTokenPrice();
    let collateralPrice = await this.bank.getCollateralTokenPrice();
    expect(debtPrice).to.be.bignumber.equal("1000")
    expect(collateralPrice).to.be.bignumber.equal("1700000")

    await this.dt.approve(this.bank.address, this.largeDepositAmount);
    await this.bank.reserveDeposit(this.largeDepositAmount);
    await this.ct.approve(this.bank.address, ether(this.one), {from: _accounts[1]});
    await this.bank.vaultDeposit(ether(this.one), {from: _accounts[1]});
    await this.bank.vaultBorrow(ether(new BN(1100)), {from: _accounts[1]});
    const collateralizationRatio = await this.bank.getVaultCollateralizationRatio(_accounts[1]);
    expect(collateralizationRatio).to.be.bignumber.equal("15302");
  });

  it('should not liquidate overcollateralized vault', async function () {
    await this.dt.approve(this.bank.address, this.depositAmount);
    await this.bank.reserveDeposit(this.depositAmount);
    await this.ct.approve(this.bank.address, this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultBorrow(this.borrowAmount, {from: _accounts[1]});
    await expectRevert(this.bank.liquidate(_accounts[1]), "VAULT NOT UNDERCOLLATERALIZED");
  });

  it('should liquidate undercollateralized vault', async function () {
    await this.dt.approve(this.bank.address, this.depositAmount);
    await this.bank.reserveDeposit(this.depositAmount);

    // The first price for the collateral and debt
    await web3.eth.sendTransaction({to:this.oa,from:_accounts[0],gas:4000000,data:this.oracle2.methods.requestData("USDT","USDT/USD",1000,0).encodeABI()})
    for(var i = 0;i <=4 ;i++){
      await web3.eth.sendTransaction({to: this.oracle.address,from:_accounts[i],gas:4000000,data:this.oracle2.methods.submitMiningSolution("nonce", 1, 1000).encodeABI()})
    }
    await web3.eth.sendTransaction({to:this.oa,from:_accounts[0],gas:4000000,data:this.oracle2.methods.requestData("GLD","GLD/USD",1000,0).encodeABI()})
    for(var i = 0;i <=4 ;i++){
      await web3.eth.sendTransaction({to: this.oracle.address,from:_accounts[i],gas:4000000,data:this.oracle2.methods.submitMiningSolution("nonce", 2, 2000).encodeABI()})
    }
    await this.bank.updateCollateralPrice();
    await this.bank.updateDebtPrice();
    let debtPrice = await this.bank.getDebtTokenPrice();
    let collateralPrice = await this.bank.getCollateralTokenPrice();
    expect(debtPrice).to.be.bignumber.equal("1000")
    expect(collateralPrice).to.be.bignumber.equal("2000")

    await this.ct.approve(this.bank.address, this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultDeposit(this.depositAmount, {from: _accounts[1]});
    await this.bank.vaultBorrow(this.largeBorrowAmount, {from: _accounts[1]});
    var collateralizationRatio = await this.bank.getVaultCollateralizationRatio(_accounts[1]);
    expect(collateralizationRatio).to.be.bignumber.equal("26403");

    // Lower the price of collateral, push the vault into undercollateralized
    // The first price for the collateral and debt
    await web3.eth.sendTransaction({to:this.oa,from:_accounts[0],gas:4000000,data:this.oracle2.methods.requestData("USDT","USDT/USD",1000,0).encodeABI()})
    for(var i = 0;i <=4 ;i++){
      await web3.eth.sendTransaction({to: this.oracle.address,from:_accounts[i],gas:4000000,data:this.oracle2.methods.submitMiningSolution("nonce", 1, 1000).encodeABI()})
    }
    await web3.eth.sendTransaction({to:this.oa,from:_accounts[0],gas:4000000,data:this.oracle2.methods.requestData("GLD","GLD/USD",1000,0).encodeABI()})
    for(var i = 0;i <=4 ;i++){
      await web3.eth.sendTransaction({to: this.oracle.address,from:_accounts[i],gas:4000000,data:this.oracle2.methods.submitMiningSolution("nonce", 2, 1000).encodeABI()})
    }
    await this.bank.updateCollateralPrice();
    await this.bank.updateDebtPrice();


    collateralizationRatio = await this.bank.getVaultCollateralizationRatio(_accounts[1]);
    expect(collateralizationRatio).to.be.bignumber.equal("13201");
    await this.bank.liquidate(_accounts[1]);
    const collateralAmount = await this.bank.getVaultCollateralAmount({from: _accounts[1]});
    const debtAmount = await this.bank.getVaultDebtAmount({from: _accounts[1]});
    const debtReserveBalance = await this.bank.getReserveBalance();
    const collateralReserveBalance = await this.bank.getReserveCollateralBalance();
    expect(collateralAmount).to.be.bignumber.equal("5312500000000000000"); // TODO: Check math
    expect(debtAmount).to.be.bignumber.equal(this.zero);
    expect(debtReserveBalance).to.be.bignumber.equal(ether(new BN(25)));
    expect(collateralReserveBalance).to.be.bignumber.equal("94687500000000000000");
  });

  // Test liquidationPenalty

  // Test set system properties

  // Confirm events are emitted

});
