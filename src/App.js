import React from 'react';
import Symbols from "./components/Search"
import { Layout} from 'antd';
const { Header, Content } = Layout;

function App() {
  return (
    <Layout className="layout">
       <Header>
      <h2 style={{ color: "white", fontWeight: "1000"}}><b>STOCK TWITS API</b></h2>
    </Header>
    <Content style={{ padding: '0 100px', background: "white" }}>
      <div className="site-layout-content">
        <Symbols/>
      </div>
    </Content>
    {/* <Footer style={{ textAlign: 'center' }}>Pranay Nagula</Footer> */}
    </Layout>
  );
}

export default App;
