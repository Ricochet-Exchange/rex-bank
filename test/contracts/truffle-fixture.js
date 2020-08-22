const CMDToken = artifacts.require("CMDToken");
const TestToken = artifacts.require("TestToken");
const TokenVesting = artifacts.require("TokenSafe")
const SafeERC20 = artifacts.require("SafeERC20")
const SafeMath = artifacts.require("SafeMath")
const BankFactory = artifacts.require("BankFactory")
const Bank = artifacts.require("Bank")

const TellorTransfer = artifacts.require("usingtellor/contracts/libraries/TellorTransfer.sol");
const TellorDispute = artifacts.require("usingtellor/contracts/libraries/TellorDispute.sol");
const TellorLibrary = artifacts.require("usingtellor/contracts/libraries/TellorLibrary.sol");
const TellorGettersLibrary = artifacts.require("usingtellor/contracts/libraries/TellorGettersLibrary.sol");
const Tellor = artifacts.require("usingtellor/contracts/Tellor.sol");
const TellorMaster = artifacts.require("usingtellor/contracts/TellorMaster.sol");


module.exports = async function () {
  const mainAccount = web3.eth.accounts[0];
  const otherAccount = web3.eth.accounts[1];
  // ---------------------------------- token ----------------------------------
  // Link the library for the TokenVesting Contract
  const safeERC20 = await SafeERC20.new({from: mainAccount});
  SafeERC20.setAsDeployed(safeERC20);
  TokenVesting.link(SafeERC20);

  // Deploy the TokenVesting contract & CMDToken
  const tokenVesting = await TokenVesting.new(otherAccount, Date.now(), {from: mainAccount});
  TokenVesting.setAsDeployed(tokenVesting);

  const cmdToken = await CMDToken.new(tokenVesting.address, {from: mainAccount});
  CMDToken.setAsDeployed(cmdToken);
  // ---------------------------------------------------------------------------
  // ---------------------------------- tellor ---------------------------------
  const tellorTransfer = await TellorTransfer.new({from: mainAccount});
  TellorTransfer.setAsDeployed(tellorTransfer);
  TellorTransfer.link(TellorLibrary, Tellor, TellorMaster)
  const tellorLibrary = await TellorLibrary.new({from: mainAccount});
  TellorLibrary.setAsDeployed(tellorLibrary);
  TellorLibrary.link(Tellor);

  const tellorDispute = await TellorDispute.new({from: mainAccount});
  TellorDispute.setAsDeployed(tellorDispute);
  TellorDispute.link(Tellor);
  const tellor = await Tellor.new({from: mainAccount});
  Tellor.setAsDeployed(tellor);

  const tellorGettersLibrary = await TellorGettersLibrary.new({from: mainAccount});
  TellorGettersLibrary.setAsDeployed(tellorGettersLibrary);
  TellorGettersLibrary.link(TellorMaster);

  const tellor2 = await Tellor.new({from: mainAccount});
  Tellor.setAsDeployed(tellor2);

  const tellorMaster = await TellorMaster.new(tellor2.address, {from: mainAccount});
  TellorMaster.setAsDeployed(tellorMaster);
  // ---------------------------------------------------------------------------
  // ---------------------------------- bank -----------------------------------
  const dt = await TestToken.new("USD Token", "USDT", 10000000000000000000000);
  TestToken.setAsDeployed(dt);

  const ct = await TestToken.new("Gold", "GLD", 10000000000000000000000);
  TestToken.setAsDeployed(ct);

  const bank = await Bank.new(tellorMaster.address);
  Bank.setAsDeployed(bank);
  // ---------------------------------------------------------------------------
  // ---------------------------------- bankFactory ----------------------------
  // Link the library for the BankFactory Contract
  const safeMath = await SafeMath.new({from: mainAccount});
  SafeMath.setAsDeployed(safeMath);
  BankFactory.link(SafeMath);

  // Deploy the BankFactory contract & CMDToken
  const bankFactory = await BankFactory.new(bank.address, {from: mainAccount});
  BankFactory.setAsDeployed(bankFactory);
  // ---------------------------------------------------------------------------
};
