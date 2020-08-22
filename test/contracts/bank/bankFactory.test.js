const BankFactory = artifacts.require("BankFactory");
const {nullAddress} = require("../../helpers/commonlyUsed");
const {
  time,
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

// contract("BankFactory", ([owner, other]) => {
//   beforeEach(async function () {
//     // Deploy the bank factory contract
//     this.bankFactory = await BankFactory.new();
//   })
//
//   it("should hold the 499,000 other tokens not distributed", async function () {
//     // Check by calling & assert balances
//     const bankVersion = await this.bankFactory.getCurrentBankVersion();
//     console.log(bankVersion.toNumber());
//     const masterBankAddresss = await this.bankFactory.getMasterBankAddress();
//     console.log(masterBankAddresss);
//     // assert.equal(tokenSafeBalance.toNumber(), 499000, "TokenSafe balance didn't initialize properly")
//     // assert.equal(ownerBalance.toNumber(), 1000, "Manager balance didn't initialize properly")
//   });
// });
