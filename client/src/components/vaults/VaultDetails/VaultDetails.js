import React, { useState } from "react";

import VaultActions from "../VaultActions/VaultActions";
import VaultTransaction from "../VaultTransaction/VaultTransaction";
import Icons from "../../../Icons";

import "./VaultDetails.scss";
import { truncateAddr, getVaultCalcValues } from "../../../utils/helpers";

const VaultDetails = ({ bank }) => {
  const [collColor] = useState("tellorgreen");
  const [activeTransaction, setActiveTransaction] = useState();
  const [txPending, setTxPending] = useState();

  const data = bank.data;

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
              <h1>{vaultCalcValues.liquidationPrice.toFixed(2)}</h1>
              <h3>{data.collateralToken.symbol}/USD</h3>
            </div>
          </div>
        </div>
        <div className="VaultDetails__Bank">
          <p>This vault is part of</p>
          <div className="BankData">
            <div className="BankDataTxt">
              <p className="BankName">{bank.data.name}</p>
              <p>{truncateAddr(bank.service.contractAddr)}</p>
            </div>
            <Icons.Bank fill="#848484" />
          </div>
        </div>
      </div>

      <div className="VaultDetails__content firstrow">
        <div className="VaultDetails__Column">
          <div className="VaultDetail">
            <p>Total Collateral Locked</p>
            <h3>
              {(+data.vault.collateralAmount / 1e18).toFixed(4)}{" "}
              {data.collateralToken.symbol}
            </h3>
          </div>
        </div>
        <div className="VaultDetails__Column flexer">
          <div className="VaultDetail">
            <p>Available to withdraw</p>
            <h3>
              {vaultCalcValues.withdrawAvailable.toFixed(4)}{" "}
              {data.collateralToken.symbol}
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
              {(+data.vault.debtAmount / 1e18).toFixed(4)}{" "}
              {data.debtToken.symbol}
            </h3>
          </div>
        </div>
        <div className="VaultDetails__Column flexer">
          <div className="VaultDetail">
            <p>Available to borrow</p>
            <h3>
              {vaultCalcValues.borrowAvailable.toFixed(4)}{" "}
              {data.debtToken.symbol}
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
