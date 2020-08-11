import React from "react";
import { BankOutlined } from "@ant-design/icons";

import VaultActions from "./VaultActions/VaultActions";

import "./VaultDetails.scss";

const VaultDetails = ({ address, bank }) => {
  const data = bank.data;

  return (
    <div className="VaultDetails">
      <div className="VaultDetails__header">
        <div>
          <p>Collateralization Ratio</p>
          <p>{data.collateralizationRatio} %</p>
        </div>
        <div>
          <p>Liquidation Price</p>
          <p>129.54 trb/usd</p>
        </div>
        <div>
          <p>This vault is part of</p>
          <p>Commodo Main</p>
          <p>{address}</p>
          <BankOutlined />
        </div>
      </div>

      <div className="VaultDetails__content">
        <div>
          <p>Total Collateral Locked</p>
          <p>{(+data.vault.collateralAmount / 1e18).toFixed(2)} TRB</p>
        </div>
        <div>
          <p>Available to withdraw</p>
          <p>{(+data.vault.repayAmount / 1e18).toFixed(2)} TRB</p>
        </div>
        <VaultActions section="locked" />
      </div>

      <div className="VaultDetails__content">
        <div>
          <p>Total Debt Owed</p>
          <p>{(+data.vault.debtAmount / 1e18).toFixed(2)} DAI</p>
        </div>
        <div>
          <p>Available to borrow</p>
          <p>{(+data.reserveBalance / 1e18).toFixed(2)} DAI</p>
        </div>
        <VaultActions section="borrow" />
      </div>
    </div>
  );
};

export default VaultDetails;
