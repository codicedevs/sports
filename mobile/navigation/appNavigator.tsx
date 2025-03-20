import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import VersionModal from "../components/modal/versionModal";
import SplashScreen from "../screens/splash";
import { AuthStackScreen, Principal } from "./stacks";
import RestrictiveModal from "../components/modal/restrictiveModal";
import { navigationRef } from "../utils/navigation";
import { ModalContext } from "../context/modalProvider";
import MatchModalHandler from "../components/modal/matchModalHandler";

const AppNavigator = () => {
  const [open, setOpen] = useState(false);
  return (
    <NavigationContainer ref={navigationRef}>
      <VersionModal />
      <RestrictiveModal />
      <SplashScreen />
      <Principal />
    </NavigationContainer>
  );
};

export default AppNavigator;
