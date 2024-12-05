import React from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import MatchFormComponent from "../components/matchForm";

const CreateMatchScreen: React.FC<AppScreenProps<AppScreens.CREATE_MATCH>> = ({
  navigation,
}) => {
  const handleMatchCreated = () => {
    navigation.navigate(AppScreens.HOME_SCREEN);
  };

  return <MatchFormComponent onMatchCreated={handleMatchCreated} />;
};

export default CreateMatchScreen;
