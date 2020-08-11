import Erc20Bytes32Abi from "../contracts/Erc20bytes32.json";
import Erc20Abi from "../contracts/Erc20.json";

export default class TokenService {
  tokenAddress;
  web3Service;
  contract;
  contract32;
  abi;

  constructor(tokenAddress, web3Service) {
    this.web3Service = web3Service;
    this.abi = Erc20Abi;
    this.tokenAddress = tokenAddress;
  }

  async initContract(abi = this.abi) {
    this.contract = await this.web3Service.initContract(abi, this.tokenAddress);
    return this.contract;
  }

  async getSymbol() {
    let symbol;

    try {
      if (!this.contract) {
        this.contract = await this.initContract(Erc20Abi);
      }
      symbol = await this.contract.methods.symbol().call();
    } catch {
      if (!this.contract32) {
        this.contract32 = await this.initContract(Erc20Bytes32Abi);
      }
      symbol = await this.contract32.methods.symbol().call();
    }

    if (symbol.indexOf("0x") > -1) {
      symbol = this.web3Service.toUtf8(symbol);
    }

    return symbol;
  }

  async getDecimals() {
    let decimals;

    if (!this.contract) {
      await this.initContract();
    }

    try {
      decimals = await this.contract.methods.decimals().call();
      return decimals;
    } catch {
      return 18;
    }
  }

  async balanceOf(account, atBlock = "latest") {
    if (!this.contract) {
      await this.initContract();
    }

    const balanceOf = await this.contract.methods
      .balanceOf(account)
      .call({}, atBlock);

    return balanceOf;
  }

  async allowance(accountAddr, tokenAddress) {
    if (!this.contract) {
      await this.initContract();
    }
    const allowance = await this.contract.methods
      .allowance(accountAddr, tokenAddress)
      .call();
    return allowance;
  }

  async approve(from, guy, wad) {
    if (!this.contract) {
      await this.initContract();
    }

    if (!wad) {
      //set max
      wad = this.web3Service.web3.utils
        .toBN(2)
        .pow(this.web3Service.web3.utils.toBN(255));
    }

    const approve = await this.contract.methods
      .approve(guy, wad)
      .send({ from })
      .once("transactionHash", (txHash) => {})
      .then((resp) => {
        return resp;
      })
      .catch((err) => {
        console.log(err);
        return { error: "rejected transaction" };
      });

    return approve;
  }
}
