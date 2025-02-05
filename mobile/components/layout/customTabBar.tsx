import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "react-native-magnus";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { AppScreens } from "../../navigation/screens";

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  const iconMap: Record<string, JSX.Element> = {
    HomeStack: <Icon fontFamily="Ionicons" name="football" fontSize={24} color="#aaa" />,
    SettingsStack: <Icon fontFamily="Feather" name="bell" fontSize={24} color="#aaa" />,
    SettingsStack1: <Icon fontFamily="Feather" name="plus" fontSize={24} color="#aaa" />,
    SettingsStack2: <Icon fontFamily="MaterialCommunityIcons" name="soccer-field" fontSize={24} color="#aaa" />,
  };
  const screen = getFocusedRouteNameFromRoute(state.routes[state.index]);
  if (screen === AppScreens.MATCH_DETAIL) return null;
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? String(options.tabBarLabel) : route.name;

        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabButton}
          >
            {/* Ícono */}
            <View style={styles.iconContainer}>
              {React.cloneElement(iconMap[route.name] || <Icon name="circle" fontSize={24} />, {
                color: isFocused ? "#fff" : "#aaa",
              })}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "grey",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    width: "90%",
    borderRadius: 20,
  },
  tabButton: {
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
    backgroundColor: "lightgrey",
    borderRadius: 22,
    margin: 10
  },
  tabText: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 4,
  },
  activeTab: {
    color: "#fff",
    fontWeight: "bold",
  },
  iconContainer: {
    alignItems: "center",
  },
});

export default CustomTabBar;
