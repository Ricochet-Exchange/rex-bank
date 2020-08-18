import React, { useReducer } from "react";

import { TOKEN_PAIRS, CONTRACT_ADDRESSES } from "../utils/constants";

const BankContext = React.createContext();

// TODO: Will be dynamic and pulled from a factory contract or a larger list in the future
const initialState = {
  tokenPairs: TOKEN_PAIRS,
  activePair: TOKEN_PAIRS[0],
  bankAddresses: CONTRACT_ADDRESSES[process.env.REACT_APP_CHAIN_ID],
  banks: null,
  activeBank: {
    address: null,
    service: null,
    data: null,
  },
  refreshBanks: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setBanks": {
      return { ...state, banks: action.payload, refreshBanks: false };
    }
    case "refreshBanks": {
      return { ...state, refreshBanks: true };
    }
    case "clearBanks": {
      return {
        ...state,
        banks: initialState.banks,
      };
    }
    case "setActivePair": {
      return { ...state, activePair: action.payload };
    }

    default: {
      return initialState;
    }
  }
};

const BankContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return (
    <BankContext.Provider value={value}>{props.children}</BankContext.Provider>
  );
};

const BankContextConsumer = BankContext.Consumer;

export { BankContext, BankContextProvider, BankContextConsumer };
