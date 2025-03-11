import React, { useContext } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div } from "react-native-magnus";
import MatchModalHandler from "../components/modal/matchModalHandler";
import MatchPreferencesModal from "../components/modal/matchPreferences";
import { ModalContext } from "../context/modalProvider";
import locationService from "../service/location.service";
import matchService from "../service/match.service";
import TriangleContainer from "../components/triangleButtons";

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
    <MatchPreferencesModal open={open} setOpen={setOpen} />
    <TriangleContainer />
    </Div>

  );
};

export default HomeScreen;
