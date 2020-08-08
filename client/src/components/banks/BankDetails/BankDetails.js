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

          <div className="BankDetail flexer">
            <p>Available for borrow</p>
            <div className="BigDetail"><h1>{(+data.reserveBalance / 1e18).toFixed()}</h1><h3> DAI</h3></div>
          </div>

          <div className="BankDetails__Column">
            <div className="BankDetail">
              <p>Interest Rate</p>
              <h3>{data.interestRate} %</h3>
            </div>
            <div className="BankDetail">
              <p>Origination Fee</p>
              <h3>{data.originationFee} %</h3>
            </div>

          </div>

          <div>
            <div className="BankDetail">
              <p>Collateralization Ratio</p>
              <h3>{data.collateralizationRatio} %</h3>
            </div>
            <div className="BankDetail">
              <p>Liquidation Penalty</p>
              <h3>{data.liquidationPenalty} %</h3>
            </div>
          </div>
        </div>
      </div>

      <CreateVault setVisible={setCreatingVault} visible={creatingVault} />
    </>
  );
};

export default BankDetails;
