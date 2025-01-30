import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu } from "antd";

export default function Header() {
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="protected/profile">Perfil</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="protected/settings">Configuración</a>
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
        padding: "10 0px",
      }}
    >
      <h2 style={{ paddingLeft: "20px" }}>Sports Admin</h2>
      <div
        style={{
          padding: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Dropdown overlay={menu} trigger={["click"]}>
          <div>
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              <SettingOutlined />
            </a>
          </div>
        </Dropdown>
        <Avatar
          style={{ backgroundColor: "#1720a8" }}
          icon={<UserOutlined />}
        />
      </div>
    </div>
  );
}
