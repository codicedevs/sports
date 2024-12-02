import React from "react";
import { Div, Text } from "react-native-magnus";
import { ImageBackground } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";

const SquareCard = ({ backgroundimage, tittle, location, score }) => {
  return (
    <Div
      w={scale(100)} 
      h={verticalScale(120)} 
      rounded="2xl"
      overflow="hidden"
    >
      <ImageBackground
        source={backgroundimage}
        style={{ flex: 1, width: "100%", height: "100%" }}
        resizeMode="center"
      >
        {/* Gradiente superpuesto */}
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.8)", "transparent"]} // Degradado
          style={{ flex: 1, justifyContent: "space-between", padding: 10 }}
        >
          <Div alignItems="center">
            <Text fontWeight="bold" fontSize="md" color="white">
              {tittle}
            </Text>
          </Div>
          <Div alignItems="center">
            <Text fontWeight="bold" fontSize="sm" color="white">
              {score}
            </Text>
            <Text fontWeight="bold" fontSize="sm" color="white">
              {location}
            </Text>
          </Div>
        </LinearGradient>
      </ImageBackground>
    </Div>
  );
};

export default SquareCard;

