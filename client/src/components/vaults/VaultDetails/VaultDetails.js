import React, {useState} from "react";
import { BankOutlined } from "@ant-design/icons";

import VaultActions from "./VaultActions/VaultActions";

import "./VaultDetails.scss";

const VaultDetails = ({ address, bank }) => {
  const data = bank.data;

  const [collColor, setCollColor] = useState('tellorgreen');

  return (
    <div className="VaultDetails">
      <div className="VaultDetails__header">
        <div className="VaultDetails__Column collrat">
          <p>Collateralization Ratio</p>
            <div className="BigDetail">
              <h1 className={collColor}>{data.collateralizationRatio}</h1>
              <h3 className={collColor}>%</h3>
            </div>
        </div>
        <div className="VaultDetails__Column">
          <div className="VaultDetail">
            <p>Liquidation Price</p>
            <div className="BigDetail liqprice">
              <h1>129.54 </h1>
              <h3>TRB/USD</h3>
            </div>
          </div>
        </div>
        <div className="VaultDetails__Bank">
          <p>This vault is part of</p>
          <p>Commodo Main</p>
          <p>{address}</p>
          <BankOutlined />
        </div>
      </div>

      <div className="VaultDetails__content firstrow">
        <div className="VaultDetails__Column">
            <div className="VaultDetail">
              <p>Total Collateral Locked</p>
              <h3>{(+data.vault.collateralAmount / 1e18).toFixed()} TRB</h3>
            </div>
        </div>
        <div className="VaultDetails__Column">
            <div className="VaultDetail">
              <p>Available to withdraw</p>
              <h3>{(+data.vault.repayAmount / 1e18).toFixed()} TRB</h3>
            </div>
        </div>
        <VaultActions section="locked" />
      </div>

      <div className="VaultDetails__content">
        <div className="VaultDetails__Column">
          <div className="VaultDetail">
            <p>Total Debt Owed</p>
            <h3>{(+data.vault.debtAmount / 1e18).toFixed()} DAI</h3>
          </div>
        </div>
        <div className="VaultDetails__Column">
          <div className="VaultDetail">
            <p>Available to borrow</p>
            <h3>{(+data.reserveBalance / 1e18).toFixed()} DAI</h3>
          </div>
        </div>
        <VaultActions section="borrow" />
      </div>
    </div>
  );
};

export default VaultDetails;
