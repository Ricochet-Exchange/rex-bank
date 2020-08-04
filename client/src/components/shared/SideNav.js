import React, { useContext } from "react";
import { Menu } from "antd";
import { BankOutlined, WalletOutlined } from "@ant-design/icons";

import { CurrentUserContext } from "../../contexts/Store";
import { Web3SignIn } from "../account/Web3SignIn";

const SideNav = () => {
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  console.log("currentUser", currentUser);

  return (
    <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
      <Menu.Item key="1" icon={<BankOutlined />}></Menu.Item>

      {currentUser && currentUser.username ? (
        <Menu.Item key="2" icon={<WalletOutlined />}></Menu.Item>
      ) : (
        <Web3SignIn setCurrentUser={setCurrentUser} />
      )}
    </Menu>
  );
};

export default SideNav;
