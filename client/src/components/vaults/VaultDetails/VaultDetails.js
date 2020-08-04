import React from "react";
import { BankOutlined } from "@ant-design/icons";

import "./VaultDetails.scss";
import VaultActions from "./VaultActions/VaultActions";

const VaultDetails = () => {
  return (
    <div className="VaultDetails">
      <div className="VaultDetails__header">
        <div>
          <p>Collateralization Ratio</p>
          <p>151.08%</p>
        </div>
        <div>
          <p>Liquidation Price</p>
          <p>129.54 trb/usd</p>
        </div>
        <div>
          <p>This vault is part of</p>
          <p>Commodo Main</p>
          <p>0x123...dude</p>
          <BankOutlined />
        </div>
      </div>

      <div className="VaultDetails__content">
        <div>
          <p>Total Collateral Locked</p>
          <p>50 trb</p>
        </div>
        <div>
          <p>Available to withdraw</p>
          <p>4 trb</p>
        </div>
        <VaultActions section="locked" />
      </div>

      <div className="VaultDetails__content">
        <div>
          <p>Total Debt Owed</p>
          <p>232.3 dai</p>
        </div>
        <div>
          <p>Available to borrow</p>
          <p>4 trb</p>
        </div>
        <VaultActions section="borrow" />
      </div>
    </div>
  );
};

export default VaultDetails;
