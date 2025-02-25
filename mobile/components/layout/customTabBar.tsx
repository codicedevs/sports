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

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  const iconMap: Record<string, JSX.Element> = {
    HomeStack: <HomeIcon width={scale(30)} height={scale(30)} />,
    SettingsStack: <BellIcon width={scale(30)} height={scale(30)} />,
    SettingsStack1: <PlusIcon width={scale(30)} height={scale(30)} />,
    [AppScreens.MATCH_SCREEN]: <FieldIcon width={scale(30)} height={scale(30)} />,
    SettingsStack3: <ProfileIcon width={scale(30)} height={scale(30)} />
  };

  const screen = getFocusedRouteNameFromRoute(state.routes[state.index]);
  if (screen === AppScreens.MATCH_DETAIL) return null;

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
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        return (
          <Button
            key={route.key}
            bg={customTheme.colors.secondaryBackground}
            rounded="circle"
            p={customTheme.spacing.small}
            onPress={() => navigation.navigate(route.name)}
            alignSelf="center"
          >
            {React.cloneElement(iconMap[route.name] || <Icon name="circle" fontSize={24} />, {
              color: isFocused ? customTheme.colors.primary : "white",
            })}
          </Button>
        );
      })}
    </Div>
  );
};

export default CustomTabBar;
