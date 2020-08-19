const CMDToken = artifacts.require("CMDToken");
const TokenVesting = artifacts.require("TokenSafe")
const SafeERC20 = artifacts.require("SafeERC20")


module.exports = async function (deployer, network, accounts) {
  const mainAccount = accounts[0];
  const receivingAccount = accounts[1];

  // Link the library for the TokenVesting Contract
  await deployer.deploy(SafeERC20);
  deployer.link(SafeERC20, TokenVesting);

  // Deploy the TokenVesting contract & CMDToken
  await deployer.deploy(TokenVesting, receivingAccount, Date.now());
  const tokenVesting = await TokenVesting.deployed();

  await deployer.deploy(CMDToken, tokenVesting.address);
};
