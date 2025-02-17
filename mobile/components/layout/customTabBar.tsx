import React from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, Div, Button } from "react-native-magnus";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { AppScreens } from "../../navigation/screens";
import { customTheme } from "../../utils/theme";

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  const iconMap: Record<string, JSX.Element> = {
    HomeStack: <Icon fontFamily="Octicons" name="home" fontSize={customTheme.fontSize.xl} color="#aaa" />,
    SettingsStack: <Icon fontFamily="Feather" name="bell" fontSize={customTheme.fontSize.xl} color="#aaa" />,
    SettingsStack1: <Icon fontFamily="Feather" name="plus" fontSize={customTheme.fontSize.xl} color="#aaa" />,
    SettingsStack2: <Icon fontFamily="MaterialCommunityIcons" name="soccer-field" fontSize={customTheme.fontSize.xl} color="#aaa"   style={{ transform: [{ rotate: "90deg" }] }} />,
    SettingsStack3: <Icon fontFamily="Feather" name="user" fontSize={customTheme.fontSize.xl} color="#aaa" />,
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
