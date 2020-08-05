import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "antd";

import Routes from "./Routes";
import SideNav from "./components/shared/SideNav/SideNav";

import Icons from '../src/Icons';


import "./App.scss";

const { Content, Sider } = Layout;

const App = () => {
  return (
    <div className="App">
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider width="240px">
            <Icons.Logo fill="#fff" width="144px" />
            <SideNav />
          </Sider>
          <Layout>
            <Content>
                <Routes />
            </Content>
          </Layout>
        </Layout>
      </Router>
    </div>
  );
};

export default App;
