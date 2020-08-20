const CMDToken = artifacts.require("CMDToken");
const TokenSafe = artifacts.require("TokenSafe");
const {addSeconds, addDays} = require("../../helpers/jsDate");
const {nullAddress} = require("../../helpers/commonlyUsed");
const {
  ether,
  time,
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

contract("tokenSafe", ([owner, other]) => {
  beforeEach(async function () {
    // Deploy the two contracts setting the TokenSafe address to the CMDToken contract
    this.tokenSafe = await TokenSafe.new(other, Date.now(), {from: owner});
    this.cmdToken = await CMDToken.new(this.tokenSafe.address, {from: owner});
  })

  it("should hold the 499,000 other tokens not distributed", async function () {
    // Check by calling & assert balances
    const tokenSafeBalance = await this.cmdToken.balanceOf(this.tokenSafe.address);
    const ownerBalance = await this.cmdToken.balanceOf(owner);
    assert.equal(tokenSafeBalance.toNumber(), 499000, "TokenSafe balance didn't initialize properly")
    assert.equal(ownerBalance.toNumber(), 1000, "Manager balance didn't initialize properly")
  });

  it("should have assigned the other account to be the beneficiary", async function () {
    const beneficiaryAddress = await this.tokenSafe.beneficiary();
    assert.equal(beneficiaryAddress, other, `TokenSafe's beneficiary didn't match other account, was ${beneficiaryAddress}`)
  });

  it("should have a target end time of 500 days from the start point & start right away", async function () {
    // Retrieve and verify time release parameters
    const startTimeDate = new Date((await this.tokenSafe.start()).toNumber());
    const cliffActivationDate = new Date((await this.tokenSafe.cliff()).toNumber());
    const durationInSeconds = await this.tokenSafe.duration();

    // Check to make sure the contract starts right away
    const cliffDifference = new BN(startTimeDate.valueOf()).sub(new BN(cliffActivationDate.valueOf()));
    assert.isTrue(cliffDifference.isZero(), `The cliff date was not zero!\nCliffStartDate: ${cliffActivationDate.valueOf()}\nStartDate: ${startTimeDate.valueOf()}`);


    // Make sure all tokens are released after a 500 days
    const resultingDateinUNIX = addSeconds(startTimeDate, durationInSeconds.toNumber()).valueOf();
    const expectedDateinUNIX = addDays(startTimeDate, 500).valueOf();

    assert.equal(resultingDateinUNIX, expectedDateinUNIX, "The resulting date didn't match the expected date!");
  });

  it("the owner should have renounced ownership", async function () {
    const tokenSafeOwner = await this.tokenSafe.owner();
    assert.equal(tokenSafeOwner, nullAddress(), "Owner did not renounce ownership of the token safe contract")
  });

  // it("should start with immediately available for the beneficiary", async function () {
  //   const beneficiaryBalance = await this.cmdToken.balanceOf(other);
  //   console.log(beneficiaryBalance.toNumber())
  //   // assert.equal(ownerBalance.toNumber(), 1000, "Manager balance didn't initialize properly")
  // });
});
