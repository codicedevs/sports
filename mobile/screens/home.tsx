import React, { useContext } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div } from "react-native-magnus";
import MatchModalHandler from "../components/modal/matchModalHandler";
import { ModalContext } from "../context/modalProvider";
import Field from "../components/field";

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
    <Div flex={1}>
      <Field />
    </Div>
  );
};

export default HomeScreen;
