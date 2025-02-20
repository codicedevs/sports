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
    getItem("Dashboard", "1", <PieChartOutlined />, null, () => navigate("")),
    getItem("Partidos", "2", <TableOutlined />, null, () =>
      navigate("partidos")
    ),
    getItem("Menu Auxiliar", "sub2", <UserOutlined />, [
      getItem("Opcion 1", "3", null, null, () => navigate("profile")),
      getItem("Opcion 2", "4", null, null, () => navigate("profile")),
      getItem("Opcion 3", "5", null, null, () => navigate("profile")),
    ]),
  ];
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      // onCollapse={(value) => setCollapsed(value)}
      trigger={null}
      style={{
        minHeight: "100vh",
        marginLeft: 10,
        borderRadius: 20,
        padding: "0 10px",
        overflow: "auto",
        position: "fixed",
        width: collapsed ? "80px" : "200px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        {collapsed ? (
          <img
            src={logoColap}
            alt="logo"
            style={{ width: "50px", margin: "10px" }}
          />
        ) : (
          <div>
            <img
              src={logo}
              alt="logo"
              style={{ width: "150px", marginRight: "10px" }}
            />
            <h2 style={{ color: lightColors.pressed }}>Loyal Futbol 5</h2>
          </div>
        )}
      </div>

      <Menu defaultSelectedKeys={["1"]} mode="inline" items={items} />
    </Sider>
  );
};

export default Sidebar;
