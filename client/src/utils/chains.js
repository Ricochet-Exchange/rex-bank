const supportedChains = [
  {
    name: "Ethereum Mainnet",
    short_name: "eth",
    chain: "ETH",
    network: "mainnet",
    chain_id: 1,
    network_id: 1,
    rpc_url: "https://mainnet.infura.io/",
  },
  {
    name: "Ethereum Rinkeby",
    short_name: "rin",
    chain: "ETH",
    network: "rinkeby",
    chain_id: 4,
    network_id: 4,
    rpc_url: "https://rinkeby.infura.io/",
  },
];

export function getChainData(chainId) {
  console.log("Chain ID")
  console.log(chainId)
  const chainData = supportedChains.filter(
    (chain) => chain.chain_id === chainId
  )[0];

  if (!chainData) {
    throw new Error("ChainId missing or not supported");
  }

  const API_KEY = process.env.REACT_APP_INFURA_PROJECT_ID;

  if (
    chainData.rpc_url.includes("infura.io") &&
    chainData.rpc_url.includes("%API_KEY%") &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace("%API_KEY%", API_KEY);

    return {
      ...chainData,
      rpc_url: rpcUrl,
    };
  }

  return chainData;
}

export default supportedChains;
