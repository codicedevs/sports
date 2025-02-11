import React, { useState } from "react";

import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  SettingOutlined,
  TableOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Breadcrumb, Button, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import HeaderAdmin from "../components/header";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[] | null,
  onClick?: () => void,
  danger: boolean = false
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    onClick,
    danger,
  } as MenuItem;
}
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const items: MenuItem[] = [
    getItem("Dashboard", "1", <PieChartOutlined />, null, () => navigate("")),
    getItem("Partidos", "2", <TableOutlined />, null, () =>
      navigate("partidos")
    ),
    getItem("Jugadores", "sub2", <UserOutlined />, [
      getItem("Tom", "3", null, null, () => navigate("profile")),
      getItem("Bill", "4", null, null, () => navigate("profile")),
      getItem("Alex", "5", null, null, () => navigate("profile")),
    ]),
  ];
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const user = {
    name: "Nombre del Usuario",
    avatar: "/path-to-avatar.jpg", // Cambia esto al path real de tu imagen de avatar
  };

  return (
    <Layout>
      <HeaderAdmin />
      <Layout
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
        }}
      >
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{ height: "100vh" }}
        >
          <div />
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout>
          <Content>
            {/* <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb> */}
            <div
              style={{
                height: "100%",
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Codice ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
