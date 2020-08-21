const CMDToken = artifacts.require("CMDToken");
const TokenSafe = artifacts.require("TokenSafe");
const {nullAddress} = require("../../helpers/commonlyUsed");
const {
  time,
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

contract("TokenSafe", ([owner, other]) => {
  beforeEach(async function () {
    // Deploy the two contracts setting the TokenSafe address to the CMDToken contract
    let latestTimestamp = await time.latest();
    this.tokenSafe = await TokenSafe.new(other, latestTimestamp, {from: owner});
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

  it("the owner should have renounced ownership", async function () {
    const tokenSafeOwner = await this.tokenSafe.owner();
    assert.equal(tokenSafeOwner, nullAddress, "Owner did not renounce ownership of the token safe contract")
  });

  it("should not let anyone but the beneficiary to call release", async function () {
    await expectRevert(
      this.tokenSafe.release(this.cmdToken.address),
      "caller is not the beneficiary"
    );
  });

  it("should not have any tokens due to be immediately distributed to the beneficiary", async function () {
    await expectRevert(
      this.tokenSafe.release(this.cmdToken.address, {from: other}),
      "no tokens are due"
    );
  });

  it("should allow ~1000 CMD after 24 hr.s", async function () {
    // Grab the date in which the safe started vesting
    const startTime = await this.tokenSafe.start();

    // Grab the latest timestamp to subtract it from start time to make it exactly 24 hr.
    const latestTimeStamp = await time.latest();

    // Fast forward the chain 1 day
    await time.increase(time.duration.days(1).sub(latestTimeStamp.sub(startTime)));

    // Release the tokens & grab the beneficiary's balance
    await this.tokenSafe.release(this.cmdToken.address, {from: other});
    const beneficiaryBalance = await this.cmdToken.balanceOf(other);

    assert.equal(beneficiaryBalance.toNumber(), 1000, "Beneficiary balance wasn't released")
  });

  it("should allow 10000 CMD after 10 days", async function () {
    // Grab the date in which the safe started vesting
    const startTime = await this.tokenSafe.start();

    // Grab the latest timestamp to subtract it from start time to make it exact
    const latestTimeStamp = await time.latest();

    // Fast forward the chain 10 day
    await time.increase(time.duration.days(10).sub(latestTimeStamp.sub(startTime)));

    // Release the tokens & grab the beneficiary's balance
    await this.tokenSafe.release(this.cmdToken.address, {from: other});
    const beneficiaryBalance = await this.cmdToken.balanceOf(other);

    assert.equal(beneficiaryBalance.toNumber(), 10000, "Beneficiary balance wasn't released")
  });

  it("should allow 100000 CMD after 100 days", async function () {
    // Grab the date in which the safe started vesting
    const startTime = await this.tokenSafe.start();

    // Grab the latest timestamp to subtract it from start time to make it exact
    const latestTimeStamp = await time.latest();

    // Fast forward the chain 100 day
    await time.increase(time.duration.days(100).sub(latestTimeStamp.sub(startTime)));

    // Release the tokens & grab the beneficiary's balance
    await this.tokenSafe.release(this.cmdToken.address, {from: other});
    const beneficiaryBalance = await this.cmdToken.balanceOf(other);

    assert.equal(beneficiaryBalance.toNumber(), 100000, "Beneficiary balance wasn't released")
  });

  it("should allow for full CMD after 499 days", async function () {
    // Grab the date in which the safe started vesting
    const startTime = await this.tokenSafe.start();

    // Grab the latest timestamp to subtract it from start time to make it exact
    const latestTimeStamp = await time.latest();

    // Fast forward the chain 100 day
    await time.increase(time.duration.days(499).sub(latestTimeStamp.sub(startTime)));

    // Release the tokens & grab the beneficiary's balance
    await this.tokenSafe.release(this.cmdToken.address, {from: other});
    const beneficiaryBalance = await this.cmdToken.balanceOf(other);

    assert.equal(beneficiaryBalance.toNumber(), 499000, "Beneficiary balance wasn't released")
  });
});
