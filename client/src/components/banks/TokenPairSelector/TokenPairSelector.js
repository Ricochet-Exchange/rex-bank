import React, { useContext } from "react";
import { Dropdown, Button, Menu } from "antd";

import { BankContext } from "../../../contexts/BankContext";
import Icons from "../../../Icons";

import "./TokenPairSelector.scss";

const TokenPairSelector = () => {
  const { state } = useContext(BankContext);

  const handleMenuClick = () => {
    //TODO: Will dispatch to set active pair in bank context
    console.log("bank selected");
  };

  //TODO: This will need a way to look up all token pairs and associate to a bank so get the correct data
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">1st menu item</Menu.Item>
      <Menu.Item key="2">2nd menu item</Menu.Item>
      <Menu.Item key="3">3rd menu item</Menu.Item>
    </Menu>
  );
  return (
    <div>
      <Dropdown overlay={menu} disabled={true}>
        <Button shape="round" className="purplebutton purpledropdown">
          {state.activePair} <Icons.Arrowdown />
        </Button>
      </Dropdown>
    </div>
  );
};

export default TokenPairSelector;
