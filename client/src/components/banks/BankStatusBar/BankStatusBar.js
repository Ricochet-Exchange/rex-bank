import React, { useContext } from "react";

import { BankContext } from "../../../contexts/BankContext";
// import TRB from '../../../images/TRB.png';
// import DAI from '../../../images/TDAI.png';

import "./BankStatusBar.scss";

const BankStatusBar = (props) => {
  const { state } = useContext(BankContext);
  const data = state.banks[state.bankAddresses[0]].data;
  const granularity = 1000000;

  return (
    <>
    {
      props.vault ?
    <>
      {props.coll ?
      <div className="VaultDetail">
        <p>{data.collateralToken.symbol} Price (USD)</p>
        <h3>{+data.collateralToken.price / granularity} $</h3>
      </div>
      :
      <div className="VaultDetail">
        <p>{data.debtToken.symbol} Price (USD)</p>
        <h3>{+data.debtToken.price / granularity} $</h3>
      </div>
      }
    </>
    :
    <>
      <div className="BankDetail">
        <p>{data.collateralToken.symbol} Price (USD)</p>
        <h3>{+data.collateralToken.price / granularity} $</h3>
      </div>
      <div className="BankDetail">
        <p>{data.debtToken.symbol} Price (USD)</p>
        <h3>{+data.debtToken.price / granularity} $</h3>
      </div>
    </>
    }
    </>
  );
};

export default BankStatusBar;
