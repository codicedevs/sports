import React from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Div, Text, Button } from "react-native-magnus";
import { scale } from "react-native-size-matters";
import { customTheme } from "../utils/theme";
import { Image } from "react-native";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  return (
    <Div style={{ flex: 1, padding: 8 }}>
      <Div
        bg="black"
        w={"100%"}
        h={scale(150)}
        mt={scale(100)}
        rounded={customTheme.borderRadius.small}
        p={customTheme.spacing.medium}
      >
        <Text
          color={customTheme.colors.secondary}
          fontSize={customTheme.fontSize.medium}
          fontFamily="NotoSans-Variable"
        >
          Ramiro te ha invitado a un partido
        </Text>
        <Div flexDir="row" alignItems="center" >
          <Div flexDir="row" alignItems="center">
            <Image source={require("../assets/IconPelota.png")} />
            <Text
              color="white"
              fontSize={customTheme.fontSize.medium}
              mr={customTheme.spacing.medium}
              ml={customTheme.spacing.small}
            >
              Futbol 5
            </Text>
          </Div>

          <Image source={require("../assets/iconTime.png")} />
          <Text
            color="white"
            mr={customTheme.spacing.small}
            ml={customTheme.spacing.small}
            fontSize={customTheme.fontSize.medium}
          >
            Vi 25/01
          </Text>

          <Div>
            <Text
              color="white"
              mr={customTheme.spacing.medium}
              fontSize={customTheme.fontSize.medium}
            >
              19:00hs
            </Text>
          </Div>
        </Div>
        <Div
          flexDir="row"
          style={{ gap: 20,  marginTop: 20 }}
        >
          <Button flex={1} bg="black" borderColor="white" borderWidth={1}>
            <Text
              color="white"
              fontFamily="NotoSans-BoldItalic"
              fontSize={customTheme.fontSize.medium}
            >
              Rechazar
            </Text>
          </Button>
          <Button flex={1} bg={customTheme.colors.secondary}>
            <Text
              fontFamily="NotoSans-BoldItalic"
              fontSize={customTheme.fontSize.medium}
            >
              Aceptar
            </Text>
          </Button>
        </Div>
      </Div>
    </Div>
  );
};

export default HomeScreen;
