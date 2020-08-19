const CMDToken = artifacts.require("CMDToken");
const TokenSafe = artifacts.require("TokenSafe");
const {
  ether,
  time,
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

contract("tokenSafe", ([manager, other]) =>  {
  beforeEach(async function() {
    this.tokenSafe = await TokenSafe.new(other, Date.now(), { from: manager });
    this.cmdToken = await CMDToken.new(this.tokenSafe.address, { from: manager });
  })

  it("should hold the 499,000 other tokens not distributed", async function() {
    const tokenSafeBalance = await this.cmdToken.balanceOf(this.tokenSafe.address);
    const managerBalance = await this.cmdToken.balanceOf(manager);
    assert.equal(tokenSafeBalance.toNumber(), 499000, "TokenSafe balance didn't initialize properly")
    assert.equal(managerBalance.toNumber(), 1000, "Manager balance didn't initialize properly")
  });

  it("should have assigned the other account to be the beneficiary", async function() {
    const beneficiaryAddress = await this.tokenSafe.beneficiary();
    assert.equal(beneficiaryAddress, other, `TokenSafe's beneficiary didn't match other account, was ${beneficiaryAddress}`)

    // const beneficiaryBalance = await this.cmdToken.balanceOf(other);
    // console.log(beneficiaryBalance.toNumber())
    // assert.equal(managerBalance.toNumber(), 1000, "Manager balance didn't initialize properly")
  });

});
