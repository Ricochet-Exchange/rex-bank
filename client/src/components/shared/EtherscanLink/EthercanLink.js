import React from "react";

const EtherscanLink = ({ path, hash }) => {
  const uri = () => {
    switch (process.env.REACT_APP_CHAIN_ID) {
      case "1": {
        return `https://etherscan.io/${path}/`;
      }
      case "4": {
        return `https://rinkeby.etherscan.io/${path}/`;
      }
      default: {
        return `https://etherscan.io/${path}/`;
      }
    }
  };

  return (
    <div className="EtherscanLink">
      <a href={`${uri()}${hash}`} target="_blank" rel="noopener noreferrer">
        View on Etherscan
      </a>
    </div>
  );
};

export default EtherscanLink;
