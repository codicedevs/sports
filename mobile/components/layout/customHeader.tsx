import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { Div, Text } from "react-native-magnus";
import { scale } from "react-native-size-matters";
import { customTheme } from "../../utils/theme";
import {
  useNavigation,
  useRoute,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { AppScreens } from "../../navigation/screens";

export const CustomHeader = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const currentRouteName = getFocusedRouteNameFromRoute(route) ?? route.name;

  const isHomeScreen = currentRouteName === AppScreens.HOME_SCREEN;

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "HomeStack",
            state: { routes: [{ name: AppScreens.HOME_SCREEN }] },
          },
        ],
      });
    }
  };

  if (isHomeScreen) {
    return (
      <Div
        bg="white"
        flexDir="row"
        alignItems="center"
        p={customTheme.spacing.medium}
        justifyContent="space-between"
      >
        <Div flexDir="row" alignItems="center" style={{ gap: scale(20) }}>
          <TouchableOpacity onPress={handleBackPress}>
            <Image
              style={{
                height: scale(28),
                width: scale(28),
                
                resizeMode: "contain",
              }}
              source={require("../../assets/logoDeball.png")}
            />
          </TouchableOpacity>
        </Div>
        <Div position="relative">
          <Image
            style={{ height: scale(27), width: scale(22) }}
            source={require("../../assets/match/bellInclinada.png")}
          />
          <Div
            position="absolute"
            right={0}
            top={4}
            rounded={"circle"}
            alignItems="center"
            justifyContent="center"
            bg="orange"
            px={scale(3)}
          >
            <Text fontSize={7}>2</Text>
          </Div>
        </Div>
      </Div>
    );
  } else {
    return (
      <Div
        flexDir="row"
        alignItems="center"
        p={customTheme.spacing.medium}
        justifyContent="space-between"
      >
        <Div
          flexDir="row"
          alignItems="center"
          justifyContent="space-between"
          style={{ gap: scale(20) }}
          w="55%"
        >
          <TouchableOpacity onPress={handleBackPress}>
            <Image
              style={{
                height: scale(20),
                width: scale(15),
                padding: customTheme.spacing.small,
              }}
              source={require("../../assets/match/backIcon.png")}
            />
          </TouchableOpacity>
          <Image
            style={{ height: scale(35), width: scale(35) }}
            source={require("../../assets/match/logoF.png")}
          />
        </Div>
        <Div position="relative">
          <Image
            style={{ height: scale(27), width: scale(22) }}
            source={require("../../assets/match/bellInclinada.png")}
          />
          <Div
            position="absolute"
            right={0}
            top={4}
            rounded="circle"
            alignItems="center"
            justifyContent="center"
            bg="orange"
            px={scale(3)}
          >
            <Text fontSize={7}>2</Text>
          </Div>
        </Div>
      </Div>
    );
  }
};
