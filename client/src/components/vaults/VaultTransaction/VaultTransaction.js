import React from "react";
// import { Button } from "antd";

import "./VaultTransaction.scss";

const VaultTransaction = ({
  activeTransaction,
  setActiveTransaction,
  txPending,
  setTxPending,
}) => {
  return (
    <div className="VaultTransaction">
      <h1>poopin {activeTransaction}</h1>
    </div>
  );
};

export default VaultTransaction;
