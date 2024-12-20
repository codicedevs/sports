import React from "react";
import { ImageBackground, ImageSourcePropType, StyleSheet } from "react-native";
import { Text } from "react-native-animatable";
import { Div, Icon } from "react-native-magnus";

interface SectionPhotoProps {
  backGroundImage: ImageSourcePropType; // Imagen de fondo como prop
}

const SectionPhoto: React.FC<SectionPhotoProps> = ({ backGroundImage }) => {
  return (
    <Div mt={35}>
      <ImageBackground
        source={backGroundImage}
        style={styles.imageBackground}
        resizeMode="cover"
        imageStyle={styles.roundedCorners}
      />
      <Div
       style={styles.divText}
      >
        <Text style={styles.titleText}>
          semi para el infarto! 3-2 ganan los pibes{" "}
        </Text>
        <Icon
          name="news"
          fontFamily="Entypo"
          fontSize={23}
          color="#535353"
        ></Icon>
      </Div>
      <Div>
        <Text style={styles.titleTextDown}>dic 10 2024 | complejo loyal | torneo mágico</Text>
      </Div>
    </Div>
  );
};

export default SectionPhoto;

const styles = StyleSheet.create({
  imageBackground: {
    width: "100%",
    height: 200,
  },
  roundedCorners: {
    borderRadius: 15,
  },
  titleText: {
    fontFamily: "RobotoCondensed-Black",
    fontSize: 16.5,
    color: "#535353",
    textTransform: "uppercase",
  },
  titleTextDown: {
    fontFamily: "AcuminProCondensed",
    fontSize: 15,
    color: "#535353",
    textTransform: "uppercase",
    marginLeft: 6,
    marginTop: -5
  },
  divText: {
    flexDirection: "row",
    justifyContent: "space-around", 
    alignItems: "center", 
    marginTop: 5,
  }
});
