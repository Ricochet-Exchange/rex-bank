import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { BankOutlined, WalletOutlined } from "@ant-design/icons";

import { CurrentUserContext } from "../../../contexts/Store";
import { Web3SignIn } from "../../account/Web3SignIn";

import "./SideNav.scss";

const SideNav = () => {
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  console.log("currentUser", currentUser);

  return (
    <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
      <Menu.Item key="1" icon={<BankOutlined />}>
        <Link to="/">Banks</Link>
      </Menu.Item>

      {currentUser && currentUser.username ? (
        <Menu.Item key="2" icon={<WalletOutlined />}>
          <Link to="/vault">Vaults</Link>
        </Menu.Item>
      ) : (
        <Web3SignIn setCurrentUser={setCurrentUser} />
      )}
    </Menu>
  );
};

export default SideNav;
