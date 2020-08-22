// Allows us to use ES6 in our migrations and tests.
require("babel-register")({
  ignore: /node_modules\/(?!zeppelin-solidity)/
});
require("babel-polyfill");
require('dotenv').config();
require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");
var NonceTrackerSubprovider = require("web3-provider-engine/subproviders/nonce-tracker")


let truffleOptions = {
  plugins: ["solidity-coverage"],
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*'
    },
    rinkeby: {
      provider: () => new HDWalletProvider(
        process.env.RINKEBY_MNEMONIC,
        process.env.RINKEBY_URL),
      network_id: 4,
      gasPrice: 9500000000
    },
    mainnet: {
      provider: function () {
        var wallet = new HDWalletProvider(process.env.MAINNET_MNEMONIC, process.env.MAINNET_URL)
        // var nonceTracker = new NonceTrackerSubprovider()
        // wallet.engine._providers.unshift(nonceTracker)
        // nonceTracker.setEngine(wallet.engine)
        return wallet
      },
      network_id: 1,
      gasPrice: 76000000000
    },
  }
}

let reporterArg = process.argv.indexOf('--reporter')
if (reporterArg >= 0) {
  truffleOptions['mocha'] = {
    reporter: process.argv[reporterArg + 1]
  }
}
module.exports = truffleOptions;
