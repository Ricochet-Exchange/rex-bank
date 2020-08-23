import React, { useState } from "react";
import { BankOutlined } from "@ant-design/icons";

import VaultActions from "../VaultActions/VaultActions";
import VaultTransaction from "../VaultTransaction/VaultTransaction";

import "./VaultDetails.scss";
import { truncateAddr, getVaultCalcValues } from "../../../utils/helpers";

const VaultDetails = ({ bank }) => {
  const [collColor] = useState("tellorgreen");
  const [activeTransaction, setActiveTransaction] = useState();
  const [txPending, setTxPending] = useState();

  const data = bank.data;
  console.log("bank.data", bank.data);

  const vaultCalcValues = getVaultCalcValues(data);

  return (
    <div className="VaultDetails">
      <div className="VaultDetails__header">
        <div className="VaultDetails__Column collrat">
          <p>Collateralization Ratio</p>
          <div className="BigDetail">
            <h1 className={collColor}>
              {+data.vault.collateralizationRatio / 100}
            </h1>
            <h3 className={collColor}>%</h3>
          </div>
        </div>
        <div className="VaultDetails__Column">
          <div className="VaultDetail">
            <p>Liquidation Price</p>
            <div className="BigDetail liqprice">
              <h1>{vaultCalcValues.liquidationPrice}</h1>
              <h3>{data.collateralToken.symbol}/USD</h3>
            </div>
          </div>
        </div>
        <div className="VaultDetails__Bank">
          <p>This vault is part of</p>
          <p>{bank.data.name}</p>
          <p>{truncateAddr(bank.service.contractAddr)}</p>
          <BankOutlined />
        </div>
      </div>

      <div className="VaultDetails__content firstrow">
        <div className="VaultDetails__Column">
          <div className="VaultDetail">
            <p>Total Collateral Locked</p>
            <h3>
              {+data.vault.collateralAmount / 1e18}{" "}
              {data.collateralToken.symbol}
            </h3>
          </div>
        </div>
        <div className="VaultDetails__Column">
          <div className="VaultDetail">
            <p>Available to withdraw</p>
            <h3>
              {vaultCalcValues.withdrawAvailable} {data.collateralToken.symbol}
            </h3>
          </div>
        </div>
        <VaultActions
          section="locked"
          activeTransaction={activeTransaction}
          setActiveTransaction={setActiveTransaction}
          txPending={txPending}
        />
      </div>

      <div className="VaultDetails__content">
        <div className="VaultDetails__Column">
          <div className="VaultDetail">
            <p>Total Debt Owed</p>
            <h3>
              {+data.vault.debtAmount / 1e18} {data.debtToken.symbol}
            </h3>
          </div>
        </div>
        <div className="VaultDetails__Column">
          <div className="VaultDetail">
            <p>Available to borrow</p>
            <h3>
              {+data.reserveBalance / 1e18} {data.debtToken.symbol}
            </h3>
          </div>
        </div>
        <VaultActions
          section="borrow"
          activeTransaction={activeTransaction}
          setActiveTransaction={setActiveTransaction}
          txPending={txPending}
        />
      </div>
      {activeTransaction ? (
        <VaultTransaction
          activeTransaction={activeTransaction}
          setActiveTransaction={setActiveTransaction}
          tx={txPending}
          setTx={setTxPending}
          bank={bank}
        />
      ) : null}
    </div>
  );
};

export default VaultDetails;
