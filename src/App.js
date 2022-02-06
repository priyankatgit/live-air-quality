import "./index.css";
import "antd/dist/antd.css";
import { Layout } from "antd";
import AQI from "./components/AQI";

const { Header, Content } = Layout;

function App() {
  return (
    <Layout>
      <Header id="header">
        <h2>Air Quality Index</h2>
      </Header>
      <Content id="content" style={{ margin: "24px 16px", height: "85vh" }}>
        <AQI></AQI>
      </Content>
    </Layout>
  );
}

export default App;
