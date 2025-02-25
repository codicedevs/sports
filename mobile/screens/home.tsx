import React, { useContext } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div } from "react-native-magnus";
import MatchModalHandler from "../components/modal/matchModalHandler";
import MatchPreferencesModal from "../components/modal/matchPreferences";
import { ModalContext } from "../context/modalProvider";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const { open, setOpen } = useContext(ModalContext);

  // Función que se llamará cuando se cree el partido en el modal
  const handleMatchCreated = (createdMatchId: string) => {
    // Navega a la pantalla de detalle y pasa el ID
    navigation.navigate(AppScreens.MATCH_DETAIL, { id: createdMatchId });
  };

  return (
    <Div>
    <Button onPress={() => setOpen(true)}>Abrir</Button>
    <MatchPreferencesModal open={open} setOpen={setOpen} />
    </Div>
  );
};

export default HomeScreen;
