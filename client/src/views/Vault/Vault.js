import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { BankOutlined } from "@ant-design/icons";

import BankStatusBar from "../../components/banks/BankStatusBar/BankStatusBar";
import VaultDetails from "../../components/vaults/VaultDetails/VaultDetails";

import "./Vault.scss";

const Vault = () => {
  const hasVault = false;

  return (
    <div>
      {hasVault ? (
        <>
          <BankStatusBar />
          <VaultDetails />
        </>
      ) : (
        <>
          <p>You didn't create a vault yet.</p>
          <p>Choose a bank to create a vault with.</p>
          <Button
            type="primary"
            shape="round"
            icon={<BankOutlined />}
            size="large"
          >
            <Link to="/">View Banks</Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default Vault;
