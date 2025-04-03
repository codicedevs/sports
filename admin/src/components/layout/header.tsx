import { MenuOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Input, Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import { Breadcrumbs } from "../breadcrumbs";
import { SetStateType } from "../../types/types";
import { authService } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { lightColors } from "../../theme/antdTheme";
import styled from "styled-components";

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: SetStateType<boolean>;
}

const StyledHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid gray;
  margin-bottom: 10px;
`;

const LeftContainer = styled.div`
  display: flex;
  gap: 15px;
`;

const RightContainer = styled.div`
  display: flex;
  gap: 15px;
`;

const StyledAvatar = styled(Avatar)`
  background-color: ${lightColors.primary};
  width: 30px;
  cursor: pointer;
`;

const StyledInput = styled(Input)`
  width: 200px;
`;

const HeaderAdmin = ({ collapsed, setCollapsed }: HeaderProps) => {
  const navigate = useNavigate();

  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: "Cerrar sesión",
          onClick: () => {
            authService.logout();
            navigate("/login");
            console.log("Cerrando sesión");
          },
        },
      ]}
    />
  );

  return (
    <StyledHeader>
      <LeftContainer>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setCollapsed(!collapsed)}
        />
        <Breadcrumbs />
      </LeftContainer>
      <RightContainer>
        <Dropdown overlay={menu} trigger={["click"]}>
          <StyledAvatar icon={<UserOutlined />} alt="Desloguearse" />
        </Dropdown>
        <StyledInput
          placeholder="Buscar..."
          suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
        />
      </RightContainer>
    </StyledHeader>
  );
};

export default HeaderAdmin;
