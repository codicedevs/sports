import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground } from "react-native";
import { Div, Text } from "react-native-magnus";
import { scale, verticalScale } from "react-native-size-matters";
import styled from "styled-components/native";

const StyledImageBackground = styled(ImageBackground)`
  flex: 2.1;
  justify-content: center;
  align-items: center;
  border-top-left-radius: ${(props) => props.theme.borderRadius.medium}px;
  border-bottom-left-radius: ${(props) => props.theme.borderRadius.medium}px;
`;

const StyledLinearGradientLeft = styled(LinearGradient)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-top-left-radius: ${(props) => props.theme.borderRadius.medium}px;
  border-bottom-left-radius: ${(props) => props.theme.borderRadius.medium}px;
`;

const BlackOverlay = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6); /* Negro semitransparente */
  border-top-left-radius: ${(props) => props.theme.borderRadius.medium}px;
  border-bottom-left-radius: ${(props) => props.theme.borderRadius.medium}px;
`;

const StyledLinearGradientRight = styled(LinearGradient)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
`;

const RightImageBackground = styled(ImageBackground)`
  position: absolute;
  top: 0;
  right: -30%;
  width: 100%;
  height: 100%;
  opacity: 0.2;
`;

const MatchCard = () => {
  return (
    <Div
      h={verticalScale(125)}
      w={scale(315)}
      flexDir="row"
      rounded="2xl"
      bg="grey"
      shadow="2xl"
      shadowColor="grey"
      overflow="hidden"
      mt={scale(15)}
    >
    
      {/* Parte izquierda */}
      <StyledImageBackground source={require("../../assets/texturaCard.png")}>
        <StyledLinearGradientLeft
          colors={["rgba(124, 9, 247, 0.36)", "rgba(122, 0, 252, 0.39)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          
        />
        <BlackOverlay />
        <Text
          fontSize={scale(30)}
          color="white"
          fontFamily="RobotoCondensed-Bold"
        >
          2
        </Text>
        <Text fontSize={scale(11)} color="white" fontFamily="RobotoCondensed-Regular">
          MONDAY
        </Text>
        <Text fontSize={scale(11)} color="white" fontFamily="RobotoCondensed-Regular">
          10:00 PM
        </Text>
      </StyledImageBackground>

      {/* Parte derecha */}
      <Div flex={7} justifyContent="space-between">
        <StyledLinearGradientRight
          colors={[
            "rgba(20, 20, 20, 0.59)", // Gris oscuro arriba
            "rgba(83, 80, 80, 0.5)", // Gris centro
            "rgba(20, 20, 20, 0.57)",
          ]}
          locations={[0.2, 0.5, 0.8]} // Controla dónde se aplican los colores
          start={{ x: 0, y: 0 }} // Inicia el gradiente desde la parte superior
          end={{ x: 0, y: 1 }} // Termina el gradiente hacia la parte inferior
        />
        <Div style={{ flex: 1, position: "relative" }}>
          <RightImageBackground
            source={require("../../assets/escudocentral.png")}
          />
          <Div
            style={{
              flex: 1,
              zIndex: 1,
              justifyContent: "space-between",
            }}
            p="lg"
          >
            <Div mt={scale(8)}>
              <Text
                fontSize={scale(22)}
                color="white"
                fontFamily="RobotoCondensed-Bold"
                textTransform="uppercase"
              >
               El caño fútbol 5
              </Text>
            </Div>

            
          </Div>
        </Div>

        <Div bg="black" p="lg">
          <Text
            color="white"
            fontFamily="RobotoCondensed-Regular"
            textTransform="uppercase"
            fontSize={scale(9)}
          >
            Abasto Fútbol 5
          </Text>
        </Div>
      </Div>
    </Div>
  );
};

export default MatchCard;