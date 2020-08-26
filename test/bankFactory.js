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
var BankFactory = artifacts.require("BankFactory");
var CT = artifacts.require("GLDToken");
var DT = artifacts.require("USDToken");

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
    this.ct = await CT.new(ether(new BN(10000)));
    this.dt = await DT.new(ether(new BN(10000)));
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

  it("should be owned by the creator", async function(){
    let owner = await this.bankFactory.owner();
    assert.equal(owner, _accounts[0]);
  });

  it("should create a bank clone with correct parameters", async function(){
    var clone = await this.bankFactory.createBank(
      BANK_NAME, INTEREST_RATE, ORIGINATION_FEE, COLLATERALIZATION_RATIO, LIQUIDATION_PENALTY, PERIOD, this.oracle.address,
      {"from": _accounts[1]}
    );
    let bankClone = await Bank.at(clone.logs[0].args.newBankAddress);

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
    const bankCount = await this.bankFactory.getNumberOfBanks();
    const bankAddress = await this.bankFactory.getBankAddressAtIndex(0);

    assert.equal(bankAddress, bankClone.address);
    assert.equal(bankCount, 1);
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

  it("should create a bank multiple clones ", async function(){
    var clone1 = await this.bankFactory.createBank(
      BANK_NAME, INTEREST_RATE, ORIGINATION_FEE, COLLATERALIZATION_RATIO, LIQUIDATION_PENALTY, PERIOD, this.oracle.address,
      {"from": _accounts[1]}
    );
    let bankClone1 = await Bank.at(clone1.logs[0].args.newBankAddress);

    await bankClone1.setCollateral(this.ct.address, 2, 1000, 1000, {"from": _accounts[1]});
    await bankClone1.setDebt(this.dt.address, 1, 1000, 1000, {"from": _accounts[1]});
    const owner1 = await bankClone1.owner();

    var clone2 = await this.bankFactory.createBank(
      BANK_NAME, INTEREST_RATE, ORIGINATION_FEE, COLLATERALIZATION_RATIO, LIQUIDATION_PENALTY, PERIOD, this.oracle.address,
      {"from": _accounts[2]}
    );
    let bankClone2 = await Bank.at(clone2.logs[0].args.newBankAddress);

    await bankClone2.setCollateral(this.dt.address, 2, 1000, 1000, {"from": _accounts[2]});
    await bankClone2.setDebt(this.ct.address, 1, 1000, 1000, {"from": _accounts[2]});
    const owner2 = await bankClone2.owner();

    const bankCount = await this.bankFactory.getNumberOfBanks();
    const bankAddress1 = await this.bankFactory.getBankAddressAtIndex(0);
    const bankAddress2 = await this.bankFactory.getBankAddressAtIndex(1);

    assert.equal(bankAddress1, bankClone1.address);
    assert.equal(bankAddress2, bankClone2.address);
    assert.equal(bankCount, 2);
    assert.equal(owner1, _accounts[1]);
    assert.equal(owner2, _accounts[2]);
  });

});
