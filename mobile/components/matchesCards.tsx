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
import dayjs from "dayjs";
import { AuthContext } from "../context/authProvider";
import { SportMode } from "../types/form.type";

interface MatchCardProps {
  dayOfWeek?: number; // 0..6 => "Domingo".."Sábado"
  date?: string; // "2026-07-15T17:48:00.000Z"
  time?: number; // 22 => "22"
  location?: Location;
  players?: User[];
  maxPlayers?: number;
  sportMode: SportMode;
  matchId: string;
}

type HomeScreenNavigationProp = NativeStackNavigationProp<
  AppScreensParamList,
  AppScreens.HOME_SCREEN
>;

function getDayName(dayNum?: number) {
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

  let dayName = "";
  let dayOfMonth = "";
  let hourText = "";

  if (dayOfWeek != null) {
    dayName = getDayName(dayOfWeek);
  }
  if (date) {
    const base = dayjs(date);
    dayOfMonth = base.date().toString();
    if (time != null) {
      const withHour = base.hour(time).minute(0);
      hourText = withHour.format("HH:mm") + " hs";
    }
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
          <Div
            bg={customTheme.colors.primary}
            flex={2}
            justifyContent="center"
            rounded={customTheme.borderRadius.medium}
          >
            <Div
              alignItems="center"
              h="100%"
              p={customTheme.spacing.small}
              justifyContent="space-evenly"
            >
              <Text
                fontFamily="Notosans-Regular"
                fontSize={customTheme.fontSize.medium}
              >
                {dayName}
              </Text>
              <Text
                textAlign="center"
                fontFamily="NotoSans-ExtraBoldItalic"
                fontSize={customTheme.fontSize.Fourxl}
              >
                {dayOfMonth}
              </Text>
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
                  {hourText}
                </Text>
              </Div>
            </Div>
          </Div>
          <View
            style={{
              flex: 3,
              borderStyle: "dashed",
              borderLeftWidth: scale(1.2),
              justifyContent: "space-between",
              padding: scale(10),
            }}
          >
            <Div>
              <Text fontSize={customTheme.fontSize.title}>
                {location?.name} - {location?.address}
              </Text>
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

export default MatchCard;
