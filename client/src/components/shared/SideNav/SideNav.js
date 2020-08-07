import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
// import { BankOutlined, WalletOutlined } from "@ant-design/icons";

import { Web3Context } from "../../../contexts/RootContexts";
import Web3SignIn from "../../account/Web3SignIn";
import { BankContext } from "../../../contexts/BankContext";

import Icons from "../../../Icons";

import "./SideNav.scss";

const SideNav = () => {
  const [web3] = useContext(Web3Context);
  const { state } = useContext(BankContext);

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
          {state.activeBank && state.activeBank.address ? (
            <Link to={`/vault/${state.activeBank.address}`}>
              <Icons.Vault />
              Vault
            </Link>
          ) : null}
        </Menu.Item>
      ) : (
        <Web3SignIn />
      )}
    </Menu>
  );
};

export default SideNav;
