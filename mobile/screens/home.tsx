import React, { useState } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div, Text } from "react-native-magnus";
import MatchInvitation from "../components/invitationCard";
import { scale } from "react-native-size-matters";
import { customTheme } from "../utils/theme";
import TournamentCard from "../components/tournamentCard";
import MatchCard from "../components/matchesCards";
import UpcomingMatchCard from "../components/UpcomingMatchesCard";
import { ScrollView } from "react-native";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  return (
    <Div p={customTheme.spacing.small}>
      <ScrollView showsVerticalScrollIndicator={false}> {/* eliminar este scrool solo lo hice para mostrar todo */}
      {" "}
      /{/*carta superior de invitacion =)*/}
      <Div style={{ marginTop: scale(26) }}>
        <MatchInvitation
          title="Ramiro te ha invitado a un partido"
          matchType="Futbol 5"
          date="Vi 25/01"
          time="19:00hs"
        />
      </Div>{" "}
      {/* carta del trneo =$*/}
      <TournamentCard
        title="TORNEO VERANO FUTBOL ONCE"
        date="21/02"
        imageSource={require("../assets/fotoCardTorneo.png")}
      />
      <ScrollView horizontal contentContainerStyle={{marginTop: 15}}>
        {/* card upcoming */}
        <UpcomingMatchCard fecha="Vi 30/12 " cupo="1/10" titulo="Super Club" />
        <UpcomingMatchCard fecha="Mar 31/12 " cupo="3/22" titulo="La villa Club" />
        <UpcomingMatchCard fecha="Lun 1/01 " cupo="9/10" titulo="Loyal" />
      </ScrollView>
      <ScrollView showsVerticalScrollIndicator={false}>
      {/* carta partidos */}
      <MatchCard
        day="Miércoles"
        date="9"
        time="22:00 hs"
        location="LA CANCHITA DIRECCIÓN 1222"
        players={5}
        maxPlayers={10}
      />
        <MatchCard
        day="jueve"
        date="12"
        time="52:00 hs"
        location="anda a sabe"
        players={5}
        maxPlayers={10}
      /></ScrollView></ScrollView>
    </Div>
  );
};
export default HomeScreen;
