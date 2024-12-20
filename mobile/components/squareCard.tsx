import React from "react";
import { StyleSheet, ImageBackground, ImageSourcePropType } from "react-native";
import { Div, Text } from "react-native-magnus";
import { scale, verticalScale } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import Location from "../types/location.type";

export interface SquareCardProps {
  title: string;
  location: Location;
  score: string;
  hour: string | number;
  backgroundimage: ImageSourcePropType;
}

const SquareCard: React.FC<SquareCardProps> = ({
  backgroundimage,
  title,
  location,
  score,
  hour,
}) => {
  return (
    <Div
      w={scale(86)}
      h={verticalScale(114)}
      rounded="2xl"
      overflow="hidden"
      mt={scale(10)}
    >
      <ImageBackground
        source={backgroundimage}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        {/* Contenedor del gradiente */}
        <LinearGradient
          colors={[
            "rgba(0, 0, 0, 0.8)", // arriba
            "rgba(0, 0, 0, 0.5)", // medio superior
            "rgba(0, 0, 0, 0.1)", // medio inf
            "rgba(0, 0, 0, 0.8)", // parte abajo
          ]}
          locations={[0.16, 0.23, 0.77, 0.84]} 
          style={styles.gradient}
        />

        {/* Contenido */}
        <Div style={styles.contentContainer}>
          {/* Título */}
          <Div alignItems="center">
            <Text style={styles.titleText}>{title}</Text>
          </Div>

          {/* Información inferior */}
          <Div alignItems="center">
            <Text style={styles.hourText}>{hour}</Text>
          </Div>
        </Div>
      </ImageBackground>
    </Div>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    padding: 8,
  },
  titleText: {
    fontFamily: "RobotoCondensed-Black",
    fontSize: scale(16),
    color: "white",
  },
  hourText: {
    fontFamily: "RobotoCondensed-Black",
    fontSize: scale(16),
    color: "white",
  },
});
export default SquareCard;
