import React, { useContext } from "react";

import BankSelector from "../BankSelector/BankSelector";
import { BankContext } from "../../../contexts/BankContext";

import "./BankStatusBar.scss";

const BankStatusBar = () => {
  const { state } = useContext(BankContext);
  const data = state.activeBank.data;
  const granularity = 1000000;

  const currentBank = {
    label: `${state.activeBank.data.collateralToken.symbol}-${state.activeBank.data.debtToken.symbol}`,
  };

  return (
    <div className="BankStatusBar">
      <div>
        {state.activeBank.data.collateralToken.symbol} Price (USD) $
        {+data.collateralToken.price / granularity}
      </div>
      <div>
        {state.activeBank.data.debtToken.symbol} Price (USD) $
        {+data.debtToken.price / granularity}
      </div>
      <BankSelector currentBank={currentBank} />
    </div>
  );
};

export default BankStatusBar;
