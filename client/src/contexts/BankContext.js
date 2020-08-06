import React, { useEffect, useReducer } from "react";

import { CONTRACT_ADDRESSES } from "../utils/constants";
import { getUsd } from "../utils/prices";

const BankContext = React.createContext();

// TODO: Will be dynamic and pulled from a factory contract or a larger list in the future
const initialState = {
  banks: [CONTRACT_ADDRESSES[process.env.REACT_APP_CHAIN_ID].bank],
  activeBank: {
    address: null,
    service: null,
    data: null,
  },
  prices: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setBanks": {
      return { ...state, banks: action.payload };
    }
    case "setActiveBank": {
      return { ...state, activeBank: action.payload };
    }
    case "setPrices": {
      return { ...state, prices: action.payload };
    }

    default: {
      return initialState;
    }
  }
};

const BankContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  useEffect(() => {
    const getAllPrices = async () => {
      // TODO: maybe get from the banks
      const tokensAddresses = [
        CONTRACT_ADDRESSES[process.env.REACT_APP_CHAIN_ID].dai,
        CONTRACT_ADDRESSES[process.env.REACT_APP_CHAIN_ID].trb,
      ];
      let prices = {};
      try {
        const res = await getUsd(tokensAddresses.join(","));
        prices = res.data;
      } catch (err) {
        console.log("price api error", err);
      }

      dispatch({ type: "setPrices", payload: prices });
    };

    getAllPrices();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BankContext.Provider value={value}>{props.children}</BankContext.Provider>
  );
};

const BankContextConsumer = BankContext.Consumer;

export { BankContext, BankContextProvider, BankContextConsumer };
