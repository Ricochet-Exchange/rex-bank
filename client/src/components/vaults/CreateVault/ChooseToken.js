import React from "react";
import { Button, Dropdown, Menu } from "antd";

import Icons from "../../../Icons";

import "./CreateVault.scss";

const ChooseToken = ({ vaultData, setVaultData, setStep }) => {
  const handleMenuClick = () => {
    //TODO: Will dispatch to set active pair in bank context
    //setVaultData
    console.log("collateral selected");
  };

  //TODO will be a dynamic list eventually
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">1st menu item</Menu.Item>
      <Menu.Item key="2">2nd menu item</Menu.Item>
      <Menu.Item key="3">3rd menu item</Menu.Item>
    </Menu>
  );
  return (
    <>
      <p>Choose collateral token:</p>
      <Dropdown overlay={menu} disabled={true}>
        <Button shape="round">
          {vaultData.collateralToken} <Icons.Arrowdown />
        </Button>
      </Dropdown>

      <p>More assets coming soon</p>

      <Button onClick={() => setStep(3)}>next</Button>
    </>
  );
};

export default ChooseToken;
