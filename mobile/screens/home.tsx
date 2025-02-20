import React, { useContext, useState } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div } from "react-native-magnus";
import MatchModalHandler from "../components/modal/matchModalHandler";
import { MatchCardDetail } from "../components/styled/styled";
import { ModalContext } from "../context/modalProvider";
const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const {open, setOpen} = useContext(ModalContext);
  console.log("aaaaaaa")

  return (


    <Div>
    <Button block onPress={() => setOpen(true)}>Abrir</Button>
    
    <MatchModalHandler
    open={open}
    setOpen={setOpen}/>
    
    </Div>
  );
};
export default HomeScreen;
