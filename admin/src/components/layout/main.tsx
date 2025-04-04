import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import HeaderAdmin from "./header";
import Sidebar from "./sidebar";
import { Content } from "antd/es/layout/layout";
import styled from "styled-components";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  overflow: hidden;
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const user = {
    name: "Nombre del Usuario",
    avatar: "/path-to-avatar.jpg",
  };

  return (
    <DashboardContainer>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Content
        style={{
          flex: 1,
          marginLeft: collapsed ? 90 : 210,
          padding: 15,
          overflow: "auto",
        }}
      >
        <HeaderAdmin collapsed={collapsed} setCollapsed={setCollapsed} />
        <Outlet />
      </Content>
    </DashboardContainer>
  );
};

export default Dashboard;
