import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Div } from "react-native-magnus";
import Svg, {
  Defs,
  Pattern,
  Polygon,
  Image as SvgImage,
} from "react-native-svg";
import { customTheme } from "../utils/theme";

const { width: windowWidth } = Dimensions.get("window");
const HEIGHT = 200;

const offsetLeft = 0;
const offsetRight = 10;

export default function TrianglesWithImages() {
  const handleFirstPress = () => {
    console.log("Primer triángulo presionado (arriba-izquierda)");
  };

  const handleSecondPress = () => {
    console.log("Segundo triángulo presionado (abajo-derecha)");
  };

  return (
    <Div
      style={[styles.container, { height: HEIGHT }]}
      p={customTheme.spacing.small}
    >
      <Svg width={windowWidth} height={HEIGHT} >
        <Defs >
          {/*  triángulo 1 (arriba-izquierda) */}
          <Pattern
            id="pattern1"
            patternUnits="userSpaceOnUse"
            width={windowWidth}
            height={HEIGHT}
          >
            <SvgImage
              href={require("../assets/triangulo1.jpg")}
              x="0"
              y="0"
              width={windowWidth}
              height={HEIGHT}
              preserveAspectRatio="xMidYMid slice"
            />
          </Pattern>

          {/* triángulo 2 (abajo-derecha) */}
          <Pattern
            id="pattern2"
            patternUnits="userSpaceOnUse"
            width={windowWidth}
            height={HEIGHT}
          >
            <SvgImage
              href={require("../assets/triangulo2.jpg")}
              x="0"
              y="0"
              width={windowWidth}
              height={HEIGHT}
              preserveAspectRatio="xMidYMid slice"
            />
          </Pattern>
        </Defs>

        {/* Triángulo 1 (arriba-izquierda): va de (0,0) a (0,HEIGHT) a (windowWidth,0) */}
        <Polygon
          points={`0,0 0,${HEIGHT} ${windowWidth},0`}
          fill="url(#pattern1)"
          onPress={handleFirstPress}
        />

        {/* Triángulo 2 (abajo-derecha): va de (0,HEIGHT) a (windowWidth,HEIGHT) a (windowWidth,0) */}
        <Polygon
          points={`10,${HEIGHT} ${windowWidth},${HEIGHT} ${windowWidth},6`}
          fill="url(#pattern2)"
          onPress={handleSecondPress}
        />
      </Svg>
    </Div>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
     backgroundColor: 'yellow', // para pruebas
  },
});
