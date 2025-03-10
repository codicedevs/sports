import React, { useContext } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div } from "react-native-magnus";
import MatchModalHandler from "../components/modal/matchModalHandler";
import { ModalContext } from "../context/modalProvider";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const { open, setOpen } = useContext(ModalContext);

 
  const handleMatchCreated = (createdMatchId: string) => {
   
    navigation.navigate(AppScreens.MATCH_DETAIL, { id: createdMatchId });
  };

  return (
    <Div flexDir="row" justifyContent="center">
      <Button  onPress={() => setOpen(true)}>
        Abrir
      </Button>
      <MatchModalHandler
        open={open}
        setOpen={setOpen}
        onMatchCreated={handleMatchCreated}
        
      />
    </Div>
  );
};

export default HomeScreen;
