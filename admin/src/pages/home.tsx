import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="homePageBackground">
      <h1>Welcome to the Home Page!</h1>
      <Button
        onClick={() => {
          navigate("/login");
        }}
      >
        LOGIN
      </Button>
    </div>
  );
};

export default HomePage;
