import React from "react";
import { ImageBackground, ImageSourcePropType, StyleSheet } from "react-native";
import { Div, Icon, Text } from "react-native-magnus";
import { scale } from "react-native-size-matters";

interface SectionPhotoProps {
  backGroundImage: ImageSourcePropType; // Imagen de fondo como prop
}

const SectionPhoto: React.FC<SectionPhotoProps> = ({ backGroundImage }) => {
  return (
    <Div mt={scale(35)}>
      <ImageBackground
        source={backGroundImage}
        style={styles.imageBackground}
        resizeMode="cover"
        imageStyle={styles.roundedCorners}
      />
      <Div style={styles.divText}>
        <Text style={styles.titleText}>
          semi para el infarto! 3-2 ganan los pibes{" "}
        </Text>
        <Icon
          name="news"
          fontFamily="Entypo"
          fontSize={scale(23)}
          color="#535353"
        ></Icon>
      </Div>
      <Div>
        <Text style={styles.titleTextDown}>
          dic 10 2024 | complejo loyal | torneo mágico
        </Text>
      </Div>
    </Div>
  );
};

export default SectionPhoto;

const styles = StyleSheet.create({
  imageBackground: {
    width: scale(323),
    height: scale(180),
  },
  roundedCorners: {
    borderRadius: scale(13),
  },
  titleText: {
    fontFamily: "RobotoCondensed-Black",
    fontSize: scale(14.5),
    color: "#535353",
    textTransform: "uppercase",
  },
  titleTextDown: {
    fontFamily: "AcuminProCondensed",
    fontSize: scale(12.5),
    color: "#535353",
    textTransform: "uppercase",
    marginLeft: scale(4),
    marginTop: scale(-5),
  },
  divText: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: scale(4),
  },
});
