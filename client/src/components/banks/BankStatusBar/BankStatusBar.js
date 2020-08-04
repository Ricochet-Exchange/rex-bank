import React from "react";

import "./BankStatusBar.scss";
import BankSelector from "../BankSelector/BankSelector";

const BankStatusBar = () => {
  const currentBank = {
    label: "TRB-DAI",
  };
  return (
    <div className="BankStatusBar">
      <div>TRB Price (USD) $7.07</div>
      <div>DAI Price (USD) $1.007212</div>
      <BankSelector currentBank={currentBank} />
    </div>
  );
};

export default BankStatusBar;
