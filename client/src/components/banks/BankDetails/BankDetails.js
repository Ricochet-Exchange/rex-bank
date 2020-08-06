import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { BankContext } from "../../../contexts/BankContext";
import EtherscanLink from "../../shared/EtherscanLink/EthercanLink";

import "./BankDetails.scss";

const BankDetails = () => {
  const { state } = useContext(BankContext);
  const data = state.activeBank.data;

  return (
    <div className="BankDetails">
      <div className="BankDetails__header">
        <h2>Commodo Main</h2>
        <p>{state.activeBank.address}</p>
        <EtherscanLink path="address" hash={state.activeBank.address} />
        <Button
          type="primary"
          shape="round"
          icon={<PlusOutlined />}
          size="large"
        >
          <Link to="/">Create Vault</Link>
        </Button>
      </div>

      <div className="BankDetails__content">
        <p>Available for borrow</p>
        <p>{(+data.reserveBalance / 1e18).toFixed()} DAI</p>
        <div>
          <p>Interest Rate</p>
          <p>{data.interestRate} %</p>
          <p>Collateralization Ratio</p>
          <p>{data.collateralizationRatio} %</p>

          <p>Origination Fee</p>
          <p>{data.originationFee} %</p>
          <p>Liquidation Penalty</p>
          <p>{data.liquidationPenalty} %</p>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;
