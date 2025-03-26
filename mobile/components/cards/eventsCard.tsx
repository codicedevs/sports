import React from "react";
import { Div, Text } from "react-native-magnus";
import { Image, ImageBackground } from "react-native";
import { scale } from "react-native-size-matters";
import { customTheme } from "../../utils/theme";

interface eventsCardProps {
  name: string;
  date: string;
}

const EventsCard: React.FC<eventsCardProps> = ({ name, date }) => {
  return (
    <Div>
      <ImageBackground
        source={require("../../assets/fotoCardTorneo.png")}
        resizeMode="cover"
        style={{
          width: "100%",
          minHeight: 120,
          aspectRatio: 358 / 201,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          overflow: "hidden",
          justifyContent: "space-between",
        }}
      >
        <Image
          source={require("../../assets/CopaCardTorneo.png")}
          style={{ margin: 15, width: 40, height: 40 }}
        />

        <Div py={customTheme.spacing.small} px={customTheme.spacing.medium}>
          <Text
            color={customTheme.colors.primary}
            fontSize={customTheme.fontSize.xl}
            fontFamily="NotoSans-BoldItalic"
            style={{
              textShadowColor: customTheme.colors.primary,
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 0.3,
              lineHeight: customTheme.fontSize.xxl * 1.1,
            }}
          >
            {name}
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
        style={{ borderBottomRightRadius: 4, borderBottomLeftRadius: 4 }}
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
            style={{ width: 25, height: 25, resizeMode: "contain" }}
            source={require("../../assets/flechaCardTorneo.png")}
          />
        </Div>
      </Div>
    </Div>
  );
};

export default EventsCard;