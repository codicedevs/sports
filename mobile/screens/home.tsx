import React from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div, Text } from "react-native-magnus";
import { scale } from "react-native-size-matters";
import MatchInvitation from "../components/invitationCard";
import { Image, Modal, ScrollView, View } from "react-native";
import { customTheme } from "../utils/theme";
import TournamentCard from "../components/tournamentCard";
import { customTheme } from "../utils/theme";
import { scale } from "react-native-size-matters";

import { ImageBackground } from "react-native";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  return (
    <Div> /{/*carta superior de invitacion =)*/}
      <Div style={{ padding: customTheme.spacing.small, marginTop: scale(26) }}>
        <MatchInvitation
          title="Ramiro te ha invitado a un partido"
          matchType="Futbol 5"
          date="Vi 25/01"
          time="19:00hs"
        />
      </Div> {/* carta del trneo =$*/}
      <TournamentCard
        title="TORNEO VERANO FUTBOL ONCE"
        date="21/02"
        imageSource={require("../assets/fotoCardTorneo.png")}
      />
    </Div>
  );
};

export default HomeScreen;
