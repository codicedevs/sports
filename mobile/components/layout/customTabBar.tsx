import React from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, Div, Button } from "react-native-magnus";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { AppScreens } from "../../navigation/screens";
import { customTheme } from "../../utils/theme";
import HomeIcon from "@assets/tabIcons/Icons/Home";
import { scale } from "react-native-size-matters";
import BellIcon from "@assets/tabIcons/Icons/Bell";
import PlusIcon from "@assets/tabIcons/Icons/Plus";
import FieldIcon from "@assets/tabIcons/Icons/Field";
import ProfileIcon from "@assets/tabIcons/Icons/Profile";
import { useSession } from "../../context/authProvider";

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { currentUser, showModal } = useSession();

  const iconMap: Record<string, JSX.Element> = {
    HomeStack: <HomeIcon width={scale(20)} height={scale(20)} />,
    [AppScreens.PETITIONS_SCREEN]: (
      <BellIcon width={scale(20)} height={scale(20)} />
    ),
    [AppScreens.MATCH_HANDLER]: (
      <PlusIcon width={scale(20)} height={scale(20)} />
    ),
    [AppScreens.MATCH_SCREEN]: (
      <FieldIcon width={scale(20)} height={scale(20)} />
    ),
    [AppScreens.USER_SCREEN] : (<ProfileIcon width={scale(20)} height={scale(20)} />),
  };

  const screen = getFocusedRouteNameFromRoute(state.routes[state.index]);
  const shouldHideTabBar =
  screen === AppScreens.MATCH_DETAIL ||
  state.routes[state.index].name === AppScreens.MATCH_HANDLER;

  const checkIfLogged = (route) => {
    if (
      !currentUser &&
      route.name === AppScreens.MATCH_HANDLER
    ) {
      showModal();
      return;
    } else if (
      !currentUser &&
      route.name === AppScreens.USER_SCREEN
    ) {
      showModal();
      return;
    }
    navigation.navigate(route.name);
  };
  return (
    <Div
    flexDir="row"
    justifyContent="space-between"
    bg={"rgb(54, 54, 54)"}
    position="absolute"
    bottom={shouldHideTabBar ? -100 : 10} // 👈 escondélo fuera de la pantalla
    opacity={shouldHideTabBar ? 0 : 1}    // 👈 y opcionalmente lo hacés invisible
    pointerEvents={shouldHideTabBar ? "none" : "auto"} // 👈 para que no reciba eventos
    w="97%"
    rounded="circle"
    p={customTheme.spacing.small}
    alignSelf="center"
  >
      {state.routes
        .filter((route) => route.name !== AppScreens.MATCH_DETAIL)
        .map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          return (
            <Button
              key={route.key}
              bg={customTheme.colors.secondaryBackground}
              rounded="circle"
              p={scale(13)}
              onPress={() => checkIfLogged(route)}
              alignSelf="center"
            >
              {React.cloneElement(
                iconMap[route.name] || <Icon name="circle" fontSize={24} />,
                {
                  fill: isFocused ? customTheme.colors.primary : "white",
                }
              )}
            </Button>
          );
        })}
    </Div>
  );
};

export default CustomTabBar;
