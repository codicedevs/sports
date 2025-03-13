import React from "react";
import { View, Image } from "react-native";
import { Div, Text } from "react-native-magnus";
import { scale } from "react-native-size-matters";
import { customTheme } from "../utils/theme";

interface MatchCardProps {
  day: string;
  date: string;
  time: string;
  location: string;
  players: number;
  maxPlayers: number;
}

const MatchCard: React.FC<MatchCardProps> = ({
  day,
  date,
  time,
  location,
  players,
  maxPlayers,
}) => {
  return (
    <Div alignItems="center" mt={scale(15)}>
      {/* Cont Gral */}
      <Div
        borderWidth={scale(1)}
        rounded={customTheme.borderRadius.medium}
        w={"100%"}
        h={scale(150)}
        flexDir="row"
      >
        {/* Cont amarillo  */}
        <Div
          bg={customTheme.colors.primary}
          flex={2}
          justifyContent="center"
          rounded={customTheme.borderRadius.medium}
        >
          <Div justifyContent="space-evenly" alignItems="center">
            <Text
              fontFamily="Notosans-Regular"
              fontSize={customTheme.fontSize.medium}
            >
              {day}
            </Text>
            <Text
              textAlign="center"
              fontFamily="NotoSans-ExtraBoldItalic"
              fontSize={customTheme.fontSize.Fourxl}
            >
              {date}
            </Text>
            <Div flexDir="row" alignItems="center">
              <Image
                source={require("../assets/iconTime.png")}
                style={{
                  width: scale(15),
                  height: scale(15),
                  resizeMode: "contain",
                  tintColor: "black",
                }}
              />
              <Text
                fontFamily="Notosans-Regular"
                fontSize={customTheme.fontSize.medium}
                ml={customTheme.spacing.small}
              >
                {time}
              </Text>
            </Div>
          </Div>
        </Div>

        {/* Contenedor blanco */}
        <View
          style={{
            flex: 3,
            borderStyle: "dashed",
            borderLeftWidth: scale(1.2),
            justifyContent:"space-between",
            padding: scale(10),
          }}
        >
          <Div>
            <Text fontSize={customTheme.fontSize.title}>{location}</Text>
          </Div>
          <Div w="100%" justifyContent="flex-end">
            <Div
              flexDir="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Div flexDir="row">
                <Image
                  source={require("../assets/IconPelota.png")}
                  style={{
                    width: scale(18),
                    height: scale(18),
                    resizeMode: "contain",
                    tintColor: "black",
                  }}
                />
                <Text
                  fontFamily="Notosans-Regular"
                  fontSize={customTheme.fontSize.medium}
                  ml={scale(3)}
                  mr={customTheme.spacing.medium}
                >
                  {players}
                </Text>
                <Image
                  source={require("../assets/iconUser.png")}
                  style={{
                    width: scale(17),
                    height: scale(17),
                    resizeMode: "contain",
                    tintColor: "black",
                  }}
                />
                <Text
                  fontFamily="Notosans-Regular"
                  fontSize={customTheme.fontSize.medium}
                  ml={scale(3)}
                >
                  {players}/{maxPlayers}
                </Text>
              </Div>
              <Div>
                <Image
                  source={require("../assets/iconNext.png")}
                  style={{
                    width: scale(18),
                    height: scale(18),
                    resizeMode: "contain",
                    tintColor: "black",
                  }}
                />
              </Div>
            </Div>
          </Div>
        </View>
      </Div>
    </Div>
  );
};

export default React.memo(MatchCard);
