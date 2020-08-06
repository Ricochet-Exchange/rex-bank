import React, { useContext } from "react";
import Web3Modal from "web3modal";
import { Button } from "antd";

import { getChainData } from "../../utils/chains";
import { w3connect, providerOptions, USER_TYPE } from "../../utils/auth";
import Web3Service from "../../utils/web3-service";
import { Web3Context } from "../../contexts/RootContexts";

const Web3SignIn = () => {
  const [, setWeb3Service] = useContext(Web3Context);

  const activate = async () => {
    const web3Connect = new Web3Modal({
      network: getChainData(+process.env.REACT_APP_CHAIN_ID).network, // optional
      providerOptions, // required
      cacheProvider: true,
    });
    try {
      const w3m = await w3connect(web3Connect);
      const [account] = await w3m.web3.eth.getAccounts();
      const web3Service = new Web3Service(w3m.web3);
      setWeb3Service({ web3Service, account });
      localStorage.setItem("loginType", USER_TYPE.WEB3);
    } catch (err) {
      console.log("error activating", err);
    }
  };
  return (
    <>
      <Button onClick={() => activate()}>Sign in with Web3</Button>
    </>
  );
};

export default Web3SignIn;
