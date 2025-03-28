import React from "react";
import { Div, Image, Text } from "react-native-magnus";
import { scale, verticalScale } from "react-native-size-matters";
import { formatMatchDate } from "./matchesCards";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Location from "../../types/location.type";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { User } from "../../types/user.type";
import { SportMode } from "../../types/sport-mode";
import { AppScreens, AppScreensParamList } from "../../navigation/screens";
import { customTheme } from "../../utils/theme";


type UpcomingMatchProps = {
  date?: string;
  hour?: number;
  players: User[];
  maxPlayers: number;

  matchId: string;
  location?: Location;
  sportMode: SportMode;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  AppScreensParamList,
  AppScreens.HOME_SCREEN
>;

export default function UpcomingMatchCard({
  date,
  hour,
  players,
  maxPlayers,
  matchId,
  location,
  sportMode,
}: UpcomingMatchProps) {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const playerCount = players?.length || 0;
  const total = maxPlayers || 1;

  const getBgColor = (players: number, maxPlayers: number) => {
    const colorpercentage = players / maxPlayers;
    let bgColor = "#D9FA53";
    if (colorpercentage >= 0.5 && colorpercentage < 1) {
      bgColor = "#f78f5c";
    } else if (colorpercentage >= 1) {
      bgColor = "#f5696e";
    }
    return bgColor;
  };

  const bgColor = getBgColor(playerCount, total);

  let finalDateStr = "A DEFINIR"; // render condicional fecha
  if (date && hour != null) {
    const fecha = formatMatchDate(date, hour);
    finalDateStr = fecha || "A DEFINIR";
  }
  const hasLocation = !!location?.name && location?.address != null; // render condi location

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(AppScreens.MATCH_DETAIL, { id: matchId })
      }
    >
      <Div
        h={verticalScale(160)}
        w={scale(155)}
        rounded="md"
        borderWidth={1}
        borderColor="black"
        p={customTheme.spacing.medium}
        mr={15}
        justifyContent="space-between"
      >
        <Div flexDir="row" justifyContent="center" alignItems="center">
          <Image
            source={require("../../assets/iconTime.png")}
            h={customTheme.spacing.medium}
            w={scale(15)}
            mt={scale(2)}
            mr={customTheme.spacing.xs}
            resizeMode="contain"
            tintColor="black"
          />
          {/* si no hay fecha*/}
          {finalDateStr === "A DEFINIR" ? (
            <Div alignItems="center" justifyContent="center">
              <Text
                fontSize={customTheme.fontSize.medium}
                fontFamily="NotoSans-Variable"
              >
                A Confirmar
              </Text>
            </Div>
          ) : (
            <Text
              fontSize={customTheme.fontSize.small}
              fontFamily="NotoSans-Variable"
            >
              {/* si hay */}
              {finalDateStr}
            </Text>
          )}
        </Div>
        {hasLocation ? (
          <Text
            fontSize={customTheme.fontSize.large}
            fontFamily="NotoSans-BoldItalic"
          >
            {location?.name} - {sportMode?.label}
          </Text>
        ) : (
          <Div alignItems="center">
            <Text
              fontSize={customTheme.fontSize.large}
              fontFamily="NotoSans-BoldItalic"
            >
              POR DEFINIR
            </Text>
          </Div>
        )}

        <Div flexDir="row" justifyContent="space-between">
          {/* condicional bgColor */}
          <Div bg={bgColor} flexDir="row">
            <Image
              source={require("../../assets/iconUser.png")}
              bg={bgColor}
              resizeMode="contain"
              w={customTheme.fontSize.medium}
            />
            <Text
              ml={customTheme.spacing.small}
              fontSize={customTheme.fontSize.medium}
            >
              {playerCount}/{maxPlayers}
            </Text>
          </Div>

          <Image
            source={require("../../assets/iconNext.png")}
            resizeMode="contain"
            w={customTheme.fontSize.title}
          />
        </Div>
      </Div>
    </TouchableOpacity>
  );
}