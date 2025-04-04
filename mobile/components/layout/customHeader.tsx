import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { Div, Text } from "react-native-magnus";
import { scale } from "react-native-size-matters";
import { customTheme } from "../../utils/theme";
import {
  useNavigation,
  useRoute,
  useNavigationState,
} from "@react-navigation/native";
import { AppScreens } from "../../navigation/screens";

export const CustomHeader = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const currentRouteName = useNavigationState((state) => {
    const activeRoute = state.routes[state.index];

    if (activeRoute.state && typeof activeRoute.state.index === "number") {
      const nestedActiveRoute =
        activeRoute.state.routes[activeRoute.state.index];
      console.log(nestedActiveRoute.name, "Pantalla dentro del Stack");
      return nestedActiveRoute.name;
    }

    return activeRoute.name;
  });

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
        alignItems="flex-start"
        p={customTheme.spacing.medium}
        justifyContent="space-between"
      >
        <Div flexDir="row" alignItems="flex-start" style={{ gap: scale(20) }}>
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
            bg={customTheme.colors.primary}
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
        bg="white"
      >
        <Div
          flexDir="row"
          alignItems="center"
          justifyContent="flex-start"
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
            style={{
              height: scale(28),
              width: scale(28),
              resizeMode: "contain",
            }}
            source={require("../../assets/logoDeball.png")}
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
