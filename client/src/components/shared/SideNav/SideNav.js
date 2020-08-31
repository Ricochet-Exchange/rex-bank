import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";

import { Web3Context } from "../../../contexts/RootContexts";
import Web3SignIn from "../../account/Web3SignIn";

import Icons from "../../../Icons";
import { truncateAddr } from "../../../utils/helpers";

import "./SideNav.scss";

const SideNav = () => {
  const [web3] = useContext(Web3Context);
  const location = useLocation();

  return (
    <>
      <Menu
        defaultSelectedKeys={location.pathname}
        mode="inline"
        inlineIndent={0}
      >




        <div className="web3feedback">
          {web3 && web3.account ? <div className="connected"><div className="dot"></div><p>{truncateAddr(web3.account)}</p></div> : <Web3SignIn size="small" />}
        </div>
        <Menu.Item key="/banks">
          <Link to="/banks">
            <Icons.Bank />
            Banks
          </Link>
        </Menu.Item>

        <Menu.Item key="/vaults">
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
