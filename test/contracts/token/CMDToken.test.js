const CMDToken = artifacts.require("CMDToken");
const TokenSafe = artifacts.require("TokenSafe");

contract("CMDToken", ([owner, other]) => {
  beforeEach(async function() {
    this.tokenSafe = await TokenSafe.new(other, Date.now(), { from: owner });
    this.cmdToken = await CMDToken.new(this.tokenSafe.address, { from: owner });
  })

  it("should show to proper balance of 499,000 for the TokenSafe & 1,000 for the owner", async function() {
    const tokenSafeBalance = await this.cmdToken.balanceOf(this.tokenSafe.address);
    const ownerBalance = await this.cmdToken.balanceOf(owner);
    assert.equal(tokenSafeBalance.toNumber(), 499000)
    assert.equal(ownerBalance.toNumber(), 1000)
  })
})
