import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      style={{
        width: "200px",
        height: "100%", // Toma toda la altura del contenedor padre
        background: "#001529",
        color: "white",
      }}
    >
      <ul style={{ listStyleType: "none", padding: "20px 0" }}>
        <li>
          <Link
            to=""
            style={{
              color: "white",
              textDecoration: "none",
              display: "block",
              padding: "10px 20px",
            }}
          >
            Dashboard General
          </Link>
        </li>
        <li>
          <Link
            to="partidos"
            style={{
              color: "white",
              textDecoration: "none",
              display: "block",
              padding: "10px 20px",
            }}
          >
            Partidos
          </Link>
        </li>
        <li>
          <Link
            to="profile"
            style={{
              color: "white",
              textDecoration: "none",
              display: "block",
              padding: "10px 20px",
            }}
          >
            Usuarios
          </Link>
        </li>
      </ul>
    </div>
  );
}
