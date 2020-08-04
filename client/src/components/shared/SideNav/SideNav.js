import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { BankOutlined, WalletOutlined } from "@ant-design/icons";

import { Web3Context } from "../../../contexts/Store";
import Web3SignIn from "../../account/Web3SignIn";

import "./SideNav.scss";

const SideNav = () => {
  const [w3Service, setWeb3Service] = useContext(Web3Context);

  return (
    <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
      <Menu.Item key="1" icon={<BankOutlined />}>
        <Link to="/">Banks</Link>
      </Menu.Item>

      {w3Service && w3Service.account ? (
        <Menu.Item key="2" icon={<WalletOutlined />}>
          <Link to="/vault">Vaults</Link>
        </Menu.Item>
      ) : (
        <Web3SignIn />
      )}
    </Menu>
  );
};

export default SideNav;
