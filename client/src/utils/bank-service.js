import BankAbi from "../contracts/Bank.json";

export default class BankService {
  contractAddr;
  web3Service;
  bankAbi;
  contract;

  constructor(contractAddr, web3Service) {
    this.contractAddr = contractAddr;
    this.web3Service = web3Service;
    this.bankAbi = BankAbi.abi;
  }

  async initContract() {
    this.contract = await this.web3Service.initContract(
      this.bankAbi,
      this.contractAddr
    );
    return this.contract;
  }

  async getAllEvents() {
    if (!this.contract) {
      await this.initContract();
    }
    let events = await this.contract.getPastEvents("allEvents", {
      fromBlock: 0,
      toBlock: "latest",
    });
    return events;
  }

  async getInterestRate() {
    if (!this.contract) {
      await this.initContract();
    }
    let interestRate = await this.contract.methods.getInterestRate().call();

    return interestRate;

    // bankInstance.getInterestRate.call().then(function(interestRate){
    //   console.log("Reserve interestRate: " + interestRate.toString());
    //   reservePanel.find('.interestRate').text(interestRate);
    // });
  }

  async rageQuit(from, amount, encodedPayload) {
    if (!this.contract) {
      await this.initContract();
    }
    if (encodedPayload) {
      const data = this.contract.methods.ragequit(amount).encodeABI();
      return data;
    }

    let rage = this.contract.methods
      .ragequit(amount)
      .send({ from })
      .once("transactionHash", (txHash) => {})
      .then((resp) => {
        return resp;
      })
      .catch((err) => {
        console.log(err);
        return { error: "rejected transaction" };
      });
    return rage;
  }
}

// bankInstance.getDebtTokenPrice.call().then(function(debtTokenPrice){
//   bankInstance.getDebtTokenPriceGranularity.call().then(function(debtTokenPriceGranularity){
//     console.log("Reserve debtTokenPrice: " + debtTokenPrice.toString());
//     reservePanel.find('.debtTokenPrice').text(debtTokenPrice/debtTokenPriceGranularity);
//   });
// });
// bankInstance.getCollateralTokenPrice.call().then(function(collateralTokenPrice){
//   bankInstance.getCollateralTokenPriceGranularity.call().then(function(collateralTokenPriceGranularity){
//     console.log("Reserve collateralTokenPrice: " + collateralTokenPrice.toString());
//     reservePanel.find('.collateralTokenPrice').text(collateralTokenPrice/collateralTokenPriceGranularity);
//   });
// });
// bankInstance.getInterestRate.call().then(function(interestRate){
//   console.log("Reserve interestRate: " + interestRate.toString());
//   reservePanel.find('.interestRate').text(interestRate);
// });
// bankInstance.getOriginationFee.call().then(function(originationFee){
//   console.log("Reserve originationFee: " + originationFee.toString());
//   reservePanel.find('.originationFee').text(originationFee);
// });
// bankInstance.getCollateralizationRatio.call().then(function(collateralizationRatio){
//   console.log("Reserve collateralizationRatio: " + collateralizationRatio.toString());
//   reservePanel.find('.collateralizationRatio').text(collateralizationRatio);
// });
// bankInstance.getLiquidationPenalty.call().then(function(liquidationPenalty){
//   console.log("Reserve liquidationPenalty: " + liquidationPenalty.toString());
//   reservePanel.find('.liquidationPenalty').text(liquidationPenalty);
// });
// bankInstance.getReserveBalance.call().then(function(reserveBalance){
//   console.log("Reserve: " + reserveBalance.toString());
//   reservePanel.find('.debtReserveBalance').text(reserveBalance/1e18);
// });
// bankInstance.getVaultCollateralAmount.call().then(function(collateral){
//   console.log(collateral.toString());
//   vaultPanel.find('.collateralAmount').text(collateral/1e18);
// });
// bankInstance.getVaultRepayAmount.call().then(function(debt){
//   console.log(debt.toString());
//   $('.input-repay').val(debt/1e18);
//   $('.input-dt-approve').val(debt/1e18);
//   vaultPanel.find('.debtAmount').text(debt/1e18);
// });
// bankInstance.getVaultCollateralizationRatio.call(account).then(function(ratio){
//   console.log(ratio);
//   vaultPanel.find('.collateralizationRatio').text((ratio/100).toString() + '%');
// });
