import React, { useContext, useState } from "react";
import { Button, Input } from "antd";

import { BankContext } from "../../../contexts/BankContext";

import "./VaultTransaction.scss";

const VaultTransaction = ({
  activeTransaction,
  setActiveTransaction,
  txPending,
  setTxPending,
  bank,
}) => {
  const { state, dispatch } = useContext(BankContext);
  const [newValue, setNewValue] = useState();

  const handleAction = () => {
    console.log("doing ", activeTransaction);
  };
  const isCollateral =
    activeTransaction === "withdraw" || activeTransaction === "deposit";

  const handleCancel = () => {
    setNewValue(null);
    setActiveTransaction(null);
  };

  const handleChange = (e) => {
    setNewValue(e.target.value);
  };

  return (
    <div className="VaultTransaction">
      <div className="VaultTransaction__preview">
        <div>
          <p>New collateralization ratio</p>
          <p>%</p>
        </div>
        <div>
          <p>New liquidation price</p>
          <p>%</p>
        </div>
      </div>
      <div>
        <p>
          How much{" "}
          {isCollateral
            ? bank.data.collateralToken.symbol
            : bank.data.debtToken.symbol}{" "}
          do you wish to {activeTransaction}?
        </p>
        <Input
          type="number"
          size="large"
          value={newValue}
          onChange={handleChange}
          addonAfter={
            isCollateral
              ? bank.data.collateralToken.symbol
              : bank.data.debtToken.symbol
          }
        />
      </div>
      <div className="VaultTransaction__buttons">
        <Button type="link" onClick={() => handleCancel()}>
          cancel
        </Button>
        <Button
          type="primary"
          shape="round"
          size="large"
          onClick={() => handleAction()}
        >
          {activeTransaction}
        </Button>
      </div>
    </div>
  );
};

export default VaultTransaction;
