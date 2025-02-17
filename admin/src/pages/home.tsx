import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { lightColors } from "../utils/colors";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div
      className="homePageBackground"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "black",
          zIndex: 1000,
          opacity: "0.5 ",
        }}
      />
      <div
        style={{
          zIndex: 2000,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            color: "white",
            backgroundColor: lightColors.primary,
            padding: 10,
            borderRadius: 20,
          }}
        >
          Bienvenidxs a MatchUp!
        </h1>
        <Button
          style={{ width: 80 }}
          onClick={() => {
            navigate("/login");
          }}
        >
          LOGIN
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
