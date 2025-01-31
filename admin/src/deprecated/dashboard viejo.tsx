import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import { Layout } from "antd";

const { Header, Footer } = Layout;

function Dashboard() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div style={{ flex: 1, display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
