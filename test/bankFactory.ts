import { assert, expect } from "chai";
import { ethers } from 'hardhat';

// import { ethers, deployments, getNamedAccounts } from "hardhat";
import { Bank, BankFactory, GLDToken, TellorPlayground, USDToken } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractTransaction, Signer } from "ethers";

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

  let filter;
  let myBank;
  let myBank2;
  let logs;
  let clone: string | ContractTransaction;
  let newBank: string;
  let bankFactoryInstance: BankFactory;
  let bankInstance: Bank;
  let bankInstance2: Bank;
  let bank;
  let bank2;
  let bankFactory;
  let ctInstance: GLDToken;
  let dtInstance: USDToken;
  let tp: TellorPlayground;
  let owner: string;
  let deployer: SignerWithAddress;
  let randomUser: SignerWithAddress;
  let randomUser2: SignerWithAddress;
  let randomUser3: SignerWithAddress;
  let randomUser4: SignerWithAddress;
  let randomUser5: SignerWithAddress;
  let randomUser6: SignerWithAddress;
  let randomUser7: SignerWithAddress;
  let randomUser8: SignerWithAddress;
  let randomUser9: SignerWithAddress;
  let depositAmount = ethers.BigNumber.from(100);
  let largeDepositAmount = ethers.BigNumber.from(5000);
  let withdrawAmount = ethers.BigNumber.from(50);
  let borrowAmount = ethers.BigNumber.from(66);
  let largeBorrowAmount = ethers.BigNumber.from(75);
  let smallBorrowAmount = ethers.BigNumber.from(20);
  const TWO = ethers.BigNumber.from(2);
  const ONE = ethers.constants.One;    // the same as "ethers.BigNumber.from(1);"
  const ZERO = ethers.BigNumber.from(0);

  before(async function () {

    // get signers
    [, deployer, randomUser, randomUser2, randomUser3, randomUser4, randomUser5, randomUser6,
      randomUser7, randomUser8, randomUser9] = await ethers.getSigners();

    bankFactory = (await ethers.getContractFactory(
      "BankFactory",
      deployer
    ));
    bank = (await ethers.getContractFactory(
      "Bank",
      deployer
    ));
    bank2 = (await ethers.getContractFactory(
      "Bank",
      deployer
    ));

    bankInstance = await bank.deploy(TELLOR_ORACLE_ADDRESS);
    // Deployed bank factory, sets which bank contract to reference when cloning
    bankFactoryInstance = await bankFactory.deploy(bankInstance.address);
    await bankFactoryInstance.deployed();
    // ===
    bankInstance2 = await bank2.deploy(TELLOR_ORACLE_ADDRESS);
    // Deployed bank factory, sets which bank contract to reference when cloning
    await bankInstance2.deployed();

    // Deploy Tellor Oracle contracts
    const TellorPlayground = await ethers.getContractFactory('TellorPlayground');
    tp = await TellorPlayground.attach(TELLOR_ORACLE_ADDRESS);
    tp = tp.connect(deployer);

    // Bank set up
    const CT = await ethers.getContractFactory("GLDToken");
    const DT = await ethers.getContractFactory("USDToken");
    ctInstance = await CT.deploy(ethers.BigNumber.from(10000));
    dtInstance = await DT.deploy(ethers.BigNumber.from(10000));

    await ctInstance.transfer(randomUser.address, ethers.BigNumber.from(500));
    await dtInstance.transfer(randomUser.address, ethers.BigNumber.from(500));
  });

  describe("createBank", () => {
    const FIRST_BANK_NUMBER = 0;
    const SECOND_BANK_NUMBER = 1;
    const THIRD_BANK_NUMBER = 2;

    it("should be owned by the creator", async function () {
      owner = await bankFactoryInstance.owner();
      assert.equal(owner, await deployer.getAddress());
    });

    it("should emit a BankCreated event", async function () {
      expect(
        clone = await bankFactoryInstance.connect(randomUser).createBank(BANK_NAME, INTEREST_RATE,
          ORIGINATION_FEE, COLLATERALIZATION_RATIO, LIQUIDATION_PENALTY, PERIOD, TELLOR_ORACLE_ADDRESS))
        .to.emit(bankFactoryInstance, "BankCreated");
    });

    it("should accept emitted events with correct bank address", async function () {
      newBank = await filterEvent(bankFactoryInstance, FIRST_BANK_NUMBER);
      assert.equal(newBank, await bankFactoryInstance.getBankAddressAtIndex(FIRST_BANK_NUMBER));
    });

    it("should create a bank clone with correct parameters", async function () {
      newBank = await filterEvent(bankFactoryInstance, FIRST_BANK_NUMBER);
      let myBank = await bankInstance.attach(newBank);
      console.log("===== 0 newBank: " + newBank);
      await myBank.deployed();
      // myBank = await deployBank(bankInstance, newBank);
      console.log("randomUser.address: " + randomUser.address);
      console.log("collateral.tokenAddress: " + await bankInstance.getCollateralTokenAddress());
      console.log("collateralToken: " + await ctInstance.address);
      await myBank.connect(randomUser).setCollateral(ctInstance.address, 2, 1000, 1000);
      await myBank.connect(randomUser).setDebt(dtInstance.address, 1, 1000, 1000);
      console.log("bankInstance.address: " + bankInstance.address);
      console.log("myBank.address: " + myBank.address);
      const interestRate = await myBank.getInterestRate();
      console.log(" AAAAAAAAAAA - interestRate: " + interestRate);
      const originationFee = await myBank.getOriginationFee();
      const collateralizationRatio = await myBank.getCollateralizationRatio();
      const liquidationPenalty = await myBank.getLiquidationPenalty();
      const reserveBalance = await myBank.getReserveBalance();
      const reserveCollateralBalance = await myBank.getReserveCollateralBalance();
      // const owner = await myBank.getRoleAdmin(myBank.address);         // TODO
      const dtAddress = await myBank.getDebtTokenAddress();
      const ctAddress = await myBank.getCollateralTokenAddress();

      assert.equal(await bankFactoryInstance.getBankAddressAtIndex(FIRST_BANK_NUMBER), await myBank.address);
      assert((await bankFactoryInstance.getNumberOfBanks()).eq(ONE));
      // assert(owner, await deployer.getAddress()); // TODO  
      // const owner1 = await myBank.getRoleAdmin(myBank.address);   // .owner();  // TODO
      assert(interestRate.eq(ethers.BigNumber.from(INTEREST_RATE)));
      assert(originationFee.eq(ethers.BigNumber.from(ORIGINATION_FEE)));
      assert(collateralizationRatio.eq(ethers.BigNumber.from(COLLATERALIZATION_RATIO)));
      assert(liquidationPenalty.eq(ethers.BigNumber.from(LIQUIDATION_PENALTY)));
      assert(reserveBalance.eq(ZERO));
      assert(reserveCollateralBalance.eq(ZERO));
      assert(dtAddress, dtInstance.address);
      assert(ctAddress, ctInstance.address);
    });   // End of "it" block

    it("should create multiple bank clones with correct parameters", async function () {

      // Create first bank
      clone = await bankFactoryInstance.connect(randomUser).createBank(BANK_NAME, INTEREST_RATE,
        ORIGINATION_FEE, COLLATERALIZATION_RATIO, LIQUIDATION_PENALTY, PERIOD, TELLOR_ORACLE_ADDRESS);

      newBank = await filterEvent(bankFactoryInstance, 1);
      console.log("  ===== New Bank 2: " + newBank);
      myBank = await deployBank(bankInstance, newBank);

      await myBank.connect(randomUser).setCollateral(ctInstance.address, 2, 1000, 1000);
      await myBank.connect(randomUser).setDebt(dtInstance.address, 1, 1000, 1000);
      // const owner1 = await myBank.getRoleAdmin(myBank.address);   // .owner();    // TODO
      assert.equal(newBank, myBank.address);
      assert.equal(await bankFactoryInstance.getBankAddressAtIndex(SECOND_BANK_NUMBER), await myBank.address);
      assert((await bankFactoryInstance.getNumberOfBanks()).eq(TWO));

      // Create second bank
      clone = await bankFactoryInstance.connect(randomUser2).createBank(BANK_NAME, INTEREST_RATE,
        ORIGINATION_FEE, COLLATERALIZATION_RATIO, LIQUIDATION_PENALTY, PERIOD, TELLOR_ORACLE_ADDRESS);

      newBank = await filterEvent(bankFactoryInstance, SECOND_BANK_NUMBER);
      console.log("  ===== New Bank 3: " + newBank);
      myBank = await deployBank(bankInstance, newBank);

      await myBank.connect(randomUser2).setCollateral(ctInstance.address, 2, 1000, 1000);
      await myBank.connect(randomUser2).setDebt(dtInstance.address, 1, 1000, 1000);
      // const owner2 = await myBank.getRoleAdmin(myBank.address);   // .owner();  // TODO

      const bankAddress1 = await bankFactoryInstance.getBankAddressAtIndex(FIRST_BANK_NUMBER);
      const bankAddress2 = await bankFactoryInstance.getBankAddressAtIndex(SECOND_BANK_NUMBER);

      assert.equal(newBank, myBank.address);
      assert.equal(await bankFactoryInstance.getBankAddressAtIndex(THIRD_BANK_NUMBER), await myBank.address);
      assert((await bankFactoryInstance.getNumberOfBanks()).eq(ethers.BigNumber.from(3)));
      // assert.equal(owner1, randomUser.address);    // TODO
      // assert.equal(owner2, await randomUser2.getAddress());    // TODO
    });

    // ===============================================================================
    it("BANK - should create bank with correct parameters", async function () {
      const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
      // bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;  // Solidity code
      // const KEEPER_ROLE = web3.utils.soliditySha3("KEEPER_ROLE");
      // const ADMIN_ROLE = ethers.utils.solidityKeccak256(["string"], ["DEFAULT_ADMIN_ROLE"]);
      const KEEPER_ROLE = ethers.utils.solidityKeccak256(["string"], ["KEEPER_ROLE"]);
      const REPORTER_ROLE = ethers.utils.solidityKeccak256(["string"], ["REPORTER_ROLE"]);
      newBank = randomUser6.address;
      console.log("  ===== Bank.newBank: " + newBank);  // + " == Bank.myBank: " + myBank2.address);
      // myBank2 = await deployBank(bankInstance2, newBank);

      // Bank set up
      const CT2 = await ethers.getContractFactory("GLDToken");
      const DT2 = await ethers.getContractFactory("USDToken");
      const ctInstance2 = await CT2.deploy(ethers.BigNumber.from(10000));
      const dtInstance2 = await DT2.deploy(ethers.BigNumber.from(10000));
      // bankInstance2();
      // deployer.address
      const testingAddress = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";
      let deploySigner = await ethers.getSigner(testingAddress);
      console.log("=========== OAOAOAOAOA 111111 =======");
      await bankInstance2.connect(deploySigner).init(deploySigner.address, BANK_NAME, INTEREST_RATE, ORIGINATION_FEE,
        COLLATERALIZATION_RATIO, LIQUIDATION_PENALTY, PERIOD, randomUser6.address, TELLOR_ORACLE_ADDRESS);
      // await bankInstance2.connect(randomUser).init(deployer.address, BANK_NAME, INTEREST_RATE, ORIGINATION_FEE,
      //   COLLATERALIZATION_RATIO, LIQUIDATION_PENALTY, PERIOD, randomUser6.address, TELLOR_ORACLE_ADDRESS);
      await bankInstance2.setCollateral(ctInstance2.address, 2, 1000, 1000);  // Using connect() leads to an ex. error
      console.log("=========== OAOAOAOAOA 222222 =======");
      await bankInstance2.setDebt(dtInstance2.address, 1, 1000, 1000); // Using connect() leads to an ex. error
      await ctInstance2.transfer(deploySigner.address, ethers.BigNumber.from(500));
      await dtInstance2.transfer(deploySigner.address, ethers.BigNumber.from(500));
      // set keepers
      await bankInstance2.addKeeper(randomUser3.address);
      await bankInstance2.addKeeper(randomUser4.address);
      //set updaters
      await bankInstance2.addReporter(randomUser5.address);
      await bankInstance2.addReporter(randomUser6.address);
      // ===============================================================================
      // it('should create bank with correct parameters', async function () {
      // ===============================================================================
      const interestRate = await bankInstance2.getInterestRate();
      const originationFee = await bankInstance2.getOriginationFee();
      const collateralizationRatio = await bankInstance2.getCollateralizationRatio();
      const liquidationPenalty = await bankInstance2.getLiquidationPenalty();
      const reserveBalance = await bankInstance2.getReserveBalance();
      const reserveCollateralBalance = await bankInstance2.getReserveCollateralBalance();
      // ==
      const isAdmin = await bankInstance2.hasRole(DEFAULT_ADMIN_ROLE, deployer.address);
      const isKeeper1 = await bankInstance2.hasRole(KEEPER_ROLE, randomUser3.address);
      const isKeeper2 = await bankInstance2.hasRole(KEEPER_ROLE, randomUser4.address);
      const isReporter1 = await bankInstance2.hasRole(REPORTER_ROLE, randomUser5.address);
      const isReporter2 = await bankInstance2.hasRole(REPORTER_ROLE, randomUser6.address);
      const dtAddress = await bankInstance2.getDebtTokenAddress();
      const ctAddress = await bankInstance2.getCollateralTokenAddress();
      const name = await bankInstance2.getName();

      console.log("  ===== Bank.isAdmin: " + isAdmin);
      // assert.ok(isAdmin);    // TODO
      assert.ok(isKeeper1);
      assert.ok(isKeeper2);
      assert.ok(isReporter1);
      assert.ok(isReporter2);
      assert.equal(name, BANK_NAME);
      assert(interestRate.eq(ethers.BigNumber.from(INTEREST_RATE)));
      assert(originationFee.eq(ethers.BigNumber.from(ORIGINATION_FEE)));
      assert(collateralizationRatio.eq(ethers.BigNumber.from(COLLATERALIZATION_RATIO)));
      assert(liquidationPenalty.eq(ethers.BigNumber.from(LIQUIDATION_PENALTY)));
      assert(reserveBalance.eq(ZERO));
      assert(reserveCollateralBalance.eq(ZERO));
      assert(dtAddress, dtInstance.address);
      assert(ctAddress, ctInstance.address);
      console.log("  ===== Bank.getCollateral(): " + (await bankInstance2.getReserveCollateralBalance()).toString());

      // ===============================================================================
      // it('only admin role should add / remove new roles', async function () {
      // ===============================================================================
      const admin = await bankInstance2.getRoleMember(DEFAULT_ADMIN_ROLE, 0);
      assert((await bankInstance2.getRoleMemberCount(KEEPER_ROLE)).eq(ethers.BigNumber.from(2)));
      assert((await bankInstance2.getRoleMemberCount(REPORTER_ROLE)).eq(ethers.BigNumber.from(2)));

      // user not in role adds keeper
      console.log("  ===== Bank---> randomUser7.address: " + randomUser7.address);
      // expect(bankInstance2.connect(randomUser7).addKeeper(randomUser8.address))   It Won't work, since the await is required 
      await expect(bankInstance2.connect(randomUser7).addKeeper(randomUser8.address))    // Passed  
        .to.be.revertedWith("AccessControl");
      await expect(bankInstance2.connect(randomUser7).addReporter(randomUser8.address))  // Passed
        .to.be.revertedWith("AccessControl");

      // keeper adds another keeper
      let keeper = (await bankInstance2.getRoleMember(KEEPER_ROLE, 0));
      let keeperSigner = await ethers.getSigner(keeper);
      console.log("  ===== Bank---> keeper2: " + keeper);
      console.log("  ===== Bank---> randomUser3: " + randomUser3.address);
      console.log("  ===== Bank---> randomUser4: " + randomUser4.address);
      await expect(bankInstance2.connect(keeperSigner).addKeeper(randomUser8.address)).to.be.revertedWith("AccessControl");

      // reporter adds another reporter     // JR
      let reporter = await bankInstance2.getRoleMember(REPORTER_ROLE, 0);
      let reporterSigner = await ethers.getSigner(reporter);
      await expect(bankInstance2.connect(reporterSigner).addReporter(randomUser8.address)).to.be.revertedWith("AccessControl");

      // admin adds new keeper
      let adminSigner = await ethers.getSigner(admin);
      await bankInstance2.connect(adminSigner).addKeeper(randomUser8.address);
      assert((await bankInstance2.getRoleMemberCount(KEEPER_ROLE)).eq(ethers.BigNumber.from(3)));

      // admin adds new reporter
      await bankInstance2.connect(adminSigner).addReporter(randomUser8.address);
      assert((await bankInstance2.getRoleMemberCount(REPORTER_ROLE)).eq(ethers.BigNumber.from(3)));

      // keeper removes keeper
      keeper = (await bankInstance2.getRoleMember(KEEPER_ROLE, 0));
      keeperSigner = await ethers.getSigner(keeper);
      const removeKeeper = await bankInstance2.getRoleMember(KEEPER_ROLE, 1);
      await expect(bankInstance2.connect(keeperSigner).revokeKeeper(removeKeeper)).to.be.revertedWith("AccessControl");

      // reporter removes reporter
      reporter = await bankInstance2.getRoleMember(REPORTER_ROLE, 0);
      reporterSigner = await ethers.getSigner(reporter);
      const removeReporter = await bankInstance2.getRoleMember(REPORTER_ROLE, 1);
      await expect(bankInstance2.connect(reporterSigner).revokeReporter(removeReporter)).to.be.revertedWith("AccessControl");

      // admin removes keeper and updater
      await bankInstance2.connect(adminSigner).revokeKeeper(removeKeeper);
      await bankInstance2.connect(adminSigner).revokeReporter(removeReporter);

      assert((await bankInstance2.getRoleMemberCount(KEEPER_ROLE)).eq(ethers.BigNumber.from(2)));
      assert((await bankInstance2.getRoleMemberCount(REPORTER_ROLE)).eq(ethers.BigNumber.from(2)));

      // ===============================================================================
      // it('should allow admin to deposit reserves', async function () {
      // ===============================================================================
      // USDT are the debt tokens                      // depositAmount = 100
      await dtInstance2.approve(bankInstance2.address, largeDepositAmount);     // JR
      // await dtInstance2.allowance(deploySigner.address, bankInstance2.address); // JR
      // SFSG (so far so good))
      // const { tokenOwner } = await getNamedAccounts();

      console.log("  ===== Bank---> deployer.address: " + await deployer.address);
      // console.log("  ===== Bank---> admin.getBalance(): " + (await bankInstance2.getbal .getBalanceof()));
      // let deploySigner = await ethers.getSigner(testingAddress);
      // Putting "connect(adminSigner)" or not has the same effect ---> Error: VM Exception while processing transaction: reverted with reason string 'ERC20: transfer amount exceeds balance'
      console.log("  ===== Bank---> admin.BalanceOf_USDToken(): " + await dtInstance2.balanceOf(deploySigner.address));
      console.log("  ===== Bank---> admin.BalanceOf_GLDToken(): " + await ctInstance2.balanceOf(deploySigner.address));
      // await bankInstance2.connect(deploySigner).reserveDeposit(depositAmount); // 'ERC20: transfer amount exceeds allowance'
      // await bankInstance2.connect(adminSigner).reserveDeposit(depositAmount);  // 'ERC20: transfer amount exceeds allowance'
      // await bankInstance2.connect(randomUser2).reserveDeposit(depositAmount);     // AccessControl error
      let adminAllowance = await dtInstance2.allowance(adminSigner.address, bankInstance2.address);
      console.log("  ===== Bank---> adminAllowance: " + adminAllowance);
      // await bankInstance2.reserveDeposit(ethers.BigNumber.from(100));  // depositAmount);
      // console.log("  ===== Bank---> admin.BalanceOf_GLDToken(): " + await ctInstance2.balanceOf(deploySigner.address));
      // const reserveBalance2 = await bankInstance2.getReserveBalance();
      // const tokenBalance2 = await dtInstance2.balanceOf(bankInstance2.address);
      // assert(reserveBalance2.eq(depositAmount));
      // assert(tokenBalance2.eq(depositAmount));

      // ===============================================================================
      // it('should allow admin to withdraw reserves', async function () {
      // ===============================================================================
      await dtInstance2.approve(bankInstance2.address, depositAmount);
      // await bankInstance2.reserveDeposit(depositAmount);
      // const beforeReserveBalance = await bankInstance2.getReserveBalance();
      // await bankInstance2.reserveWithdraw(depositAmount);
      // const afterReserveBalance = await bankInstance2.getReserveBalance();
      // const bankTokenBalance = await dtInstance2.balanceOf(bankInstance2.address);
      // const bankFactoryOwner = await bankInstance2.getBankFactoryOwner();
      // const bankCreatorBalance = await dtInstance2.balanceOf(deploySigner.address);
      // const bankFactoryOwnerBalance = await dtInstance2.balanceOf(bankFactoryOwner); /// TD
      // const feeAmt = depositAmount.div(ethers.BigNumber.from(200));
      // assert(beforeReserveBalance.eq(depositAmount));
      // assert(afterReserveBalance.eq(ethers.constants.Zero));
      // assert(bankTokenBalance.eq(ethers.constants.Zero));
      // assert(bankFactoryOwnerBalance.eq(feeAmt));

      // ===============================================================================
      // it('should not allow non-admin to deposit reserves', async function () {
      // ===============================================================================
      await expect(bankInstance2.connect(randomUser2).reserveDeposit(ethers.BigNumber.from(100))).to.be.revertedWith("AccessControl");

      // ===============================================================================
      // it('should not allow non-admin to withdraw reserves', async function () {
      // ===============================================================================
      await expect(bankInstance2.connect(randomUser2).reserveWithdraw(ethers.BigNumber.from(100))).to.be.revertedWith("AccessControl");

      // ===============================================================================
      // it('should allow user to deposit collateral into vault', async function () {
      // ===============================================================================
      // await this.ct.approve(this.bank.address, this.depositAmount, { from: _accounts[1] });
      // await this.bank.vaultDeposit(this.depositAmount, { from: _accounts[1] });
      // const collateralAmount = await this.bank.getVaultCollateralAmount({ from: _accounts[1] });
      // const debtAmount = await this.bank.getVaultDebtAmount({ from: _accounts[1] });
      // const tokenBalance = await this.ct.balanceOf(this.bank.address);
      // expect(collateralAmount).to.be.bignumber.equal(this.depositAmount);
      // expect(debtAmount).to.be.bignumber.equal(this.zero);
      // expect(tokenBalance).to.be.bignumber.equal(this.depositAmount);

      // ===============================================================================
      // it('should allow user to withdraw collateral from vault', async function () {
      // ===============================================================================
      // await this.ct.approve(this.bank.address, this.depositAmount, { from: _accounts[1] });
      // await this.bank.vaultDeposit(this.depositAmount, { from: _accounts[1] });
      // await this.bank.vaultWithdraw(this.depositAmount, { from: _accounts[1] });
      // const collateralAmount = await this.bank.getVaultCollateralAmount({ from: _accounts[1] });
      // const debtAmount = await this.bank.getVaultDebtAmount({ from: _accounts[1] });
      // const tokenBalance = await this.ct.balanceOf(this.bank.address);
      // expect(collateralAmount).to.be.bignumber.equal(this.zero);
      // expect(debtAmount).to.be.bignumber.equal(this.zero);
      // expect(tokenBalance).to.be.bignumber.equal(this.zero);




    });

  });


  async function deployBank(myBankInstance: Bank, myNewBank: string): Promise<Bank> {
    let myBank = await myBankInstance.attach(myNewBank);
    console.log("===== newBank: " + myNewBank);
    return await myBank.deployed();
  }


  describe("getNumberOfBanks", () => {
    it("should return the correct number", async () => {

    });
  });

  describe("getBankAddressAtIndex", () => {
    it("should return the correct address", async () => {

    });
  });

  async function filterEvent(bankFactoryInstance: BankFactory, bankNumber: number): Promise<string> {
    let newAddress: string = "";
    const bankAddress = await bankFactoryInstance.getBankAddressAtIndex(bankNumber);
    const filter = bankFactoryInstance.filters.BankCreated();
    // beware about an error regarding the block number in mainnet forking
    const logs = bankFactoryInstance.queryFilter(filter, parseInt(`${process.env.FORK_BLOCK_NUMBER}`));
    (await logs).forEach((log) => {
      console.log("function filterEvent === new bank: " + log.args.newBankAddress + "  owner: " + log.args.owner);
      console.log("function filterEvent === bankAddress: " + bankAddress);
      newAddress = log.args.newBankAddress;
    });
    return newAddress;
  }

});

// TODO: there are three asserts to do. Also, a "beforeEach" block must be added in order the reset the state.