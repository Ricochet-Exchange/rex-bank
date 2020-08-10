import BankAbi from "../contracts/Bank.json";
import TokenService from "./token-service";

export default class BankService {
  contractAddr;
  web3Service;
  bankAbi;
  contract;

  constructor(contractAddr, web3Service, connectedAccount) {
    this.contractAddr = contractAddr;
    this.web3Service = web3Service;
    this.bankAbi = BankAbi.abi;
    this.connectedAccount = connectedAccount;
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

    const vault = await this.getVaultData();

    const debtTokenAddress = await this.contract.methods
      .getDebtTokenAddress()
      .call();
    const collateralTokenAddress = await this.contract.methods
      .getCollateralTokenAddress()
      .call();
    const debtToken = await this.getTokenData(debtTokenAddress);
    const collateralToken = await this.getTokenData(collateralTokenAddress);

    return {
      vault,
      debtToken: {
        ...debtToken,
        price: await this.contract.methods.getDebtTokenPrice().call(),
      },
      collateralToken: {
        ...collateralToken,
        price: await this.contract.methods
          .getCollateralTokenPriceGranularity()
          .call(),
      },
      interestRate: await this.contract.methods.getInterestRate().call(),
      originationFee: await this.contract.methods.getOriginationFee().call(),
      collateralizationRatio: await this.contract.methods
        .getCollateralizationRatio()
        .call(),
      liquidationPenalty: await this.contract.methods
        .getLiquidationPenalty()
        .call(),
      reserveBalance: await this.contract.methods.getReserveBalance().call(),
    };
  }

  async getTokenData(tokenAddress) {
    const tokenService = new TokenService(tokenAddress, this.web3Service);

    let unlocked = 0;
    if (this.connectedAccount !== "") {
      unlocked = await tokenService.allowance(
        this.connectedAccount,
        this.contractAddr
      );
    }

    return {
      address: tokenAddress,
      symbol: await tokenService.getSymbol(),
      unlockedAmount: unlocked,
    };
  }

  async getVaultData() {
    const collateralAmount = await this.contract.methods
      .getVaultCollateralAmount()
      .call();
    const repayAmount = await this.contract.methods
      .getVaultRepayAmount()
      .call();
    const debtAmount = await this.contract.methods.getVaultDebtAmount().call();

    return {
      collateralAmount,
      repayAmount,
      debtAmount,
      hasVault: +debtAmount > 0 && +collateralAmount > 0,
    };
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
