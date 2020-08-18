usePlugin("@nomiclabs/buidler-truffle5");

module.exports = {
  optimizer: { enabled: true, runs: 200 },
  path: {
    artifacts: "./build"
  },
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*'
    },
  }
};
