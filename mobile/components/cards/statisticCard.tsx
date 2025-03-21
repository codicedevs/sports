import React from "react";
import { ImageBackground, StyleSheet, ViewStyle } from "react-native";
import { Div, Text } from "react-native-magnus";
import { scale } from "react-native-size-matters";

interface StatisticCardProps {
  style?: ViewStyle;
}

const StatisticCard: React.FC<StatisticCardProps> = ({ style }) => {
  return (
    <Div
      w="100%"
      h={scale(110)}
      rounded="xl"
      overflow="hidden"
      mb={scale(10)}
      style={style}
    >
      <Div flex={8.5} bg="#5D3C81" roundedTop="2xl" justifyContent="center">
        <Text
          fontSize="6xl"
          fontFamily="AcuminProCondensed"
          fontWeight="bold"
          color="#FFFFFF"
          mx={scale(10)}
        >
          TORNEO
        </Text>
        <Text
          fontSize="6xl"
          fontFamily="AcuminProCondensed"
          fontWeight="bold"
          color="#FFFFFF"
          mb={scale(8)}
          mx={scale(10)}
        >
          VETERANOS
        </Text>

        {/* Imagen Copa */}
        <ImageBackground
          source={require("../assets/cup1.png")}
          style={styles.imageBackground}
          resizeMode="contain"
        />
      </Div>

      {/* Parte inferior */}
      <Div
        w="100%"
        h={scale(35)}
        bg="#05F3FF"
        flex={2.3}
        roundedBottom="2xl"
        justifyContent="center"
        px={scale(18)}
      >
        <Text fontFamily="RobotoCondensed-Black" color="#5D3C81" fontSize="lg">
          ARRANCA 05/01
        </Text>
      </Div>
    </Div>
  );
};

export default StatisticCard;

const styles = StyleSheet.create({
  imageBackground: {
    position: "absolute",
    right: scale(0),
    top: "20%",
    width: scale(70),
    height: scale(76),
    paddingLeft: "29%",
  },
});
