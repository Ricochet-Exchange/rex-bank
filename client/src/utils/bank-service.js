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

  async getBankState() {
    if (!this.contract) {
      await this.initContract();
    }

    return {
      debtTokenPrice: await this.contract.methods.getDebtTokenPrice().call(),
      collateralTokenPrice: await this.contract.methods
        .getCollateralTokenPriceGranularity()
        .call(),
      interestRate: await this.contract.methods.getInterestRate().call(),
      originationFee: await this.contract.methods.getOriginationFee().call(),
      collateralizationRatio: await this.contract.methods
        .getCollateralizationRatio()
        .call(),
      liquidationPenalty: await this.contract.methods
        .getLiquidationPenalty()
        .call(),
      reserveBalance: await this.contract.methods.getReserveBalance().call(),

      vaultCollateralAmount: await this.contract.methods
        .getVaultCollateralAmount()
        .call(),
      vaultRepayAmount: await this.contract.methods
        .getVaultRepayAmount()
        .call(),

      //   $('.input-repay').val(debt/1e18);
      //   $('.input-dt-approve').val(debt/1e18);
      //   vaultPanel.find('.debtAmount').text(debt/1e18);
      // });
    };
  }

  // bankInstance.getVaultCollateralizationRatio.call(account).then(function(ratio){
  //   console.log(ratio);
  //   vaultPanel.find('.collateralizationRatio').text((ratio/100).toString() + '%');
  // });

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
