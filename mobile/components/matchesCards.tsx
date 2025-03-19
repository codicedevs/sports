import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Div, Text } from "react-native-magnus";
import { scale } from "react-native-size-matters";
import { customTheme } from "../utils/theme";
import Location from "../types/location.type";
import { User } from "../types/user.type";
import { AppScreens, AppScreensParamList } from "../navigation/screens";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SportMode } from "../types/form.type";
import dayjs from "dayjs";

export function getDayName(dayNum?: number) {
  if (dayNum == null) return "";
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  return days[dayNum] || "";
}

export function formatMatchDate(date?: string, hour?: number) {
  if (!date) return "";
  const base = dayjs(date);
  if (hour != null) {
    return base.hour(hour).minute(0).format("ddd DD/MM HH:mm");
  }
  return base.format("ddd DD/MM HH:mm");
}

interface MatchCardProps {
  dayOfWeek?: number;
  date?: string;
  time?: number;
  location?: Location;
  players: User[];
  maxPlayers: number;
  sportMode: SportMode;
  matchId: string;
}

type HomeScreenNavigationProp = NativeStackNavigationProp<
  AppScreensParamList,
  AppScreens.HOME_SCREEN
>;

const MatchCard: React.FC<MatchCardProps> = ({
  dayOfWeek,
  date,
  time,
  location,
  players,
  maxPlayers,
  sportMode,
  matchId,
}) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // verificamos hora fecha etc
  const hasDateTime = !!date && time != null;
  const hasLocation = !!location?.name && location?.address != null;

  let dayName = "";
  let dateStr = "";
  if (hasDateTime) {
    dayName = getDayName(dayOfWeek);
    dateStr = formatMatchDate(date, time);
  }

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(AppScreens.MATCH_DETAIL, { id: matchId })
      }
    >
      <Div alignItems="center" p={customTheme.spacing.small}>
        <Div
          borderWidth={scale(1)}
          rounded={customTheme.borderRadius.medium}
          w="100%"
          h={scale(150)}
          flexDir="row"
        >
          {/* Cont amarilla */}
          <Div
            bg={customTheme.colors.primary}
            flex={2}
            justifyContent="center"
            rounded={customTheme.borderRadius.medium}
          >
            {hasDateTime ? (
              <Div
                alignItems="center"
                h="100%"
                p={customTheme.spacing.small}
                justifyContent="space-evenly"
              >
                {/* Nombre del día */}
                <Text
                  fontFamily="Notosans-Regular"
                  fontSize={customTheme.fontSize.medium}
                >
                  {dayName}
                </Text>
                {/* Día del mes */}
                <Text
                  textAlign="center"
                  fontFamily="NotoSans-ExtraBoldItalic"
                  fontSize={customTheme.fontSize.Fourxl}
                >
                  {dateStr.split(" ")[1]?.split("/")[0] || ""}
                </Text>
                {/* Resto de la fecha/hora */}
                <Div flexDir="row" alignItems="center">
                  <Image
                    source={require("../assets/iconTime.png")}
                    style={{
                      width: scale(15),
                      height: scale(15),
                      resizeMode: "contain",
                      tintColor: "black",
                      marginRight: scale(4),
                    }}
                  />
                  <Text
                    fontFamily="Notosans-Regular"
                    fontSize={customTheme.fontSize.medium}
                  >
                    {dateStr.slice(dateStr.indexOf(" ") + 1)}
                  </Text>
                </Div>
              </Div>
            ) : (
              // Si NO
              <Div alignItems="center" justifyContent="center" h="100%">
                <Text
                  textAlign="center"
                  fontFamily="NotoSans-ExtraBoldItalic"
                  fontSize={customTheme.fontSize.title}
                >
                  A DEFINIR
                </Text>
              </Div>
            )}
          </Div>

          {/* Cont blanco */}
          <View
            style={{
              flex: 3,
              borderStyle: "dashed",
              borderLeftWidth: scale(1.2),
              justifyContent: "space-between",
              padding: scale(10),
            }}
          >
            {hasLocation ? (
              <Div>
                <Text fontSize={customTheme.fontSize.title}>
                  {location?.name} {location?.address}
                </Text>
              </Div>
            ) : (
              <Text fontSize={customTheme.fontSize.title}>A Confirmar</Text>
            )}

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
                    {sportMode?.label}
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
                    {players?.length}/{maxPlayers}
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
    </TouchableOpacity>
  );
};

export default React.memo(MatchCard);
