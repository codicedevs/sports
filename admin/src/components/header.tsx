import {
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Breadcrumb, Button, Col, Input, Row } from "antd";
import { Header } from "antd/es/layout/layout";
import { lightColors } from "../utils/colors";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import { Breadcrumbs } from "./breadcrumbs";

const HeaderAdmin = () => {
  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid gray",
        marginBottom: "10px",
      }}
    >
      <Breadcrumbs />
      <div style={{ display: "flex", gap: 15 }}>
        <Avatar
          style={{ backgroundColor: lightColors.primary, width: "30px" }}
          icon={<UserOutlined />}
        />
        <Input
          placeholder="Buscar..."
          suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
          style={{ width: 200 }}
        />
      </div>
    </Header>
  );
};

export default HeaderAdmin;
