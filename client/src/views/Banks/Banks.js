import React from "react";

import BankStatusBar from "../../components/banks/BankStatusBar/BankStatusBar";

import "./Banks.scss";
import BankDetails from "../../components/banks/BankDetails/BankDetails";

const Banks = () => {
  return (
    <div>
      <BankStatusBar />
      <BankDetails />
    </div>
  );
};

export default Banks;
