import React, { useState } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div, Text } from "react-native-magnus";
import MatchInvitation from "../components/invitationCard";
import { scale } from "react-native-size-matters";
import { customTheme } from "../utils/theme";
import TournamentCard from "../components/tournamentCard";
import MatchCard from "../components/matchesCards";
import UpcomingMatchCard from "../components/cards/UpcomingMatchesCard";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  return (
    <Div p={customTheme.spacing.small}>
      {" "}
      /{/*carta superior de invitacion =)*/}
      <Div style={{  marginTop: scale(26) }}>
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
      {/* carta partidos */}
     <MatchCard
        day="Miércoles"
        date="9"
        time="22:00 hs"
        location="LA CANCHITA DIRECCIÓN 1222"
        players={5}
        maxPlayers={10}
      />
    </Div>
  );
};
export default HomeScreen;