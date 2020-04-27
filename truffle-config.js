// Allows us to use ES6 in our migrations and tests.
require("babel-register")({
  ignore: /node_modules\/(?!zeppelin-solidity)/
});
require("babel-polyfill");
require('dotenv').config();
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*'
    },
    ropsten: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC,
        process.env.ROPSTEN_URL),
      network_id: 3
    },
  }
}
