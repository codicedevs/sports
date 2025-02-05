import React from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Div, Text } from "react-native-magnus";
import { scale } from "react-native-size-matters";
import MatchInvitation from "../components/invitationCard";
import { Image } from "react-native";
import { customTheme } from "../utils/theme";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  return (
    <Div>
      <Div style={{ padding: 10, marginTop: 30 }}>
        <MatchInvitation
          title="Ramiro te ha invitado a un partido"
          matchType="Futbol 5"
          date="Vi 25/01"
          time="19:00hs"
        />
      </Div>
      {/* <Div
        style={{
          padding: 10,
          marginTop: 20,
          width: "100%",
        }}
      >
        <Image
          style={{ width: "100%" }}
          source={require("../assets/fotoCardTorneo.png")}
        />
        <Div bg="black" w="100%" h={scale(30)} flexDir="row" justifyContent="space-between" alignItems="center">
          <Div flexDir="row" alignItems="center">
            <Text
              color="white"
              fontFamily="NotoSans-BoldItalic"
              fontSize={customTheme.fontSize.medium}
            >
              21/02
            </Text>
            <Text color="white">Sumá a tu equipo!</Text>
          </Div>
          <Div>
            <Image source={require("../assets/flechaCardTorneo.png")}></Image>
          </Div>
        </Div>
      </Div> */}
    </Div>
  );
};

export default HomeScreen;
