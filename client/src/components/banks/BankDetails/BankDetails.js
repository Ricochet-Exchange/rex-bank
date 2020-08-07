import React, { useContext, useState } from "react";
import { Modal, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { BankContext } from "../../../contexts/BankContext";
import EtherscanLink from "../../shared/EtherscanLink/EthercanLink";

import "./BankDetails.scss";
import CreateVault from "../../vaults/CreateVault/CreateVault";

const BankDetails = () => {
  const { state } = useContext(BankContext);
  const [creatingVault, setCreatingVault] = useState(false);
  const data = state.activeBank.data;

  return (
    <>
      <div className="BankDetails">
        <div className="BankDetails__header">
          <h2>Commodo Main</h2>
          <p>{state.activeBank.address}</p>
          <EtherscanLink path="address" hash={state.activeBank.address} />

          {!state.activeBank.data.vault.hasVault ? (
            <Button
              shape="round"
              size="large"
              className="purpleoutlined createvaultbtn"
              onClick={() => setCreatingVault(true)}
            >
              + create vault
            </Button>
          ) : null}
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

      <CreateVault setVisible={setCreatingVault} visible={creatingVault} />
    </>
  );
};

export default BankDetails;
