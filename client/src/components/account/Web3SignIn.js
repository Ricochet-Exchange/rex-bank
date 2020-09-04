import React, { useContext } from "react";
import Web3Modal from "web3modal";
import { Button } from "antd";

import { getChainData } from "../../utils/chains";
import { w3connect, providerOptions, USER_TYPE } from "../../utils/auth";
import Web3Service from "../../utils/web3-service";
import { Web3Context } from "../../contexts/RootContexts";
import { BankContext } from "../../contexts/BankContext";

const Web3SignIn = (props) => {
  const [, setWeb3Service] = useContext(Web3Context);
  const { dispatch } = useContext(BankContext);

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
      setWeb3Service({ service: web3Service, account });
      localStorage.setItem("loginType", USER_TYPE.WEB3);
      dispatch({ type: "clearBanks" });
    } catch (err) {
      console.log("error activating", err);
    }
  };
  const size = props.size || "big";
  return (
    <>
      {size === "big" ? (
        <Button
          className="lightshadow biggestbutton"
          size="large"
          onClick={() => activate()}
        >
          Sign in with Web3
        </Button>
      ) : (
        <Button
          className={props.color ? props.color + "button" : ""}
          size="large"
          shape="round"
          onClick={() => activate()}
        >
          Sign in with Web3
        </Button>
      )}
    </>
  );
};

export default Web3SignIn;
