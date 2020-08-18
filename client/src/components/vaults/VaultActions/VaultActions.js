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
            disabled={txPending || activeTransaction}
            onClick={() => setActiveTransaction("withdraw")}
          >
            withdraw
          </Button>
          <Button
            type="primary"
            shape="round"
            size="large"
            disabled={txPending || activeTransaction}
            onClick={() => setActiveTransaction("deposit")}
          >
            deposit
          </Button>
        </>
      ) : (
        <>
          <Button
            type="default"
            shape="round"
            size="large"
            disabled={txPending || activeTransaction}
            onClick={() => setActiveTransaction("borrow")}
          >
            borrow
          </Button>
          <Button
            type="primary"
            shape="round"
            size="large"
            disabled={txPending || activeTransaction}
            onClick={() => setActiveTransaction("repay")}
          >
            repay
          </Button>
        </>
      )}
    </div>
  );
};

export default VaultActions;
