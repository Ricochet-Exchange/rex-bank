const CMDToken = artifacts.require("CMDToken");
const TokenSafe = artifacts.require("TokenSafe");

contract("CMDToken", ([manager, other]) => {
  beforeEach(async function() {
    this.tokenSafe = await TokenSafe.new(other, Date.now(), { from: manager });
    this.cmdToken = await CMDToken.new(this.tokenSafe.address, { from: manager });
  })

  it("should show to proper balance of 499,000 for the TokenSafe & 1,000 for the manager", async function() {
    const tokenSafeBalance = await this.cmdToken.balanceOf(this.tokenSafe.address);
    const managerBalance = await this.cmdToken.balanceOf(manager);
    assert.equal(tokenSafeBalance.toNumber(), 499000)
    assert.equal(managerBalance.toNumber(), 1000)
  })
})
