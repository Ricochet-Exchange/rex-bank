import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
// import { BankOutlined, WalletOutlined } from "@ant-design/icons";

import { Web3Context } from "../../../contexts/RootContexts";
import Web3SignIn from "../../account/Web3SignIn";

import Icons from "../../../Icons";

import "./SideNav.scss";

const SideNav = () => {
  const [web3] = useContext(Web3Context);

  return (
    <Menu defaultSelectedKeys={["1"]} mode="inline" inlineIndent={0}>
      <Menu.Item key="1">
        <Link to="/">
          <Icons.Bank />
          Banks
        </Link>
      </Menu.Item>

      {web3 && web3.account ? (
        <Menu.Item key="2">
          <Link to="/vault">
            <Icons.Vault />
            Vaults
          </Link>
        </Menu.Item>
      ) : (
        <Web3SignIn />
      )}
    </Menu>
  );
};

export default SideNav;
