import React from "react";
import { Layout } from "antd";

import SideNav from "./components/shared/SideNav";

import "./App.scss";

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  return (
    <div className="App">
      <Layout style={{ minHeight: "100vh" }}>
        <Sider>
          <h1>Commodo</h1>
          <SideNav />
        </Sider>
        <Layout>
          <Content style={{ margin: "0 16px" }}>
            <div style={{ padding: 24, minHeight: 360 }}>content</div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default App;
