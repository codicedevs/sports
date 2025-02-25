import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export enum AppScreens {
    LOGIN_SCREEN = 'LoginScreen',
    HOME_SCREEN = 'HomeScreen',
    TRIAL1_SCREEN = 'Trial1',
    TRIAL2_SCREEN = 'Trial2',
    SETTINGS_SCREEN = 'Settings',
    MATCH_DETAIL = 'MatchDetail',
    MATCH_SCREEN = 'MatchScreen'
}

export type AppScreensParamList = {
    [AppScreens.LOGIN_SCREEN]: undefined;
    [AppScreens.HOME_SCREEN]: undefined;
    [AppScreens.TRIAL1_SCREEN]: undefined;
    [AppScreens.TRIAL2_SCREEN]: undefined;
    [AppScreens.SETTINGS_SCREEN]: undefined
    [AppScreens.MATCH_DETAIL]: { id: string }
    [AppScreens.MATCH_SCREEN]: undefined
}

export type AppScreenProps<T extends AppScreens> = {
    navigation: NativeStackNavigationProp<AppScreensParamList, T>;
    route: RouteProp<AppScreensParamList, T>;
}