/****Uncomment the body below to run this with Truffle migrate for truffle testing*/
var TellorTransfer = artifacts.require("../node_modules/usingtellor/contracts/libraries/TellorTransfer.sol");
var TellorDispute = artifacts.require("./usingtellor/contracts/libraries/TellorDispute.sol");
var TellorLibrary = artifacts.require("../node_modules/usingtellor/contracts/libraries/TellorLibrary.sol");
var TellorGettersLibrary = artifacts.require("../node_modules/usingtellor/contracts/libraries/TellorGettersLibrary.sol");
var Tellor = artifacts.require("../node_modules/usingtellor/contracts/Tellor.sol");
var TellorMaster = artifacts.require("../node_modules/usingtellor/contracts/TellorMaster.sol");
/****Uncomment the body to run this with Truffle migrate for truffle testing*/
var Bank = artifacts.require("Bank");
var BankFactory = artifacts.require("BankFactory");
var CT = artifacts.require("GLDToken");
var DT = artifacts.require("USDToken");

/**
*@dev Use this for setting up contracts for testing
*/

module.exports = async function (deployer, network, accounts) {

  // Deploy for Ricochet Lending inital RIC/USDCx lending pool
  let interestRate = 1200;
  let originationFee = 100;
  let collateralizationRatio = 150;
  let liquidationPenalty = 20;
  let period = 86400;
  let ricusdRequestId = 77;
  let usdcusdRequestId = 78;
  let initialPriceRic = 31000;
  let initialPriceUsdc = 100000;
  let priceGranularity = 1000000;
  let ricAddress = "0x263026e7e53dbfdce5ae55ade22493f828922965";
  let usdcxAddress = "0xCAa7349CEA390F89641fe306D93591f87595dc1F";
  let tellorOracleAddress = "0xACC2d27400029904919ea54fFc0b18Bf07C57875";

  if (network == "polygon") {

    await deployer.deploy(Bank, tellorOracleAddress);
    let bank = await Bank.deployed()
    await deployer.deploy(BankFactory, bank.address);
    let bankFactory = await BankFactory.deployed();

    // TRB/DAI
    let clone1 = await bankFactory.createBank("REX Bank", interestRate, originationFee, collateralizationRatio, liquidationPenalty, period, tellorOracleAddress);
    let bankClone1 = await Bank.at(clone1.logs[0].args.newBankAddress);
    await bankClone1.setCollateral(ricAddress, ricusdRequestId, priceGranularity, initialPriceRic);
    await bankClone1.setDebt(usdcxAddress, usdcusdRequestId, priceGranularity, initialPriceUsdc);

    console.log("BankFactory: " + bankFactory.address);
    console.log("Bank: " + bank.address);
    console.log("REX Bank: " + bankClone1.address);
    console.log("Initial RIC Price:", (await bankClone1.getCollateralTokenPrice()).toString())


  }
  // else if (network == "rinkeby" || network == "rinkeby-fork") {
  //
  //   daiAddress = "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa";
  //   trbAddress = "0xfe41cb708cd98c5b20423433309e55b53f79134a";
  //   tellorOracleAddress = "0xFe41Cb708CD98C5B20423433309E55b53F79134a";
  //
  // } else if (network == "mainnet" || network == "mainnet-fork") {
  //
  //   daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
  //   trbAddress = "0x0ba45a8b5d5575935b8158a88c631e9f9c95a2e5";
  //   tellorOracleAddress = "0x0ba45a8b5d5575935b8158a88c631e9f9c95a2e5";
  //
  // } else if(network == "development") {
  //
  //   await deployer.deploy(TellorTransfer);
  //   await deployer.deploy(TellorDispute);
  //   await deployer.deploy(TellorGettersLibrary);
  //   await deployer.link(TellorTransfer, TellorLibrary);
  //   await deployer.deploy(TellorLibrary);
  //   await deployer.link(TellorTransfer,Tellor);
  //   await deployer.link(TellorDispute,Tellor);
  //   await deployer.link(TellorLibrary,Tellor);
  //   await deployer.deploy(Tellor);
  //   await deployer.link(TellorTransfer,TellorMaster);
  //   await deployer.link(TellorGettersLibrary,TellorMaster);
  //   await deployer.deploy(Tellor);
  //   await deployer.deploy(TellorMaster, Tellor.address);
  //   await deployer.deploy(CT, "10000000000000000000000");
  //   await deployer.deploy(DT, "10000000000000000000000");
  //   daiAddress = DT.address;
  //   trbAddress = CT.address;
  //   tellorOracleAddress = TellorMaster.address;
  //
  // }


  if(network == "development") {
    // Local development setup two banks


    // Funding
    let dt = await DT.deployed()
    await dt.approve(bankClone1.address, web3.utils.toWei("1000", "ether"))
    await bankClone1.reserveDeposit(web3.utils.toWei("1000", "ether"))

    // DAI/TRB
    let clone2 = await bankFactory.createBank("Initial Bank 2", interestRate, originationFee, collateralizationRatio, liquidationPenalty, period, tellorOracleAddress);
    let bankClone2 = await Bank.at(clone2.logs[0].args.newBankAddress);
    await bankClone2.setDebt(trbAddress, trbusdRequestId, priceGranularity, initialPrice);
    await bankClone2.setCollateral(daiAddress, daiusdRequestId, priceGranularity, initialPrice);
    dt = await CT.deployed()
    await dt.approve(bankClone2.address, web3.utils.toWei("1000", "ether"))
    await bankClone2.reserveDeposit(web3.utils.toWei("1000", "ether"))

    console.log("TRB/DAI: " + bankClone1.address);
    console.log("DAI/TRB: " + bankClone2.address);

  }

};
