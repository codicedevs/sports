import React, { useState } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div } from "react-native-magnus";
import MatchModalHandler from "../components/modal/matchModalHandler";
import matchService from "../service/match.service";
import locationService from "../service/location.service";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  // const [open, setOpen] = useState(true);

  async function fetchDopartis() {
    const res = await locationService.getAll();
    console.log("resss.getAll()", res.results);
  };

  async function getById() {
    const res = await locationService.getById("");
    console.log("resss.getById()", res);
  }
  async function created() {
    const res = await locationService.create({
      name: "Messi",
      date: "2025-02-23T17:48:00.000Z",
      playersLimit: 10,
      userId: "6720ef0e3a78ebc10564e979",
      sportMode: "6751cb8844b53be83b3554cc"
    });
    console.log("resss.getById()", res);
  }
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
    {/* <Button onPress={() => setOpen(true)}>Abrir</Button> */}
    {/* <MatchModalHandler open={open} setOpen={setOpen} /> */}
    <Button onPress={fetchDopartis}>GetAll</Button>
    <Button onPress={getById}>GetById</Button>
    <Button onPress={created}>Created</Button>
    <Button onPress={fetchDopartis}>GetAll</Button>
    <Button onPress={fetchDopartis}>GetAll</Button>
    <Button onPress={fetchDopartis}>GetAll</Button>
    <Button onPress={fetchDopartis}>GetAll</Button>

    </Div>

  );
};
export default HomeScreen;
