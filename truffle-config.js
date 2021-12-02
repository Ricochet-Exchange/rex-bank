// Allows us to use ES6 in our migrations and tests.
require("babel-register")({
  ignore: /node_modules\/(?!zeppelin-solidity)/
});
require("babel-polyfill");
require('dotenv').config();
require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");
var NonceTrackerSubprovider = require("web3-provider-engine/subproviders/nonce-tracker")


module.exports = {
  plugins: ["truffle-plugin-verify"],
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  },
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*'
    },
    polygon: {
      provider: () => new HDWalletProvider(
        process.env.MATIC_PRIVATE_KEY,
        "https://green-nameless-water.matic.quiknode.pro/a71984d8cf1bf9b030e643a09c7475bde1792b32/"),
      gasPrice: 50000000000,
      network_id: 137,
    },
    local: {
      provider: () => new HDWalletProvider(
        process.env.MATIC_PRIVATE_KEY,
        "http://127.0.0.1:7545"),
      gasPrice: 50000000000,
      network_id: 137,
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
      gasPrice: 42000000000
    },
  },
  api_keys: {
    etherscan: 'SA38RNSDDD4KS4HVP2B1RP3UA53EHZBFV9'
  }
}
