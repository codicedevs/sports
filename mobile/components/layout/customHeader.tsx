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
import useFetch from "../../hooks/useGet";
import Petition from "../../types/petition.type";
import petitionService from "../../service/petition.service";
import { useSession } from "../../context/authProvider";
import { QUERY_KEYS } from "../../types/query.types";

export const CustomHeader = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentUser } = useSession();


  const currentRouteName = useNavigationState((state) => {
    const route = state.routes[state.index];

    if (route.name === "HomeStack" && !route.state) {
      return AppScreens.HOME_SCREEN;
    }

    let nestedRoute = route;
    while (nestedRoute.state && nestedRoute.state.index != null) {
      nestedRoute = nestedRoute.state.routes[nestedRoute.state.index];
    }

    return nestedRoute.name;
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

  const { data: petitions, refetch: refetchPetition } = useFetch<{
    results: Petition[];
  }>(
    () =>
      petitionService.getAll({
        populate: ["reference.id"],
        where: {
          status: ["pending"],
          receiver: [currentUser._id],
        },
      }),
    [QUERY_KEYS.PETITIONS]
  );  

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
            <Text fontSize={7}>{petitions?.results.length}</Text>
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
        <TouchableOpacity onPress={() => navigation.navigate(AppScreens.USER_SCREEN)}>
          <Image
            style={{ height: scale(30), width: scale(25) }}
            source={require("../../assets/match/bellInclinada.png")}
          />
          <Div
            position="absolute"
            right={isHomeScreen ? 0 : 2}
            top={isHomeScreen ? 4 : 6}
            rounded="circle"
            alignItems="center"
            justifyContent="center"
            bg={customTheme.colors.primary}
            px={scale(isHomeScreen ? 3 : 4)}
            py={isHomeScreen ? undefined : scale(1)}
          >
            <Text fontSize={7}>{petitions?.results.length}</Text>
          </Div>
        </TouchableOpacity>
        </Div>
      </Div>
    );
  }
};
