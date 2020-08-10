import React, { useState } from "react";
import { Modal, Button } from "antd";

import ChooseToken from "./ChooseToken";
import DepositBorrow from "./DepositBorrow";

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
            <p>Configure your vault for east management.</p>
            <p>This only has to be done once.</p>
            <Button onClick={() => setStep(2)}>start</Button>
          </>
        );
      }
      case 2: {
        return (
          <ChooseToken
            vaultData={vaultData}
            setVaultData={setVaultData}
            setStep={setStep}
          />
        );
      }
      case 3: {
        return (
          <DepositBorrow
            vaultData={vaultData}
            setVaultData={setVaultData}
            setStep={setStep}
            bank={bank}
          />
        );
      }
      case 4: {
        return (
          <>
            <p>Setting up your vault...</p>
            <p>Awaiting confirmations</p>
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
      >
        <h2>Creating a Vault</h2>
        {renderStep()}
      </Modal>
    </>
  );
};

export default CreateVault;
