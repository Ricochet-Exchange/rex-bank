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

  it("should create bank clones with correct parameters", async function(){
    var clone = this.bankFactory.createBank(
      INTEREST_RATE, ORIGINATION_FEE, COLLATERALIZATION_RATIO, LIQUIDATION_PENALTY, PERIOD,
      this.ct.address, 2, 1000, 1000, this.dt.address, 1, 1000, 1000, {from: _accounts[1]}
    );
    const interestRate = await this.bank.getInterestRate();
    const originationFee = await clone.getOriginationFee();
    const collateralizationRatio = await clone.getCollateralizationRatio();
    const liquidationPenalty = await clone.getLiquidationPenalty();
    const reserveBalance = await clone.getReserveBalance();
    const reserveCollateralBalance = await clone.getReserveCollateralBalance();
    const owner = await clone.owner();
    const dtAddress = await clone.getDebtTokenAddress();
    const ctAddress = await clone.getCollateralTokenAddress();
    const banks = await bankFactory.getBankAddresses();

    assert.eqaul(banks[0], clone.address);
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

});
