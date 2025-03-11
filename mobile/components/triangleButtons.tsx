import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, Pattern, Polygon, Image as SvgImage } from 'react-native-svg';

const { width: windowWidth } = Dimensions.get('window');
const HEIGHT = 200;

export default function TrianglesWithImages() {
  const handleFirstPress = () => {
    console.log('Primer triángulo presionado (arriba-izquierda)');
  };

  const handleSecondPress = () => {
    console.log('Segundo triángulo presionado (abajo-derecha)');
  };

  return (
    <View style={[styles.container, { height: HEIGHT }]}>
      <Svg width={windowWidth} height={HEIGHT}>
        {/* Definimos patrones para cada imagen */}
        <Defs>
          {/* Patrón para el triángulo 1 (arriba-izquierda) */}
          <Pattern
            id="pattern1"
            patternUnits="userSpaceOnUse"
            width={windowWidth}
            height={HEIGHT}
          >
            <SvgImage
              // Si es remota:
              // Si es local, usar: href={require('path/to/local-image.png')}
              x="0"
              y="0"
              width={windowWidth}
              height={HEIGHT}
              preserveAspectRatio="xMidYMid slice"
            />
          </Pattern>

          {/* Patrón para el triángulo 2 (abajo-derecha) */}
          <Pattern
            id="pattern2"
            patternUnits="userSpaceOnUse"
            width={windowWidth}
            height={HEIGHT}
          >
            <SvgImage
              href={{ uri: 'https://via.placeholder.com/600x400/0000ff/ffffff?text=Imagen+2' }}
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
          points={`0,${HEIGHT} ${windowWidth},${HEIGHT} ${windowWidth},0`}
          fill="url(#pattern2)"
          onPress={handleSecondPress}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // backgroundColor: 'yellow', // para pruebas
  },
});
