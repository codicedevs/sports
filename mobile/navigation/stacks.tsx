import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { FadeWrapper } from "../components/fadeView";
import LoginScreen from "../screens/auth/login";
import HomeScreen from "../screens/home";
import SettingsScreen from "../screens/settings";
import Trialscreen from "../screens/trial";
import Trialscreen2 from "../screens/trial2";
import { AppScreens } from "./screens";
import MatchDetail from "../screens/matchDetail";
import CustomTabBar from "../components/layout/customTabBar";

const SettingsStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const HomeStack = createNativeStackNavigator()


export function HomeStackScreen() {
    return (
        <HomeStack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <HomeStack.Screen name={AppScreens.HOME_SCREEN} component={(props) => (
                <FadeWrapper>
                    <HomeScreen {...props} />
                </FadeWrapper>
            )} />
              <HomeStack.Screen options={{ tabBarStyle: { display: "none" } }} name={AppScreens.MATCH_DETAIL} component={(props) => (
                //CUANDO HAGA EL CUSTOM TAB PUEDO HACER Q NO APAREZCA EN ESTA TAB EN ESPECIFICO
                <FadeWrapper>
                    <MatchDetail {...props} />
                </FadeWrapper>
            )} 
            />
            <HomeStack.Screen name={AppScreens.TRIAL1_SCREEN} component={Trialscreen} />
            
        </HomeStack.Navigator>
    );
}

export function SettingsStackScreen() {
    return (
        <SettingsStack.Navigator
            screenOptions={{
                animation: 'slide_from_right',
                headerShown: false
            }}>
            <SettingsStack.Screen name={AppScreens.SETTINGS_SCREEN} component={SettingsScreen} />
            <SettingsStack.Screen name={AppScreens.TRIAL2_SCREEN} component={Trialscreen2} />
        </SettingsStack.Navigator>
    );
}

export function TabStackScreen() {
    return (
        <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
            <Tab.Screen name="HomeStack" component={HomeStackScreen} />
            <Tab.Screen name="SettingsStack" component={SettingsStackScreen} />
            <Tab.Screen name="SettingsStack1" component={SettingsStackScreen} />
            <Tab.Screen name="SettingsStack2" component={SettingsStackScreen} />
        </Tab.Navigator>
    )
}

export function Principal() {
    return (
        <Drawer.Navigator screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="TabStackScreen" component={TabStackScreen} />
        </Drawer.Navigator>
    )
}

export function AuthStackScreen() {
    return (
        <AuthStack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <AuthStack.Screen name={AppScreens.LOGIN_SCREEN} component={LoginScreen} />
        </AuthStack.Navigator>
    )
}