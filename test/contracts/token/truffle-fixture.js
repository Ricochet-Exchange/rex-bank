const CMDToken = artifacts.require("CMDToken");
const TokenVesting = artifacts.require("TokenSafe")
const SafeERC20 = artifacts.require("SafeERC20")


module.exports = async function () {

  // ---------------------------------- token ----------------------------------
  const mainAccount = web3.eth.accounts[0];
  const receivingAccount = web3.eth.accounts[1];

  // Link the library for the TokenVesting Contract
  const safeERC20 = await SafeERC20.new({from: mainAccount});
  SafeERC20.setAsDeployed(safeERC20);
  TokenVesting.link(SafeERC20);

  // Deploy the TokenVesting contract & CMDToken
  const tokenVesting = await TokenVesting.new(receivingAccount, Date.now(), {from: mainAccount});
  TokenVesting.setAsDeployed(tokenVesting);

  const cmdToken = await CMDToken.new(tokenVesting.address, {from: mainAccount});
  CMDToken.setAsDeployed(cmdToken);
  // ---------------------------------------------------------------------------

};
