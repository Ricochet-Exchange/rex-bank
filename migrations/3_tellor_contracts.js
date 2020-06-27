/****Uncomment the body below to run this with Truffle migrate for truffle testing*/
var TellorTransfer = artifacts.require("../node_modules/usingtellor/contracts/libraries/TellorTransfer.sol");
var TellorDispute = artifacts.require("./usingtellor/contracts/libraries/TellorDispute.sol");
var TellorLibrary = artifacts.require("../node_modules/usingtellor/contracts/libraries/TellorLibrary.sol");
var TellorGettersLibrary = artifacts.require("../node_modules/usingtellor/contracts/libraries/TellorGettersLibrary.sol");
var Tellor = artifacts.require("../node_modules/usingtellor/contracts/Tellor.sol");
var TellorMaster = artifacts.require("../node_modules/usingtellor/contracts/TellorMaster.sol");
/****Uncomment the body to run this with Truffle migrate for truffle testing*/
var Bank = artifacts.require("Bank");
var CT = artifacts.require("GLDToken");
var DT = artifacts.require("USDToken");

/**
*@dev Use this for setting up contracts for testing
*/

module.exports = async function (deployer, network) {
  if (network == "rinkeby") {

    let daiAddress = "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa";
    let trbAddress = "0xfe41cb708cd98c5b20423433309e55b53f79134a";
    let tellorOracleAddress = "0xFe41Cb708CD98C5B20423433309E55b53F79134a";
    let interestRate = 12;
    let originationFee = 1;
    let collateralizationRatio = 150;
    let liquidationPenalty = 20;
    let period = 86400;
    let trbusdRequestId = 50;
    let daiusdRequestId = 39;
    let initialPrice = 1000000;
    let priceGranularity = 1000000;

    await deployer.deploy(Bank, interestRate, originationFee, collateralizationRatio, liquidationPenalty, period,
                          trbAddress, trbusdRequestId, initialPrice, priceGranularity,
                          daiAddress, daiusdRequestId, initialPrice, priceGranularity,
                          tellorOracleAddress);

  } else if(network == "development") {

    await deployer.deploy(TellorTransfer);
    await deployer.deploy(TellorDispute);
    await deployer.deploy(TellorGettersLibrary);

    await deployer.link(TellorTransfer, TellorLibrary);
    await deployer.deploy(TellorLibrary);

    await deployer.link(TellorTransfer,Tellor);
    await deployer.link(TellorDispute,Tellor);
    await deployer.link(TellorLibrary,Tellor);
    await deployer.deploy(Tellor);

    await deployer.link(TellorTransfer,TellorMaster);
    await deployer.link(TellorGettersLibrary,TellorMaster);
    await deployer.deploy(Tellor);
    await deployer.deploy(TellorMaster, Tellor.address);
    await deployer.deploy(CT, "10000000000000000000000");
    await deployer.deploy(DT, "10000000000000000000000");
    await deployer.deploy(Bank, 12, 1, 150, 20, 86400, CT.address, 1, 1000000, 1000000, DT.address, 2, 1000000, 1000000, TellorMaster.address);

  }

};
