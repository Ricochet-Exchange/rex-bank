import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";

import { Web3Context } from "../../../contexts/RootContexts";
import Web3SignIn from "../../account/Web3SignIn";

import Icons from "../../../Icons";

import "./SideNav.scss";

const SideNav = () => {
  const [web3] = useContext(Web3Context);

  return (
    <>
      <Menu defaultSelectedKeys={["1"]} mode="inline" inlineIndent={0}>
        {web3 && web3.account ? null : <Web3SignIn />}
        <Menu.Item key="1">
          <Link to="/banks">
            <Icons.Bank />
            Banks
          </Link>
        </Menu.Item>

        <Menu.Item key="2">
          <Link to={`/vaults`}>
            <Icons.Vault />
            Vaults
          </Link>
        </Menu.Item>
      </Menu>
    </>
  );
};

export default SideNav;
