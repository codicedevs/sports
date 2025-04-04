import styled from "styled-components";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { StyledFlexCenter } from "../styled/globalStyled";

const StyledBackgroundOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: black;
  z-index: 1000;
  opacity: 0.5;
`;

const StyledTitle = styled.h1`
  color: black;
  background-color: white;
  padding: 10px;
  border-radius: 20px;
`;

const StyledButton = styled(Button)`
  width: 80px;
`;

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <StyledFlexCenter
      className="homePageBackground"
      style={{
        height: "100vh",
      }}
      direction="column"
    >
      <StyledBackgroundOverlay />
      <StyledFlexCenter
        style={{
          zIndex: 2000,
        }}
        direction="column"
      >
        <StyledTitle>Bienvenidxs a MatchUp!</StyledTitle>
        <StyledButton onClick={() => navigate("/login")}>LOGIN</StyledButton>
      </StyledFlexCenter>
    </StyledFlexCenter>
  );
};

export default HomePage;
