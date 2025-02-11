import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import HeaderAdmin from "../components/header";
import Sidebar from "../components/sidebar";
import { Content } from "antd/es/layout/layout";

const DashboardTest: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const user = {
    name: "Nombre del Usuario",
    avatar: "/path-to-avatar.jpg", // Cambia esto al path real de tu imagen de avatar
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Content
        style={{ flex: 1, marginLeft: collapsed ? 90 : 10, padding: 15 }}
      >
        <HeaderAdmin />
        <Outlet />
      </Content>
      {/* </div> */}
    </div>
  );
};

export default DashboardTest;
