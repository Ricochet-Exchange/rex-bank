import React, { useState } from "react";
import { BankOutlined } from "@ant-design/icons";

import VaultActions from "../VaultActions/VaultActions";
import VaultTransaction from "../VaultTransaction/VaultTransaction";

import "./VaultDetails.scss";

const VaultDetails = ({ bank }) => {
  const [collColor] = useState("tellorgreen");
  const [activeTransaction, setActiveTransaction] = useState();
  const [txPending, setTxPending] = useState();
  const data = bank.data;

  console.log("bank.data", bank.data);

  const cR = +data.vault.collateralizationRatio / 10000;
  const aD = +data.vault.debtAmount / 10 ** +data.debtToken.decimals;
  const pD = +data.debtToken.price / +data.debtToken.granularityPrice;
  const aC =
    +data.vault.collateralAmount / 10 ** +data.collateralToken.decimals;

  console.log("cR, aD, pD, aC", cR, aD, pD, aC);
  const liquidationPrice = (cR * aD * pD) / aC;
  // need to give to mike to check - just getting the price of trb
  // 3.75 is right ?

  // need calculation for available to withdraw
  // Wd = Ac * (C * Ad * Pd) / (Ac * Pc)
  // Wd = Available to withdraw
  // C = Collateralization Ratio
  // Ad = Amount of Debt
  // Pd = Price of Debt in USD
  // Ac = Amount of Collateral
  // Pc = Price of collateral

  // move these to helpers.js

  // new contract with name

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
              <h1>{liquidationPrice.toFixed(2)}</h1>
              <h3>
                {data.collateralToken.symbol}/{data.debtToken.symbol}
              </h3>
            </div>
          </div>
        </div>
        <div className="VaultDetails__Bank">
          <p>This vault is part of</p>
          <p>Commodo Main</p>
          <p>{bank.service.contractAddr}</p>
          <BankOutlined />
        </div>
      </div>

      <div className="VaultDetails__content firstrow">
        <div className="VaultDetails__Column">
          <div className="VaultDetail">
            <p>Total Collateral Locked</p>
            <h3>
              {(+data.vault.collateralAmount / 1e18).toFixed()}{" "}
              {data.collateralToken.symbol}
            </h3>
          </div>
        </div>
        <div className="VaultDetails__Column">
          <div className="VaultDetail">
            <p>Available to withdraw</p>
            <h3>
              {/* {(+data.vault.repayAmount / 1e18).toFixed()}{" "} */}0
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
              {(+data.vault.debtAmount / 1e18).toFixed()}{" "}
              {data.debtToken.symbol}
            </h3>
          </div>
        </div>
        <div className="VaultDetails__Column">
          <div className="VaultDetail">
            <p>Available to borrow</p>
            <h3>
              {(+data.reserveBalance / 1e18).toFixed()} {data.debtToken.symbol}
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
