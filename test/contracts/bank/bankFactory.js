const TellorMaster = artifacts.require("TellorMaster.sol");
const Tellor = artifacts.require("Tellor.sol"); // globally injected artifacts helper

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
var BankFactory = artifacts.require("BankFactory");
var TestToken = artifacts.require("TestToken");

contract("BankFactory", function(_accounts) {
  const INTEREST_RATE = 12;
  const ORIGINATION_FEE = 1;
  const COLLATERALIZATION_RATIO = 150;
  const LIQUIDATION_PENALTY = 25;
  const PERIOD = 86400;
  const BANK_NAME = "Test Bank";

  beforeEach(async function () {
    // Tellor
    this.oracleBase = await Tellor.new()
    this.oracle = await TellorMaster.new(web3.utils.toChecksumAddress(this.oracleBase.address));
    this.master = await new web3.eth.Contract(TellorMaster.abi,this.oracle.address);
    this.oa = (web3.utils.toChecksumAddress(this.oracle.address))
    this.oracle2 = await new web3.eth.Contract(Tellor.abi,this.oa);

    // Bank set up
    this.ct = await TestToken.new("USD Token", "USDT");
    this.dt = await TestToken.new("Gold", "GLD");
    this.bank = await Bank.new(this.oracle.address);
    this.bankFactory = await BankFactory.new(this.bank.address);
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

  it("should create a bank clone with correct parameters", async function(){
    var clone = await this.bankFactory.createBank(
      BANK_NAME, INTEREST_RATE, ORIGINATION_FEE, COLLATERALIZATION_RATIO, LIQUIDATION_PENALTY, PERIOD, this.oracle.address,
      {"from": _accounts[1]}
    );
    let bankClone = await Bank.at(clone.logs[0].args.bankAddress);

    await bankClone.setCollateral(this.ct.address, 2, 1000, 1000, {"from": _accounts[1]});
    await bankClone.setDebt(this.dt.address, 1, 1000, 1000, {"from": _accounts[1]});
    const interestRate = await bankClone.getInterestRate();
    const originationFee = await bankClone.getOriginationFee();
    const collateralizationRatio = await bankClone.getCollateralizationRatio();
    const liquidationPenalty = await bankClone.getLiquidationPenalty();
    const reserveBalance = await bankClone.getReserveBalance();
    const reserveCollateralBalance = await bankClone.getReserveCollateralBalance();
    const owner = await bankClone.owner();
    const dtAddress = await bankClone.getDebtTokenAddress();
    const ctAddress = await bankClone.getCollateralTokenAddress();
    const bankTag = await this.bankFactory.getBankAddressAtIndex(0)

    assert.equal(bankTag.bankAddress, bankClone.address);
    assert.equal(owner, _accounts[1]);
    assert.equal(interestRate, INTEREST_RATE);
    assert.equal(originationFee, ORIGINATION_FEE);
    assert.equal(collateralizationRatio, COLLATERALIZATION_RATIO);
    assert.equal(liquidationPenalty, LIQUIDATION_PENALTY);
    assert.equal(reserveBalance, 0);
    assert.equal(reserveCollateralBalance, 0);
    assert.equal(dtAddress, this.dt.address);
    assert.equal(ctAddress, this.ct.address);
  });
  it("should not allow any changes to the master to propagate", async function(){
    const bankMaster = await Bank.at(this.bank.address);

    await bankMaster.init(_accounts[2], BANK_NAME, 88, 2, 2, 2, 71111, this.oracle.address,
      {"from": _accounts[2]});

    const clone = await this.bankFactory.createBank(
      BANK_NAME, INTEREST_RATE, ORIGINATION_FEE, COLLATERALIZATION_RATIO, LIQUIDATION_PENALTY, PERIOD, this.oracle.address,
      {"from": _accounts[1]}
    );
    const bankClone = await Bank.at(clone.logs[0].args.bankAddress);

    await bankClone.setCollateral(this.ct.address, 2, 1000, 1000, {"from": _accounts[1]});
    await bankClone.setDebt(this.dt.address, 1, 1000, 1000, {"from": _accounts[1]});
    const interestRate = await bankClone.getInterestRate();
    const originationFee = await bankClone.getOriginationFee();
    const collateralizationRatio = await bankClone.getCollateralizationRatio();
    const liquidationPenalty = await bankClone.getLiquidationPenalty();
    const owner = await bankClone.owner();

    assert.equal(owner, _accounts[1]);
    assert.equal(interestRate, INTEREST_RATE);
    assert.equal(originationFee, ORIGINATION_FEE);
    assert.equal(collateralizationRatio, COLLATERALIZATION_RATIO);
    assert.equal(liquidationPenalty, LIQUIDATION_PENALTY);
  });

  it("should return the proper number of banks", async function() {
    for (let i = 0; i < 300; i++) {
      await this.bankFactory.createBank(
        BANK_NAME, INTEREST_RATE, ORIGINATION_FEE, COLLATERALIZATION_RATIO, LIQUIDATION_PENALTY, PERIOD, this.oracle.address,
        {"from": _accounts[1]}
      );
    }
    const numberOfBanks = await this.bankFactory.getNumberOfBanks();
    assert.equal(numberOfBanks, 300, "number of banks did not match")
  })

  it("should return the proper number of banks", async function() {
    for (let i = 0; i < 300; i++) {
      await this.bankFactory.createBank(
        BANK_NAME, INTEREST_RATE, ORIGINATION_FEE, COLLATERALIZATION_RATIO, LIQUIDATION_PENALTY, PERIOD, this.oracle.address,
        {"from": _accounts[1]}
      );
    }
    const numberOfBanks = await this.bankFactory.getNumberOfBanks();
    assert.equal(numberOfBanks, 300, "number of banks did not match")
  })
});
