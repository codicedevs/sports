import {
  PieChartOutlined,
  TableOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../../assets/logoDeballOrange.jpg";
import logoColap from "../../assets/Pelota logo.png";
import { SetStateType } from "../../types/types";
import { lightColors } from "../../theme/antdTheme";

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

const StyledSider = styled(Sider)`
  min-height: 98vh;
  margin-left: 10px;
  border-radius: 20px;
  padding: 0 10px;
  overflow: auto;
  position: fixed;
  margin: 10px;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
`;

const LogoImage = styled.img`
  width: 100px;
`;

const CollapsedLogoImage = styled.img`
  width: 30px;
  margin: 10px;
`;

const StyledTitle = styled.h2`
  color: ${lightColors.secondary};
`;

const Sidebar = ({ collapsed }: SidebarProps) => {
  const navigate = useNavigate();

  const items: MenuItem[] = [
    getItem("Partidos", "2", <TableOutlined />, null, () =>
      navigate("partidos")
    ),
    getItem("Menu Usuarios", "sub2", <UserOutlined />, [
      getItem("Lista de usuarios", "3", null, null, () => navigate("usuarios")),
      getItem("Nuevo Usuario", "4", null, null, () =>
        navigate("usuarios/nuevo")
      ),
    ]),
    getItem("Deportes", "5", <PieChartOutlined />, null, () =>
      navigate("deportes")
    ),
  ];

  return (
    <StyledSider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={collapsed ? 80 : 200}
    >
      <LogoContainer>
        {collapsed ? (
          <CollapsedLogoImage src={logoColap} alt="logo" />
        ) : (
          <>
            <LogoImage src={logo} alt="logo" />
            <StyledTitle>Loyal Futbol 5</StyledTitle>
          </>
        )}
      </LogoContainer>

      <Menu defaultSelectedKeys={["1"]} mode="inline" items={items} />
    </StyledSider>
  );
};

export default Sidebar;
