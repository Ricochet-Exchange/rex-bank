const CMDToken = artifacts.require("CMDToken");
const TestToken = artifacts.require("TestToken");
const TokenSafe = artifacts.require("TokenSafe")
const SafeERC20 = artifacts.require("SafeERC20")
const SafeMath = artifacts.require("SafeMath")
const BankFactory = artifacts.require("BankFactory")
const Bank = artifacts.require("Bank")

const TellorTransfer = artifacts.require("TellorTransfer");
const TellorDispute = artifacts.require("TellorDispute");
const TellorLibrary = artifacts.require("TellorLibrary");
const TellorGettersLibrary = artifacts.require("TellorGettersLibrary");
const Tellor = artifacts.require("Tellor");
const TellorMaster = artifacts.require("TellorMaster");
const Utilities = artifacts.require("Utilities");

/**
 *@dev Use this for setting up contracts for testing
 */
function sleep_s(secs) {
  secs = (+new Date) + secs * 1000;
  while ((+new Date) < secs);
}

module.exports = async function () {
  const [mainAccount, otherAccount] = await web3.eth.getAccounts();

  const safeMath = await SafeMath.new({from: mainAccount});
  await SafeMath.setAsDeployed(safeMath);
  // ---------------------------------- token ----------------------------------
  // Link the library for the TokenSafe Contract

  const safeERC20 = await SafeERC20.new({from: mainAccount});
  await SafeERC20.setAsDeployed(safeERC20);

  // Deploy the TokenSafe contract & CMDToken
  const tokenSafe = await TokenSafe.new(otherAccount, Date.now(), {from: mainAccount});
  await TokenSafe.setAsDeployed(tokenSafe);

  const cmdToken = await CMDToken.new(tokenSafe.address, {from: mainAccount});
  await CMDToken.setAsDeployed(cmdToken);
  // ---------------------------------------------------------------------------
  // ---------------------------------- tellor ---------------------------------
  const tellorTransfer = await TellorTransfer.new({from: mainAccount});
  await TellorTransfer.setAsDeployed(tellorTransfer);

  const tellorGettersLibrary = await TellorGettersLibrary.new({from: mainAccount});
  await TellorGettersLibrary.setAsDeployed(tellorGettersLibrary);


  const tellorDispute = await TellorDispute.new({from: mainAccount});
  await TellorDispute.setAsDeployed(tellorDispute);

  const utilities = await Utilities.new({from: mainAccount});
  await Utilities.setAsDeployed(utilities);

  // await TellorLibrary.link(tellorDispute);
  await TellorLibrary.link(utilities);
  const tellorLibrary = await TellorLibrary.new({from: mainAccount});
  await TellorLibrary.setAsDeployed(tellorLibrary);

  Tellor.link(tellorDispute);
  Tellor.link(tellorTransfer);
  Tellor.link(tellorLibrary);
  const tellor1 = await Tellor.new({from: mainAccount});
  Tellor.setAsDeployed(tellor1);

  TellorMaster.link(tellorTransfer);
  TellorMaster.link(tellorGettersLibrary);

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

  BankFactory.link(safeMath);

  // Deploy the BankFactory contract & CMDToken
  const bankFactory = await BankFactory.new(bank.address, {from: mainAccount});
  BankFactory.setAsDeployed(bankFactory);
  // ---------------------------------------------------------------------------
};
