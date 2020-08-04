import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "antd";

import Routes from "./Routes";
import SideNav from "./components/shared/SideNav/SideNav";

import "./App.scss";

const { Content, Sider } = Layout;

const App = () => {
  return (
    <div className="App">
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider>
            <h1>Commodo</h1>
            <SideNav />
          </Sider>
          <Layout>
            <Content style={{ margin: "0 16px" }}>
              <div style={{ padding: 24, minHeight: 360 }}>
                <Routes />
              </div>
            </Content>
          </Layout>
        </Layout>
      </Router>
    </div>
  );
};

export default App;
