import React from "react";
import { Button } from "antd";

import "./VaultActions.scss";

const VaultActions = ({ section }) => {
  return (
    <div className="VaultActions">
      {section === "locked" ? (
        <>
          <Button type="primary" shape="round" size="large">
            Withdraw
          </Button>
          <Button type="primary" shape="round" size="large">
            Deposit
          </Button>
        </>
      ) : (
        <>
          <Button type="primary" shape="round" size="large">
            Borrow
          </Button>
          <Button type="primary" shape="round" size="large">
            Repay
          </Button>
        </>
      )}
    </div>
  );
};

export default VaultActions;
