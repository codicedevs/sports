import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export enum AppScreens {
  LOGIN_SCREEN = "LoginScreen",
  HOME_SCREEN = "HomeScreen",
  TRIAL1_SCREEN = "Friends",
  TRIAL2_SCREEN = "Trial2",
  PETITIONS_SCREEN = "Petitions",
  CREATE_MATCH = "CreateMatch",
  MATCH_DETAIL_SCREEN = "MatchDetailScreen",
  EDIT_MATCH = "EditMatch",
  MY_MATCHES = "MyMatches",
  ALL_MATCHES = "AllMatches",
}

export type AppScreensParamList = {
  [AppScreens.LOGIN_SCREEN]: undefined;
  [AppScreens.HOME_SCREEN]: undefined;
  [AppScreens.TRIAL1_SCREEN]: undefined;
  [AppScreens.TRIAL2_SCREEN]: undefined;
  [AppScreens.PETITIONS_SCREEN]: undefined;
  [AppScreens.CREATE_MATCH]:
    | { screen: AppScreens.MATCH_DETAIL_SCREEN; params: { matchId: string } }
    | undefined;
  [AppScreens.MATCH_DETAIL_SCREEN]: { matchId: string };
  [AppScreens.EDIT_MATCH]: { matchId: string };
  [AppScreens.MY_MATCHES]: { userId: string };
  [AppScreens.ALL_MATCHES]: { userId: string };
};

export type AppScreenProps<T extends AppScreens> = {
  navigation: NativeStackNavigationProp<AppScreensParamList, T>;
  route: RouteProp<AppScreensParamList, T>;
};
