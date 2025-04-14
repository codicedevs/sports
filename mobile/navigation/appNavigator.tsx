import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import VersionModal from "../components/modal/versionModal";
import { AuthStackScreen, Principal } from "./stacks";
import RestrictiveModal from "../components/modal/restrictiveModal";
import { navigationRef } from "../utils/navigation";
import { useIsFetching } from "@tanstack/react-query";
import { Image, View } from "react-native";
import { Div } from "react-native-magnus";

const AppNavigator = () => {
  const isFetching = useIsFetching();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (!appReady && isFetching === 0) {
      setAppReady(true);
    }
  }, [isFetching, appReady]);

  if (!appReady) {
    return (
      <Div flex={1} alignItems="center" justifyContent="center">
        <Image style={{width:"60%", height:"20%", resizeMode:"contain"}} source={require("../assets/logoDeballComplete.png")} />
      </Div>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <VersionModal />
      <RestrictiveModal />
      {/* <SplashScreen /> */}
      <Principal />
    </NavigationContainer>
  );
};

export default AppNavigator;
