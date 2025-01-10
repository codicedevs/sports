import React, { useRef } from 'react';
import {
  Animated,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

// Obtiene las dimensiones de la pantalla
const { height: screenHeight } = Dimensions.get('window');

const Scrolldown = () => {
  const scrollY = useRef(new Animated.Value(0)).current; // Valor animado para el scroll

  // Altura dinámica de la imagen
  const imageHeight = scrollY.interpolate({
    inputRange: [0, screenHeight * 0.3],
    outputRange: [screenHeight * 0.15, screenHeight * 0.1],
    extrapolate: 'clamp',
  });

  // Simulación de blur
  const blurOpacity = scrollY.interpolate({
    inputRange: [0, screenHeight * 0.3],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Detectar cuando el título dentro del `textContainer` pasa
  const imageTitleOpacity = scrollY.interpolate({
    inputRange: [screenHeight * 0.15 - 50, screenHeight * 0.15],
    outputRange: [0, 1], // Se muestra el título en el bloque de imagen después del paso
    extrapolate: 'clamp',
  });

  // Movimiento vertical del título dentro del bloque de imagen
  const imageTitleTranslateY = scrollY.interpolate({
    inputRange: [screenHeight * 0.15 - 50, screenHeight * 0.15],
    outputRange: [screenHeight * 0.15 - screenHeight * 0.15, 0], // Comienza justo en el borde inferior del bloque de imagen
    extrapolate: 'clamp',
  });

  // Control de la visibilidad del título dentro del bloque de texto
  const textTitleOpacity = scrollY.interpolate({
    inputRange: [screenHeight * 0.15 - 50, screenHeight * 0.15],
    outputRange: [1, 0], // El título del texto desaparece mientras sube
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Contenedor de la imagen */}
      <Animated.View style={[styles.imageContainer, { height: imageHeight }]}>
        <Image
          source={{ uri: 'https://via.placeholder.com/400x300' }}
          style={styles.image}
        />
        {/* Capa de desenfoque */}
        <Animated.View
          style={[styles.blurOverlay, { opacity: blurOpacity }]}
        />
        {/* Título animado dentro del bloque de la imagen */}
        <Animated.Text
          style={[
            styles.imageTitle,
            {
              opacity: imageTitleOpacity,
              transform: [{ translateY: imageTitleTranslateY }],
            },
          ]}
        >
          TÍTULO
        </Animated.Text>
      </Animated.View>

      {/* Contenido desplazable */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Espacio para compensar la imagen */}
        <View style={{ height: screenHeight * 0.15 }} />

        {/* Contenedor de texto */}
        <View style={styles.textContainer}>
          <Animated.Text
            style={[styles.textTitle, { opacity: textTitleOpacity }]}
          >
            TÍTULO
          </Animated.Text>
          <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
            odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla
            quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent
            mauris. Fusce nec tellus sed augue semper porta. Mauris massa.
            Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad
            litora torquent per conubia nostra, per inceptos himenaeos. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
            odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla
            quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent
            mauris. Fusce nec tellus sed augue semper porta. Mauris massa.
            Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad
            litora torquent per conubia nostra, per inceptos himenaeos. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
            odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla
            quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent
            mauris. Fusce nec tellus sed augue semper porta. Mauris massa.
            Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad
            litora torquent per conubia nostra, per inceptos himenaeos.
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  imageContainer: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  scrollContainer: {
    paddingTop: 0,
  },
  textContainer: {
    padding: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  textTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  imageTitle: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    zIndex: 2,
  },
});

export default Scrolldown;
