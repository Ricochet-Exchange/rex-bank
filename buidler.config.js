usePlugin("@nomiclabs/buidler-truffle5");
usePlugin("@nomiclabs/buidler-solhint");
// usePlugin("buidler-gas-reporter");

module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  paths: {
    artifacts: "./build/contracts"
  },
};
