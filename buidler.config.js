usePlugin("@nomiclabs/buidler-truffle5");
usePlugin("@nomiclabs/buidler-solhint");
usePlugin("buidler-gas-reporter");


module.exports = {
  defaultNetowrk: "localhost",
  networks: {
    buidlerevm: {
    },
    development: {
      url: 'http://localhost:7545'
    }
  },
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
