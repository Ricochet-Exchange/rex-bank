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
  let initialPriceRic = 300000;
  let initialPriceUsdc = 1000000;
  let priceGranularity = 1000000;
  let ricAddress = "0x263026e7e53dbfdce5ae55ade22493f828922965";
  let usdcxAddress = "0xCAa7349CEA390F89641fe306D93591f87595dc1F";
  let tellorOracleAddress = "0xACC2d27400029904919ea54fFc0b18Bf07C57875";
  let deployerAddress = "0x3226C9EaC0379F04Ba2b1E1e1fcD52ac26309aeA";

  if (network == "local" || network == "polygon") {

    await deployer.deploy(Bank, tellorOracleAddress);
    let bank = await Bank.deployed();
    await deployer.deploy(BankFactory, bank.address);
    let bankFactory = await BankFactory.deployed();

    console.log("Bank owner", await bank.owner())
    console.log("Deployed");
    // TRB/DAI
    let clone1 = await bankFactory.createBank("REX Bank", interestRate, originationFee, collateralizationRatio, liquidationPenalty, period, tellorOracleAddress);
    console.log("createBank")
    let bankClone1 = await Bank.at(clone1.logs[0].args.newBankAddress);
    await bankClone1.setCollateral(ricAddress, ricusdRequestId, priceGranularity, initialPriceRic);
    await bankClone1.setDebt(usdcxAddress, usdcusdRequestId, priceGranularity, initialPriceUsdc);

    console.log("BankFactory: " + bankFactory.address);
    console.log("Bank: " + bank.address);
    console.log("REX Bank: " + bankClone1.address);
    console.log("Initial RIC Price:", (await bankClone1.getCollateralTokenPrice()).toString())


  }


};
