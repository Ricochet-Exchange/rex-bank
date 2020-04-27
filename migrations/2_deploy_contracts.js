var Bank = artifacts.require("Bank");

module.exports = function(deployer) {
  deployer.deploy(Bank, 0, 0, 0, 0);
};
