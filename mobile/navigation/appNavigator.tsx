import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import VersionModal from "../components/modal/versionModal";
import { Principal } from "./stacks";
import RestrictiveModal from "../components/modal/restrictiveModal";
import { navigationRef } from "../utils/navigation";
import { useIsFetching } from "@tanstack/react-query";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
const AppNavigator = () => {
  const isFetching = useIsFetching();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (!appReady && isFetching === 0) {
      setAppReady(true);

    }
  }, [isFetching, appReady]);

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  return (
    <NavigationContainer ref={navigationRef}>
      <VersionModal />
      <RestrictiveModal />
      <Principal />
    </NavigationContainer>
  );
};

export default AppNavigator;
