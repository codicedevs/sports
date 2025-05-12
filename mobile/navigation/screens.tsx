import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export enum AppScreens {
    LOGIN_SCREEN = 'LoginScreen',
    HOME_SCREEN = 'HomeScreen',
    TRIAL1_SCREEN = 'Trial1',
    TRIAL2_SCREEN = 'Trial2',
    PETITIONS_SCREEN = 'PetitionsScreen',
    MATCH_DETAIL = 'MatchDetail',
    MATCH_SCREEN = 'MatchScreen',
    MATCH_HANDLER = 'MatchHandler',
    USER_SCREEN = 'User_Screen',
    FRIEND_SCREEN = 'Friends_Screen'
}

export type AppScreensParamList = {
    [AppScreens.LOGIN_SCREEN]: undefined;
    [AppScreens.HOME_SCREEN]: undefined;
    [AppScreens.TRIAL1_SCREEN]: undefined;
    [AppScreens.TRIAL2_SCREEN]: undefined;
    [AppScreens.PETITIONS_SCREEN]: undefined;
    [AppScreens.MATCH_DETAIL]: { id: string };
    [AppScreens.MATCH_SCREEN]: undefined;
    [AppScreens.MATCH_HANDLER]: {id?: string};
    [AppScreens.USER_SCREEN]: undefined;
    [AppScreens.FRIEND_SCREEN]: undefined;
}

export type AppScreenProps<T extends AppScreens> = {
    navigation: NativeStackNavigationProp<AppScreensParamList, T>;
    route: RouteProp<AppScreensParamList, T>;
}