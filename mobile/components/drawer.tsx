import React from "react";
import { Div, Text, Icon } from "react-native-magnus";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { TouchableOpacity } from "react-native";
import { customTheme } from "../utils/theme";
import Header from "./header";
import { AppScreens } from "../navigation/screens";
import { scale } from "react-native-size-matters";
import { iconFontFamilyType } from "react-native-magnus/lib/typescript/src/ui/icon/icon.type";
import authService from "../service/auth.service";
import { useSession } from "../context/authProvider";

interface NavItem {
  label: string;
  icon: string;
  iconFamily: iconFontFamilyType;
  screenName: string;
}

const itemsDrawer: NavItem[] = [
  {
    label: " Mis partidos",
    icon: "sports-soccer",
    iconFamily: "MaterialIcons",
    screenName: AppScreens.MY_MATCHES,
  },
  {
    label: "Sumarse a partido",
    icon: "sports-soccer",
    iconFamily: "MaterialIcons",
    screenName: AppScreens.ALL_MATCHES,
  },
  {
    label: "Mis Solicitudes",
    icon: "mail",
    iconFamily: "AntDesign",
    screenName: AppScreens.PETITIONS_SCREEN,
  },
  {
    label: "Mis Invitaciones",
    icon: "mail",
    iconFamily: "AntDesign",
    screenName: AppScreens.PETITIONS_SCREEN,
  },
  {
    label: "Crear Partido",
    icon: "pluscircleo",
    iconFamily: "AntDesign",
    screenName: AppScreens.CREATE_MATCH,
  },
];

const CustomDrawer: React.FC<DrawerContentComponentProps> = (props) => {
  const { navigation } = props;
  const { setCurrentUser } = useSession();

  // Función para manejar el logout
  const handleLogout = async () => {
    try {
      await authService.signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Div
      p="lg"
      bg={customTheme.colors.primary}
      flex={1}
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <Header />
      <Div mt={scale(100)} ml={scale(15)}>
        <Div>
          {itemsDrawer.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                navigation.navigate(item.screenName); // Navega directamente a la pantalla o stack
              }}
            >
              <Div flexDir="row" mb="xl">
                <Icon
                  name={item.icon}
                  fontFamily={item.iconFamily}
                  fontSize="lg"
                  color={customTheme.colors.tertiary}
                  mr="md"
                />
                <Text
                  fontSize={customTheme.fontSize.medium}
                  color={customTheme.colors.background}
                >
                  {item.label}
                </Text>
              </Div>
            </TouchableOpacity>
          ))}
        </Div>
      </Div>

      {/* Botón de Logout */}
      <TouchableOpacity onPress={handleLogout}>
        <Div flexDir="row" mb="xl" p="lg">
          <Icon
            name="logout"
            fontSize="lg"
            fontFamily="MaterialIcons"
            color={customTheme.colors.tertiary}
            mr="md"
          />
          <Text
            fontSize={customTheme.fontSize.medium}
            color={customTheme.colors.background}
          >
            Logout
          </Text>
        </Div>
      </TouchableOpacity>
    </Div>
  );
};

export default CustomDrawer;
