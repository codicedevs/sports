import React, { useContext } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div } from "react-native-magnus";
import MatchPreferencesModal from "../components/modal/matchPreferences";
import { ModalContext } from "../context/modalProvider";
import MatchModalHandler from "../components/modal/matchModalHandler";
import RestrictiveModal from "../components/modal/restrictiveModal";
import { useSession } from "../context/authProvider";


const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const { showModal } = useSession();

  return (
    <Div>
      <Button onPress={showModal}>Abrir</Button>
    </Div>

  );
};

export default HomeScreen;