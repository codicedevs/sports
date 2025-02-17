import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const breadcrumbItems = pathSnippets.map((_, index, arr) => {
    const url = `/${arr.slice(0, index + 1).join("/")}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{decodeURIComponent(arr[index])}</Link>
      </Breadcrumb.Item>
    );
  });

  return <Breadcrumb style={{ fontSize: 18 }}>{breadcrumbItems}</Breadcrumb>;
};
