import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      forking: {
        url: `https://green-nameless-water.matic.quiknode.pro/${process.env.QUICKNODE_ENDPOINT}/`,
        // accounts: [process.env.MATIC_PRIVATE_KEY],
        blockNumber: 19403280,
        // gasPrice: 50000000000,
        // network_id: 137,
      },
    }
    // gasReporter: {
    //   enabled: process.env.REPORT_GAS !== undefined,
    //   currency: "USD",
    // },
    // etherscan: {
    //   apiKey: process.env.ETHERSCAN_API_KEY,
    // },
  }
};

export default config;

