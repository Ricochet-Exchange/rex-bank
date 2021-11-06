import React from "react";
import '../../../App.scss';

const EtherscanLink = ({ path, hash }) => {
  const uri = () => {
    switch (process.env.REACT_APP_CHAIN_ID) {
      case "1": {
        return `https://etherscan.io/${path}/`;
      }
      case "4": {
        return `https://rinkeby.etherscan.io/${path}/`;
      }
      case "137": {
        return `https://polygonscan.com/${path}/`;
      }
      default: {
        return `https://etherscan.io/${path}/`;
      }
    }
  };

  return (
    <div className="EtherscanLink">
      <a href={`${uri()}${hash}`} target="_blank" rel="noopener noreferrer">
        view on Polygonscan
      </a>
    </div>
  );
};

export default EtherscanLink;
