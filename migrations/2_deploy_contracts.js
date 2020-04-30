var Bank = artifacts.require("Bank");
var CT = artifacts.require("GLDToken");
var DT = artifacts.require("USDToken");

module.exports = function(deployer) {

  deployer.deploy(CT, "10000000000000000000000").then(function() {
    return deployer.deploy(DT, "10000000000000000000000").then(function() {
      return deployer.deploy(Bank, 12, 1, 150, 25, CT.address, DT.address)
    });
  });

};
