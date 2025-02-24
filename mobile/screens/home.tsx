import React, { useContext } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div } from "react-native-magnus";
import MatchModalHandler from "../components/modal/matchModalHandler";
<<<<<<< HEAD
import matchService from "../service/match.service";
import locationService from "../service/location.service";
=======
import { ModalContext } from "../context/modalProvider";
>>>>>>> development

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
<<<<<<< HEAD
  // const [open, setOpen] = useState(true);
=======
  const { open, setOpen } = useContext(ModalContext);

  // Función que se llamará cuando se cree el partido en el modal
  const handleMatchCreated = (createdMatchId: string) => {
    // Navega a la pantalla de detalle y pasa el ID
    navigation.navigate(AppScreens.MATCH_DETAIL, { id: createdMatchId });
  };
>>>>>>> development

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
    <Div>
<<<<<<< HEAD
    {/* <Button onPress={() => setOpen(true)}>Abrir</Button> */}
    {/* <MatchModalHandler open={open} setOpen={setOpen} /> */}
    <Button onPress={fetchDopartis}>GetAll</Button>
    <Button onPress={getById}>GetById</Button>
    <Button onPress={created}>Created</Button>
    <Button onPress={fetchDopartis}>GetAll</Button>
    <Button onPress={fetchDopartis}>GetAll</Button>
    <Button onPress={fetchDopartis}>GetAll</Button>
    <Button onPress={fetchDopartis}>GetAll</Button>

=======
      <Button block onPress={() => setOpen(true)}>
        Abrir
      </Button>
      <MatchModalHandler
        open={open}
        setOpen={setOpen}
        onMatchCreated={handleMatchCreated}
      />
>>>>>>> development
    </Div>

  );
};

export default HomeScreen;
