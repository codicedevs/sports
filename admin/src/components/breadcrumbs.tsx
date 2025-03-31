import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const routeNameMap: Record<string, string> = {
    home: "Inicio",
    users: "Usuarios",
    edit: "Editar Usuario",
    newUser: "Nuevo Usuario",
    profile: "Perfil",
    settings: "Configuración",
    matches: "Partidos",
  };

  const breadcrumbItems = pathSnippets.map((segment, index, arr) => {
    const url = `/${arr.slice(0, index + 1).join("/")}`;
    const isLast = index === arr.length - 1;
    const alias = routeNameMap[segment] || segment;

    return (
      <Breadcrumb.Item key={url}>
        {isLast ? alias : <Link to={url}>{alias}</Link>}
      </Breadcrumb.Item>
    );
  });

  return <Breadcrumb style={{ fontSize: 18 }}>{breadcrumbItems}</Breadcrumb>;
};
