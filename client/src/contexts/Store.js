import React, { useState, useEffect, createContext } from "react";
import Web3Connect from "web3connect";
import { w3connect, providerOptions, createWeb3User } from "../utils/auth";
import { getChainData } from "../utils/chains";

export const LoaderContext = createContext(false);
export const Web3ConnectContext = createContext();
export const CurrentUserContext = createContext();

const Store = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(false);
  const [web3Connect, setWeb3Connect] = useState(
    new Web3Connect.Core({
      network: getChainData(+process.env.REACT_APP_CHAIN_ID).network, // optional
      providerOptions, // required
      cacheProvider: true,
    })
  );

  useEffect(() => {
    const initCurrentUser = async () => {
      let user;
      try {
        const w3c = await w3connect(web3Connect);
        const [account] = await w3c.web3.eth.getAccounts();
        setWeb3Connect(w3c);
        user = createWeb3User(account);
        setCurrentUser(user);
      } catch (e) {
        console.error(`Could not log in with web3`);
      }
    };
    if (web3Connect.cachedProvider) {
      initCurrentUser();
    }
  }, [web3Connect]);
  return (
    <LoaderContext.Provider value={[loading, setLoading]}>
      <Web3ConnectContext.Provider value={[web3Connect, setWeb3Connect]}>
        <CurrentUserContext.Provider value={[currentUser, setCurrentUser]}>
          {children}
        </CurrentUserContext.Provider>
      </Web3ConnectContext.Provider>
    </LoaderContext.Provider>
  );
};

export default Store;
