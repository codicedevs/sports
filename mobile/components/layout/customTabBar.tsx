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

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

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
    SettingsStack3: <ProfileIcon width={scale(20)} height={scale(20)} />,
  };

  const screen = getFocusedRouteNameFromRoute(state.routes[state.index]);
  if (screen === AppScreens.MATCH_DETAIL) return null;
  if (state.routes[state.index].name === AppScreens.MATCH_HANDLER) return null;

  return (
    <Div
      flexDir="row"
      justifyContent="space-between"
      bg={"rgb(54, 54, 54)"}
      position="absolute"
      bottom={10}
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
              onPress={() => navigation.navigate(route.name)}
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
