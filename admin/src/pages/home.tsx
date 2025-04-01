import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { FlexCenter } from "../styled/GlobalStyle";
import styled from "styled-components";

const StyledTitle = styled.h1`
  color: black;
  background-color: white;
  padding: 10px;
  border-radius: 20px;
`;

const StyledDiv = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: black;
  z-index: 1000;
  opacity: 0.5;
`;

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <FlexCenter
      className="homePageBackground"
      style={{
        height: "100vh",
      }}
    >
      <StyledDiv />
      <FlexCenter
        direction="column"
        style={{
          zIndex: 2000,
        }}
      >
        <StyledTitle>Bienvenidxs a MatchUp!</StyledTitle>
        <Button
          style={{ width: 80 }}
          onClick={() => {
            navigate("/login");
          }}
        >
          LOGIN
        </Button>
      </FlexCenter>
    </FlexCenter>
  );
};

export default HomePage;
