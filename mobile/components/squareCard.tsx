import React from "react";
import { Div, Text } from "react-native-magnus";
import { ImageBackground, ImageSourcePropType } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import Location from "../types/location.type";

export interface SquareCardProps {
  title: string;
  location: Location;
  score: string;
  backgroundimage: ImageSourcePropType;
}

const SquareCard: React.FC<SquareCardProps> = ({
  backgroundimage,
  title,
  location,
  score,
}) => {
  return (
    <Div w={scale(100)} h={verticalScale(100)} rounded="2xl" overflow="hidden">
      <ImageBackground
        source={backgroundimage}
        style={{ flex: 1, width: "100%", height: "100%" }}
        resizeMode="center"
      >
        {/* Contenedor de gradientes superpuestos */}
        <Div
          style={{
            flex: 1,
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Degradado superior */}
          <LinearGradient
            colors={[
              "rgba(0, 0, 0, 0.6)", // Oscuro en la parte superior
              "rgba(0, 0, 0, 0)", // Transparente en el centro
            ]}
            style={{
              position: "absolute",
              width: "100%",
              height: "45%", // Cubre la mitad superior
              top: 0, // Posición en la parte superior
            }}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />

          {/* Degradado inferior */}
          <LinearGradient
            colors={[
              "rgba(0, 0, 0, 0)", // Transparente en el centro
              "rgba(0, 0, 0, 0.6)", // Oscuro en la parte inferior
            ]}
            style={{
              position: "absolute",
              width: "100%",
              height: "45%", // Cubre la mitad inferior
              bottom: 0, // Posición en la parte inferior
            }}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </Div>

        {/* Contenido superpuesto */}
        <Div style={{ flex: 1, justifyContent: "space-between", padding: 10 }}>
          <Div alignItems="center">
            <Text fontWeight="bold" fontSize="md" color="white">
              {title}
            </Text>
          </Div>
          <Div alignItems="center">
            <Text fontWeight="bold" fontSize="sm" color="white">
              {score}
            </Text>
            <Text fontWeight="bold" fontSize="sm" color="white">
              {location.name}, {location.address}
            </Text>
          </Div>
        </Div>
      </ImageBackground>
    </Div>
  );
};

export default SquareCard;
