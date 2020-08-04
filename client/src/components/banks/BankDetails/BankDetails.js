import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import EtherscanLink from "../../shared/EtherscanLink/EthercanLink";

import "./BankDetails.scss";

const BankDetails = () => {
  return (
    <div className="BankDetails">
      <div className="BankDetails__header">
        <h2>Commodo Main</h2>
        <p>0x123...dude</p>
        <EtherscanLink path="address" hash="0x" />
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
        <p>670,000 dai</p>
        <div>
          <p>Interest Rate</p>
          <p>12%</p>
          <p>Collateralization Ratio</p>
          <p>Origination Fee</p>
          <p>1%</p>
          <p>Liquidation Penalty</p>
          <p>20%</p>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;
