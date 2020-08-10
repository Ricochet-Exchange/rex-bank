import React, { useContext } from "react";

import { BankContext } from "../../../contexts/BankContext";
import TokenPairSelector from "../TokenPairSelector/TokenPairSelector";

import "./BankStatusBar.scss";

const BankStatusBar = () => {
  const { state } = useContext(BankContext);
  const data = state.banks[state.bankAddresses[0]].data;
  const granularity = 1000000;

  return (
    <div className="BankStatusBar">
      <div>
        {data.collateralToken.symbol} Price (USD) $
        <strong>{+data.collateralToken.price / granularity}</strong>
      </div>
      <div>
        {data.debtToken.symbol} Price (USD) $
        <strong>{+data.debtToken.price / granularity}</strong>
      </div>
      <TokenPairSelector />
    </div>
  );
};

export default BankStatusBar;
