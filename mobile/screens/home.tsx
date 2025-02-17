import React, { useState } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div } from "react-native-magnus";
import MatchModalHandler from "../components/modal/matchModalHandler";
import MatchPreferencesModal from "../components/modal/matchPreferences";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const [open, setOpen] = useState(true)

  return (
    // <Div> 
    //   <Div style={{ padding: customTheme.spacing.small, marginTop: scale(26) }}>
    //     <MatchInvitation
    //       title="Ramiro te ha invitado a un partido"
    //       matchType="Futbol 5"
    //       date="Vi 25/01"
    //       time="19:00hs"
    //     />
    //   </Div> 
    //   <TournamentCard
    //     title="TORNEO VERANO FUTBOL ONCE"
    //     date="21/02"
    //     imageSource={require("../assets/fotoCardTorneo.png")}
    //   />
    // </Div>

    <Div>
    <Button onPress={() => setOpen(true)}>Abrir</Button>
    <MatchPreferencesModal open={open} setOpen={setOpen} />
    </Div>
  );
};
export default HomeScreen;
