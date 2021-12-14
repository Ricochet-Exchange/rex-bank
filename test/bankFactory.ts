// https://github.com/Sanghren/avalanche-hardhat-fork-tutorial
import { assert, expect } from "chai";
import { } from "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { Bank, BankFactory, GLDToken, TellorPlayground, USDToken } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, BytesLike, ContractTransaction } from "ethers";
import { isBytesLike, parseBytes32String } from "ethers/lib/utils";

describe("BankFactory", function () {

  // Bank Parameters
  const BANK_NAME = "Test Bank";
  const INTEREST_RATE = 12;
  const ORIGINATION_FEE = 1;
  const COLLATERALIZATION_RATIO = 150;
  const LIQUIDATION_PENALTY = 25;
  const PERIOD = 86400;

  // Tellor Oracle
  const TELLOR_ORACLE_ADDRESS = '0xACC2d27400029904919ea54fFc0b18Bf07C57875';
  const TELLOR_REQUEST_ID = 60;

  let logs;
  let clone: string | ContractTransaction;
  let newBank: string;   //: Promise<Bank>;
  let bankAddress: string;
  let bankFactoryInstance: BankFactory;
  let bankInstance: Bank;
  let bankInstance2: Bank;
  let ctInstance: GLDToken;
  let dtInstance: USDToken;
  let tp: TellorPlayground;
  let deployer: SignerWithAddress;
  let randomUser: SignerWithAddress;
  // const DEFAULT_ADMIN_ROLE = ethers.utils.formatBytes32String("0x00000000000000000000000000000000000000000000000000000000000000");
  const DEFAULT_ADMIN_ROLE = 0x00000000000000000000000000000000000000000000000000000000000000;
  // const DEFAULT_ADMIN_ROLE = ethers.utils.formatBytes32String("0x00");
  // let adminRole: BytesLike;
  // const DEFAULT_ADMIN_ROLE = parseBytes32String("0x00"); //  ethers.utils.formatBytes32String("0x00");
  let esvalido = false;
  let depositAmount = ethers.BigNumber.from(100);
  let largeDepositAmount = ethers.BigNumber.from(100);
  let withdrawAmount = ethers.BigNumber.from(50);
  let borrowAmount = ethers.BigNumber.from(66);
  let largeBorrowAmount = ethers.BigNumber.from(75);
  let smallBorrowAmount = ethers.BigNumber.from(30);
  const TWO = ethers.BigNumber.from(2);
  const ONE = ethers.BigNumber.from(1);
  const ZERO = ethers.BigNumber.from(0);

  before(async function () {

    // adminRole = ethers.utils.hashMessage([DEFAULT_ADMIN_ROLE]);
    // esvalido = isBytesLike(adminRole);
    // console.log("es de 32 bytes ? ---> " + esvalido);

    // get signers
    [, deployer, randomUser] = await ethers.getSigners();

    const bankFactory = (await ethers.getContractFactory(
      "BankFactory",
      deployer
    ));
    const bank = (await ethers.getContractFactory(
      "Bank",
      deployer
    ));
    const bank2 = (await ethers.getContractFactory(
      "Bank",
      deployer
    ));

    bankInstance = await bank.deploy(TELLOR_ORACLE_ADDRESS);
    bankInstance2 = await bank2.deploy(TELLOR_ORACLE_ADDRESS);
    // await bankInstance.deployed();
    bankFactoryInstance = await bankFactory.deploy(bankInstance.address);
    await bankFactoryInstance.deployed();

    // Deploy Tellor Oracle contracts
    const TellorPlayground = await ethers.getContractFactory('TellorPlayground');
    tp = await TellorPlayground.attach(TELLOR_ORACLE_ADDRESS);
    tp = tp.connect(deployer);

    // Bank set up
    const CT = await ethers.getContractFactory("GLDToken");
    const DT = await ethers.getContractFactory("USDToken");
    ctInstance = await CT.deploy(ethers.BigNumber.from(10000));
    dtInstance = await DT.deploy(ethers.BigNumber.from(10000));
    // Deployed bank factory, sets which bank contract to reference when cloning
    // bankFactory = await BankFactory.deploy(bank.address);

    await ctInstance.transfer(randomUser.address, ethers.BigNumber.from(500));  // TODO
    await dtInstance.transfer(randomUser.address, ethers.BigNumber.from(500));  // TODO
  });

  describe("createBank", () => {

    it.skip("should be owned by the creator", async function () {
      let owner = await bankFactoryInstance.owner();
      assert.equal(owner, await deployer.getAddress());
    });

    it("should emit a BankCreated event", async function () {
      expect(
        clone = await bankFactoryInstance.connect(randomUser).createBank(BANK_NAME, INTEREST_RATE,
          ORIGINATION_FEE, COLLATERALIZATION_RATIO, LIQUIDATION_PENALTY, PERIOD, TELLOR_ORACLE_ADDRESS))
        .to.emit(bankFactoryInstance, "BankCreated");
    });

    it("should accept emitted events with correct bank address", async function () {
      bankAddress = await bankFactoryInstance.getBankAddressAtIndex(0);
      const filter = bankFactoryInstance.filters.BankCreated();
      // beware about an error regarding the block number in mainnet forking
      logs = bankFactoryInstance.queryFilter(filter, parseInt(`${process.env.FORK_BLOCK_NUMBER}`));
      (await logs).forEach((log) => {
        // console.log("new bank: " + log.args.newBankAddress + "  owner: " + log.args.owner);
        console.log("===== bankAddress: " + bankAddress);
        assert.equal(log.args.newBankAddress, bankAddress);
        newBank = log.args.newBankAddress;
      });
    });

    it("should create a bank clone with correct parameters", async function () {

      let myBank = await bankInstance.attach(newBank);
      console.log("===== newBank: " + newBank);
      // myBank = myBank.connect(randomUser);
      await myBank.deployed();
      // await myBank.deployTransaction.wait();   // Error
      console.log("randomUser.address: " + randomUser.address);
      console.log("collateral.tokenAddress: " + await bankInstance.getCollateralTokenAddress());
      console.log("collateralToken: " + await ctInstance.address);
      // await bankInstance.setCollateral(ctInstance.address, 2, 1000, 1000, { "from": randomUser.address });   // IMP. ---> Error
      await bankInstance.connect(randomUser).setCollateral(ctInstance.address, 2, 1000, 1000);
      await bankInstance.connect(randomUser).setDebt(dtInstance.address, 1, 1000, 1000);
      console.log("bankInstance.address: " + bankInstance.address);
      console.log("myBank.address: " + myBank.address);
      const interestRate = await myBank.getInterestRate();
      console.log(" AAAAAAAAAAA - interestRate: " + interestRate);
      const originationFee = await myBank.getOriginationFee();
      const collateralizationRatio = await myBank.getCollateralizationRatio();
      const liquidationPenalty = await myBank.getLiquidationPenalty();
      const reserveBalance = await myBank.getReserveBalance();
      const reserveCollateralBalance = await myBank.getReserveCollateralBalance();
      // const owner = await bankInstance.DEFAULT_ADMIN_ROLE;         // TODO
      const dtAddress = await myBank.getDebtTokenAddress();
      const ctAddress = await myBank.getCollateralTokenAddress();
      const bankCount = await bankFactoryInstance.getNumberOfBanks();
      const bankAddress = await bankFactoryInstance.getBankAddressAtIndex(0);

      // assert.equal(bankAddress, bankClone.address);
      // assert(bankCount.eq(ethers.BigNumber.from(2)));      // TODO
      // assert.equal(owner, _accounts[1])
      assert(interestRate.eq(ethers.BigNumber.from(INTEREST_RATE)));     // assert.equal(1, 1);  // works as expected
      // assert.equal(ethers.utils.formatUnits(originationFee, 18), ORIGINATION_FEE);
      assert(originationFee.eq(ethers.BigNumber.from(ORIGINATION_FEE)));
      assert(collateralizationRatio.eq(ethers.BigNumber.from(COLLATERALIZATION_RATIO)));
      assert(liquidationPenalty.eq(ethers.BigNumber.from(LIQUIDATION_PENALTY)));
      assert(reserveBalance.eq(ZERO));
      assert(reserveCollateralBalance.eq(ZERO));
      console.log(" CCCCCCCCCCCC - interestRate: " + interestRate);

      assert(dtAddress, dtInstance.address);
      assert(ctAddress, ctInstance.address);     // assert.equal(ctAddress, this.ct.address);
    });   // End of "it" block

  });


  describe.skip("getNumberOfBanks", () => {
    it("should return the correct number", async () => {

    });
  });

  describe.skip("getBankAddressAtIndex", () => {
    it("should return the correct address", async () => {

    });
  });
});

  // random address from polygonscan that have a lot of usdcx
  // const OWNER_ADDRESS = '0x3226C9EaC0379F04Ba2b1E1e1fcD52ac26309aeA';

  // // Tellor Oracle
  // const TELLOR_ORACLE_ADDRESS = '0xACC2d27400029904919ea54fFc0b18Bf07C57875';
  // const TELLOR_REQUEST_ID = 60;


  // describe("Bank Factory", function () {
  //   beforeEach(async function () {
  //     // const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");  // TODO
  //     await ethers.provider.send(
  //       "hardhat_reset",
  //       [
  //         {
  //           forking: {
  //             jsonRpcUrl: `https://green-nameless-water.matic.quiknode.pro/${process.env.QUICKNODE_ENDPOINT}/`,
  //             blockNumber: parseInt(`${process.env.FORK_BLOCK_NUMBER}`),
  //           }
  //         }
  //       ]
  //     );

  //     // const signer = provider.getSigner(); // connect to JSON-RPC accounts

  //     // get Signers
  //     [deployer] = await ethers.getSigners();
  //     // let owner = await ethers.provider.getSigner(OWNER_ADDRESS);
  //     // const bankAbi = abi;  // artifacts.require("Bank");
  //     // bankContract = new ethers.Contract(bank.address, abi, owner);
  //     // const level = await new ethers.Contract(CONTRACT, abi, deployer);

  //     const tellorPlayground = await ethers.getContractFactory("TellorPlayground");
  //     let tp = await tellorPlayground.attach(TELLOR_ORACLE_ADDRESS);
  //     // tp = tp.connect(owner);
  //     tp = tp.connect(deployer);

  //     // In ethers, a signer is an abstraction of an Ethereum Account
  //     // let accounts = await ethers.getSigners();
  //     // account_1 = accounts[0];
  //     const Bank = await ethers.getContractFactory("Bank");
  //     const BankFactory = await ethers.getContractFactory("BankFactory");

  //     // Bank set up
  //     const CT = await ethers.getContractFactory("GLDToken");
  //     const DT = await ethers.getContractFactory("USDToken");
  //     let ct = await CT.deploy(ethers.BigNumber.from(10000));
  //     let dt = await DT.deploy(ethers.BigNumber.from(10000));
  //     // Deployed bank factory, sets which bank contract to reference when cloning
  //     bankFactory = await BankFactory.deploy(bank.address);
  //     let depositAmount = ethers.BigNumber.from(100);
  //     let largeDepositAmount = ethers.BigNumber.from(100);
  //     let withdrawAmount = ethers.BigNumber.from(50);
  //     let borrowAmount = ethers.BigNumber.from(66);
  //     let largeBorrowAmount = ethers.BigNumber.from(75);
  //     let smallBorrowAmount = ethers.BigNumber.from(30);
  //     let two = ethers.BigNumber.from(2);
  //     let one = ethers.BigNumber.from(1);
  //     let zero = ethers.BigNumber.from(0);

  //     await ct.transfer(account_1, ethers.BigNumber.from(500));
  //     await dt.transfer(account_1, ethers.BigNumber.from(500));
  //   });

  // });


