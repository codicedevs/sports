import React from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Div, Text } from "react-native-magnus";
import { scale } from "react-native-size-matters";
import { customTheme } from "../utils/theme";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  return (
    <Div style={{ flex: 1, padding: 8 }}>
      <Div
        bg="black"
        w={"100$"}
        h={scale(150)}
        mt={scale(100)}
        rounded={customTheme.borderRadius.small}
        p={customTheme.spacing.medium}
      >
        <Text
          color={customTheme.colors.secondary}
          fontSize={customTheme.fontSize.medium}
        >
          Ramiro te ha invitado a un partido
        </Text>
        <Div flexDir="row">
          <Div>
            <Text color="white" mr={customTheme.spacing.medium}>
              Futbol 5
            </Text>
          </Div>
          <Div>
            <Text color="white" mr={customTheme.spacing.medium}>
              Vi 25/01
            </Text>
          </Div>
          <Div>
            <Text color="white" mr={customTheme.spacing.medium}>
              19:00hs
            </Text>
          </Div>
        </Div>
      </Div>
    </Div>
  );
};

export default HomeScreen;
