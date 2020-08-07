import React, { useContext } from "react";

import "./BankStatusBar.scss";
import BankSelector from "../BankSelector/BankSelector";
import { BankContext } from "../../../contexts/BankContext";

const BankStatusBar = () => {
  const { state } = useContext(BankContext);
  const data = state.activeBank.data;
  const granularity = 1000000;

  const currentBank = {
    label: "TRB-DAI",
  };
  return (
    <div className="BankStatusBar">
      <div>TRB Price (USD) <strong>${+data.collateralTokenPrice / granularity}</strong></div>
      <div>DAI Price (USD) <strong>${+data.debtTokenPrice / granularity}</strong></div>
      <BankSelector currentBank={currentBank} />
    </div>
  );
};

export default BankStatusBar;
