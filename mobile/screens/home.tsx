import React, { useState } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div, Text } from "react-native-magnus";
import { scale } from "react-native-size-matters";
import MatchInvitation from "../components/invitationCard";
import { Image, Modal, ScrollView, View } from "react-native";
import { customTheme } from "../utils/theme";
import ModalAnimation from "../components/cards/animatedCard";
import MatchCard from "../components/cards/matchCard";
import Index from "../components/matche";
import MatchModalHandler from "../components/modal/matchModalHandler";
import SectionPhoto from "../components/SectionPhoto";
import SquareCard from "../components/squareCard";
import StatisticCard from "../components/statisticCard";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const [open,setOpen] = useState(true)
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

    <MatchModalHandler open={open} setOpen={setOpen} />
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
