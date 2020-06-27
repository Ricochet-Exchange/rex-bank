// Allows us to use ES6 in our migrations and tests.
require("babel-register")({
  ignore: /node_modules\/(?!zeppelin-solidity)/
});
require("babel-polyfill");
require('dotenv').config();
require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  plugins: ["solidity-coverage"],
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*'
    },
    rinkeby: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC,
        process.env.RINKEBY_URL),
      network_id: 4,
      gasPrice: 20000000000
    },
  }
}
