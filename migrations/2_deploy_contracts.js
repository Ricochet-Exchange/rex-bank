var Bank = artifacts.require("Bank");

module.exports = function(deployer) {
  deployer.deploy(Bank, 12, 1, 150, 25);
};
