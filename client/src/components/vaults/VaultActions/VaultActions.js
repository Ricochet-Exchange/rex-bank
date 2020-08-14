import React from "react";
import { Button } from "antd";

import "./VaultActions.scss";

const VaultActions = ({
  section,
  activeTransaction,
  setActiveTransaction,
  txPending,
}) => {
  // can use activeTransaction to set a class on active state
  return (
    <div className="VaultActions">
      {section === "locked" ? (
        <>
          <Button
            type="default"
            shape="round"
            size="large"
            disabled={txPending}
            onClick={() => setActiveTransaction("withdraw")}
          >
            Withdraw
          </Button>
          <Button
            type="primary"
            shape="round"
            size="large"
            disabled={txPending}
            onClick={() => setActiveTransaction("deposit")}
          >
            Deposit
          </Button>
        </>
      ) : (
        <>
          <Button
            type="default"
            shape="round"
            size="large"
            disabled={txPending}
            onClick={() => setActiveTransaction("borrow")}
          >
            Borrow
          </Button>
          <Button
            type="primary"
            shape="round"
            size="large"
            disabled={txPending}
            onClick={() => setActiveTransaction("repay")}
          >
            Repay
          </Button>
        </>
      )}
    </div>
  );
};

export default VaultActions;
