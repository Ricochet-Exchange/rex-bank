import React from "react";
import { Dropdown, Button, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";

import "./BankSelector.scss";

const BankSelector = ({ currentBank }) => {
  const handleMenuClick = () => {
    console.log("bank selected");
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">1st menu item</Menu.Item>
      <Menu.Item key="2">2nd menu item</Menu.Item>
      <Menu.Item key="3">3rd menu item</Menu.Item>
    </Menu>
  );
  return (
    <div>
      <Dropdown overlay={menu}>
        <Button>
          {currentBank.label} <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default BankSelector;
