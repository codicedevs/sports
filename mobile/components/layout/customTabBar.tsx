import React from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, Div, Button } from "react-native-magnus";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { AppScreens } from "../../navigation/screens";
import { customTheme } from "../../utils/theme";
import HomeIcon from "@assets/tabIcons/Icons/Home";
import BellIcon from "@assets/tabIcons/Icons/Bell";
import PlusIcon from "@assets/tabIcons/Icons/Plus";
import FieldIcon from "@assets/tabIcons/Icons/Field";
import ProfileIcon from "@assets/tabIcons/Icons/Profile";
import { scale } from "react-native-size-matters";
import { useSession } from "../../context/authProvider";

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { currentUser, showModal } = useSession();

  // Mapa de íconos
  const iconMap: Record<string, JSX.Element> = {
    HomeStack: <HomeIcon width={scale(20)} height={scale(20)} />,
    [AppScreens.PETITIONS_SCREEN]: <BellIcon width={scale(20)} height={scale(20)} />,
    [AppScreens.MATCH_HANDLER]: <PlusIcon width={scale(20)} height={scale(20)} />,
    [AppScreens.MATCH_SCREEN]: <FieldIcon width={scale(20)} height={scale(20)} />,
    [AppScreens.FRIEND_SCREEN]: <ProfileIcon width={scale(20)} height={scale(20)} />,
    [AppScreens.USER_SCREEN]: <ProfileIcon width={scale(20)} height={scale(20)} />, // o el que quieras
  };

  // 1. Determinar la ruta realmente activa (primer nivel o anidada)
  const focusedRoute = state.routes[state.index];
  const activeRouteName =
    getFocusedRouteNameFromRoute(focusedRoute) ?? focusedRoute.name;

  // 2. Pantallas donde ocultar la barra
  const hideOn = [
    AppScreens.MATCH_DETAIL,
    AppScreens.MATCH_HANDLER,
    AppScreens.FRIEND_SCREEN,
    AppScreens.USER_SCREEN,
  ];
  const shouldHideTabBar = hideOn.includes(activeRouteName as AppScreens);

  // Manejo de navegación con chequeo de login
  const checkIfLogged = (route) => {
    if (
      !currentUser &&
      (route.name === AppScreens.MATCH_HANDLER ||
       route.name === AppScreens.FRIEND_SCREEN)
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
      bg="rgb(54, 54, 54)"
      position="absolute"
      bottom={shouldHideTabBar ? -100 : insets.bottom + 10}
      opacity={shouldHideTabBar ? 0 : 1}
      pointerEvents={shouldHideTabBar ? "none" : "auto"}
      w="97%"
      rounded="circle"
      p={customTheme.spacing.small}
      alignSelf="center"
    >
      {state.routes
        // 3. Filtrar también la USER_SCREEN (y MATCH_DETAIL si está anidada)
        .filter(
          (route) =>
            ![AppScreens.MATCH_DETAIL, AppScreens.USER_SCREEN].includes(
              route.name
            )
        )
        .map((route, index) => {
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
                iconMap[route.name] ?? <Icon name="circle" fontSize={24} />,
                {
                  fill: isFocused
                    ? customTheme.colors.primary
                    : "white",
                }
              )}
            </Button>
          );
        })}
    </Div>
  );
};

export default CustomTabBar;
