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
      <div>TRB Price (USD) ${+data.collateralTokenPrice / granularity}</div>
      <div>DAI Price (USD) ${+data.debtTokenPrice / granularity}</div>
      <BankSelector currentBank={currentBank} />
    </div>
  );
};

export default BankStatusBar;
