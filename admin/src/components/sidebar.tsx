import {
  PieChartOutlined,
  TableOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu, MenuProps, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import logoColap from "../assets/Pelota logo.png";
import { lightColors } from "../utils/colors";
import { SetStateType } from "../interfaces/types";

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

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: SetStateType<boolean>;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const navigate = useNavigate();
  const items: MenuItem[] = [
    // getItem("Dashboard", "1", <PieChartOutlined />, null, () => navigate("")),
    getItem("Partidos", "2", <TableOutlined />, null, () =>
      navigate("partidos")
    ),
    getItem("Menu Usuarios", "sub2", <UserOutlined />, [
      getItem("Lista de usuarios", "3", null, null, () => navigate("users")),
      getItem("Nuevo Usuario", "4", null, null, () => navigate("newUser")),
    ]),
  ];
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      // onCollapse={(value) => setCollapsed(value)}
      trigger={null}
      style={{
        minHeight: "98vh",
        marginLeft: 10,
        borderRadius: 20,
        padding: "0 10px",
        overflow: "auto",
        position: "fixed",
        width: collapsed ? "80px" : "200px",
        margin: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 10,
          padding: 20,
        }}
      >
        {collapsed ? (
          <img
            src={logoColap}
            alt="logo"
            style={{ width: "30px", margin: "10px" }}
          />
        ) : (
          <>
            <img src={logo} alt="logo" style={{ width: "100px" }} />
            <h2 style={{ color: lightColors.secondary }}>Loyal Futbol 5</h2>
          </>
        )}
      </div>

      <Menu defaultSelectedKeys={["1"]} mode="inline" items={items} />
    </Sider>
  );
};

export default Sidebar;
