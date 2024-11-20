import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import DetailsScreen from "../screens/details";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { FadeWrapper } from "../components/fadeView";
import LoginScreen from "../screens/auth/login";
import HomeScreen from "../screens/home";
import SettingsScreen from "../screens/settings";
import Trialscreen from "../screens/trial";
import Trialscreen2 from "../screens/trial2";
import { AppScreens } from "./screens";

const SettingsStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();


export function HomeStackScreen() {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Drawer.Screen name={AppScreens.HOME_SCREEN} component={(props) => (
                <FadeWrapper>
                    <HomeScreen {...props} />
                </FadeWrapper>
            )} />
            <Drawer.Screen name={AppScreens.TRIAL1_SCREEN} component={Trialscreen} />
        </Drawer.Navigator>
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
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="HomeStack" component={HomeStackScreen} />
            <Tab.Screen name="SettingsStack" component={SettingsStackScreen} />
        </Tab.Navigator>
    )
}

export function Principal() {
    return (
        <Drawer.Navigator>
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