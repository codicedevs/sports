import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu } from "antd";

export default function Header() {
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="/profile">Perfil</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="/settings">Configuración</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2">Cerrar Sesión</Menu.Item>
    </Menu>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "50px",
        background: "#f0f2f5",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "0 20px",
      }}
    >
      <h1 style={{ marginLeft: "20" }}>Sports Admin</h1>
      <div>
        <Dropdown trigger={["click"]}>
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            <Avatar
              style={{ backgroundColor: "#87d068" }}
              icon={<UserOutlined />}
            />
            <SettingOutlined style={{ marginLeft: 8 }} />
          </a>
        </Dropdown>
      </div>
    </div>
  );
}
