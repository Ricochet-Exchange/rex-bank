import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "antd";

import DepositBorrow from "./DepositBorrow";
import Icons from "../../../Icons";

import "./CreateVault.scss";

const CreateVault = ({ bank, visible, setVisible }) => {
  console.log("bank", bank);
  const [step, setStep] = useState(1);
  const [vaultData, setVaultData] = useState({
    collateralToken: bank.data.collateralToken.symbol,
    debtToken: "DAI",
    depositAmount: "0",
    borrowAmount: "0",
  });

  const renderStep = () => {
    switch (step) {
      case 1: {
        return (
          <>
            <p>
              You're creating a vault for
              <br /><strong>Commodo Main (
              {bank.data.collateralToken.symbol}-{bank.data.debtToken.symbol})</strong>
            </p>
            <Button shape="round" size="large" className="purplebutton" onClick={() => setStep(2)}>start</Button>
          </>
        );
      }
      case 2: {
        return (
          <DepositBorrow
            vaultData={vaultData}
            setVaultData={setVaultData}
            setStep={setStep}
            bank={bank}
          />
        );
      }
      case 3: {
        return (
          <>
            <p>Setup succesful!</p>
            <Icons.Vmark className="vmark" />
            <Link to="/vaults?new=true">
              <Button className="biggestbutton heavyshadow" size="large">
                <Icons.Vault fill="#4F56B5" />
                view vault
              </Button>
            </Link>
          </>
        );
      }
      default: {
        return null;
      }
    }
  };

  return (
    <>
      <Modal
        wrapClassName="vertical-center-modal"
        visible={visible}
        onCancel={() => setVisible(false)}
        maskClosable={false}
        footer={null}
        closeIcon={<Icons.Xmark width="22px"/>}
      >
        <h2>Creating a Vault</h2>
        {renderStep()}
      </Modal>
    </>
  );
};

export default CreateVault;
