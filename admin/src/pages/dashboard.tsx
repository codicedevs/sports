import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import HeaderAdmin from "../components/layout/header";
import Sidebar from "../components/layout/sidebar";
import { Content } from "antd/es/layout/layout";
import styled from "styled-components";

const StyledDiv = styled.div`
  display: "flex",
  flexDirection: "row",
  minHeight: "100vh",
  overflow: "hidden",
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const user = {
    name: "Nombre del Usuario",
    avatar: "/path-to-avatar.jpg", // Cambia esto al path real de tu imagen de avatar
  };

  return (
    <StyledDiv>
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
    </StyledDiv>
  );
};

export default Dashboard;
