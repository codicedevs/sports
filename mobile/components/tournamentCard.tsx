import React from "react";
import { Div, Text } from "react-native-magnus";
import { Image, ImageBackground } from "react-native";
import { scale } from "react-native-size-matters";
import { customTheme } from "../utils/theme";

interface TournamentCardProps {
  title: string;
  date: string;
  imageSource: any;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  title,
  date,
  imageSource,
}) => {
  return (
    <Div p={customTheme.spacing.small} mt={customTheme.spacing.medium} w="100%">
      <ImageBackground
        source={imageSource}
        resizeMode="cover"
        style={{
          aspectRatio: 358 / 201, // no tiene scale xq mantiene la relacion autom. (me lo dijo el chati)
          borderTopLeftRadius: customTheme.borderRadius.small,
          borderTopRightRadius: customTheme.borderRadius.small,
          overflow: "hidden",
          justifyContent: "space-between",
        }}
      >
        <Image
          source={require("../assets/CopaCardTorneo.png")}
          style={{ margin: scale(12), width: scale(34), height: scale(34) }}
        />

        <Div py={customTheme.spacing.small} px={customTheme.spacing.medium}>
          <Text
            color={customTheme.colors.secondary}
            fontSize={customTheme.fontSize.xxl}
            fontFamily="NotoSans-BoldItalic"
            style={{
              textShadowColor: customTheme.colors.secondary,
              textShadowOffset: { width: scale(1), height: scale(1) },
              textShadowRadius: scale (0.3),
              lineHeight: customTheme.fontSize.xxl * 1.1,
            }}
          >
            {title}
          </Text>
        </Div>
      </ImageBackground>

      <Div
        bg="black"
        w="100%"
        h={scale(40)}
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
        style={{
          borderBottomRightRadius: customTheme.borderRadius.small,
          borderBottomLeftRadius: customTheme.borderRadius.small,
        }}
      >
        <Div flexDir="row">
          <Text
            color="white"
            fontFamily="NotoSans-BoldItalic"
            fontSize={customTheme.fontSize.medium}
            ml={customTheme.fontSize.small}
            mr={customTheme.fontSize.small}
          >
            {date}
          </Text>
          <Text
            fontFamily="NotoSans-Italic"
            fontSize={customTheme.fontSize.medium}
            color="white"
          >
            Sumá a tu equipo!
          </Text>
        </Div>
        <Div mr={customTheme.fontSize.small}>
          <Image
            style={{ width: scale(22), height: scale(22), resizeMode: "contain" }}
            source={require("../assets/flechaCardTorneo.png")}
          />
        </Div>
      </Div>
    </Div>
  );
};

export default TournamentCard;
