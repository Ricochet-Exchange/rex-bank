import React, { useState, useContext } from "react";
import { Button } from "antd";

import { Web3Context } from "../../../contexts/RootContexts";
import { truncateAddr } from "../../../utils/helpers";
import EtherscanLink from "../../shared/EtherscanLink/EthercanLink";
import CreateVault from "../../vaults/CreateVault/CreateVault";
import Web3SignIn from "../../account/Web3SignIn";

import "./BankDetails.scss";

const BankDetails = ({ address, bank }) => {
  const [web3] = useContext(Web3Context);
  const [creatingVault, setCreatingVault] = useState(false);
  const data = bank.data;

  return (
    <>
      <div className="BankDetails">
        <div className="BankDetails__header">
          <h2>{data.name}</h2>
          <p>{truncateAddr(address)}</p>
          <EtherscanLink path="address" hash={address} />

          {web3 && web3.account ? (
            <>
              {!bank.data.vault.hasVault ? (
                <Button
                  shape="round"
                  size="large"
                  className="purpleoutlined createvaultbtn"
                  onClick={() => setCreatingVault(true)}
                >
                  + create vault
                </Button>
              ) : null}
            </>
          ) : (
            <Web3SignIn size="small" color="purple" />
          )}
        </div>

        <div className="BankDetails__content">
          <div className="BankDetail flexer">
            <p>Available for borrow</p>
            <div className="BigDetail">
              <h1>{(+data.reserveBalance / 1e18).toFixed()}</h1>
              <h3> DAI</h3>
            </div>
          </div>

          <div className="BankDetails__Column">
            <div className="BankDetail">
              <p>Interest Rate</p>
              <h3>{+data.interestRate} %</h3>
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

      <CreateVault
        bank={bank}
        setVisible={setCreatingVault}
        visible={creatingVault}
      />
    </>
  );
};

export default BankDetails;
