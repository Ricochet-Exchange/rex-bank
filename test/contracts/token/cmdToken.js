const CMDToken = artifacts.require("CMDToken");
const TokenSafe = artifacts.require("TokenSafe");

contract("CMDToken", ([manager, other]) => {
  beforeEach(async function() {
    this.tokenSafe = await TokenSafe.new(other, Date.now(), { from: manager });
    this.cmdToken = await CMDToken.new(this.tokenSafe.address, { from: manager });
  })

  it("should show to proper balance of the TokenSafe", async function() {
    const balance = await this.cmdToken.balanceOf(this.tokenSafe.address);
    assert.equal(balance.toNumber(), 500000)
  })
})
