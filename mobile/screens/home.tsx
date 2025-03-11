import React, { useContext } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div } from "react-native-magnus";
import MatchPreferencesModal from "../components/modal/matchPreferences";
import { ModalContext } from "../context/modalProvider";
import MatchModalHandler from "../components/modal/matchModalHandler";


const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const { open, setOpen } = useContext(ModalContext);

  const handleMatchCreated = (createdMatchId: string) => {
    navigation.navigate(AppScreens.MATCH_DETAIL, { id: createdMatchId });
  };

  return (
    <Div>
    <Button onPress={() => setOpen(true)}>Abrir</Button>
    <MatchModalHandler open={open} setOpen={setOpen} />
    </Div>

  );
};

export default HomeScreen;

// el que envia 66e482584509915a15968bd7

//
