import { MenuOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Input } from "antd";
import { Header } from "antd/es/layout/layout";
import { lightColors } from "../utils/colors";
import { Breadcrumbs } from "./breadcrumbs";
import { SetStateType } from "../interfaces/types";

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: SetStateType<boolean>;
}
const HeaderAdmin = ({ collapsed, setCollapsed }: HeaderProps) => {
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
      <div style={{ display: "flex", gap: 15 }}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setCollapsed(!collapsed)}
        />
        <Breadcrumbs />
      </div>
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
