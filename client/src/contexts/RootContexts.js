import React, { useState, useEffect, createContext } from "react";
import Web3Modal from "web3modal";
import Web3 from "web3";

import Web3Service from "../utils/web3-service";
import { w3connect, providerOptions, USER_TYPE } from "../utils/auth";
import { getChainData } from "../utils/chains";

export const Web3Context = createContext();

const RootContexts = ({ children }) => {
  const [w3Context, setW3Context] = useState();

  useEffect(() => {
    const setUp = async () => {
      const web3Modal = new Web3Modal({
        network: getChainData(+process.env.REACT_APP_CHAIN_ID).network, // optional
        providerOptions, // required
        cacheProvider: true,
      });
      let loginType = localStorage.getItem("loginType") || USER_TYPE.READ_ONLY;

      if (web3Modal.cachedProvider) {
        loginType = USER_TYPE.WEB3;
      }

      try {
        console.log(`Initializing account type: ${loginType || "read-only"}`);

        switch (loginType) {
          case USER_TYPE.WEB3: {
            if (web3Modal.cachedProvider) {
              const w3m = await w3connect(web3Modal);
              let [account] = await w3m.web3.eth.getAccounts();
              const service = new Web3Service(w3m.web3);
              setW3Context({ service, account: account || "" });
            } else {
              const web3 = new Web3(
                new Web3.providers.HttpProvider(
                  process.env.REACT_APP_INFURA_URI
                )
              );
              const service = new Web3Service(web3);
              setW3Context({ service, account: "" });
            }
            break;
          }
          case USER_TYPE.READ_ONLY:
          default:
            const web3 = new Web3(
              new Web3.providers.HttpProvider(process.env.REACT_APP_INFURA_URI)
            );
            const service = new Web3Service(web3);
            setW3Context({ service, account: "" });
            break;
        }
        localStorage.setItem("loginType", loginType);
      } catch (e) {
        console.error(
          `Could not log in with loginType ${loginType}: ${e.toString()}`
        );

        const web3 = new Web3(
          new Web3.providers.HttpProvider(
            process.env.REACT_APP_INFURA_URI.split("/").pop()
          )
        );
        const service = new Web3Service(web3);
        setW3Context({ service, account: "" });
      } finally {
      }
    };

    setUp();
  }, []);

  return (
    <Web3Context.Provider value={[w3Context, setW3Context]}>
      {children}
    </Web3Context.Provider>
  );
};

export default RootContexts;
