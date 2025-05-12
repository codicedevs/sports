import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { FadeWrapper } from "../components/fadeView";
import LoginScreen from "../screens/auth/login";
import HomeScreen from "../screens/home";
import Trialscreen from "../screens/trial";
import Trialscreen2 from "../screens/Trial2";
import { AppScreens, AppScreensParamList } from "./screens";
import MatchDetail from "../screens/matchDetail";
import CustomTabBar from "../components/layout/customTabBar";
import MatchesScreen from "../screens/matches";
import MatchHandlerScreen from "../screens/MatchHandler";
import { CustomHeader } from "../components/layout/customHeader";
import PetitionScreen from "../screens/petitionsScreen";
import UserScreen from "../screens/UserScreen";
import FriendsScreen from "../screens/friendsScreen";
const SettingsStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator<AppScreensParamList>();
const Drawer = createDrawerNavigator();
const HomeStack = createNativeStackNavigator();

export function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen
        name={AppScreens.HOME_SCREEN}
        options={{ contentStyle: { backgroundColor: "white" } }}
        component={(props) => (
          <FadeWrapper>
            <HomeScreen {...props} />
          </FadeWrapper>
        )}
      />
      <HomeStack.Screen
        options={{
          tabBarStyle: { display: "none" },
          contentStyle: { backgroundColor: "white" },
        }}
        name={AppScreens.MATCH_DETAIL}
        component={(props) => (
          //CUANDO HAGA EL CUSTOM TAB PUEDO HACER Q NO APAREZCA EN ESTA TAB EN ESPECIFICO
          <FadeWrapper>
            <MatchDetail {...props} />
          </FadeWrapper>
        )}
      />
      <HomeStack.Screen
        name={AppScreens.TRIAL1_SCREEN}
        component={Trialscreen}
      />
    </HomeStack.Navigator>
  );
}

export function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        headerShown: false,
      }}
    >
      <SettingsStack.Screen
        name={AppScreens.PETITIONS_SCREEN}
        component={PetitionScreen}
      />
      <SettingsStack.Screen
        name={AppScreens.TRIAL2_SCREEN}
        component={Trialscreen2}
      />
    </SettingsStack.Navigator>
  );
}

//LOS OTROS ERRORES DE TIPADO LOS ARREGLARE CUANDO ESTEN TODAS LAS PANTALLAS
export function TabStackScreen() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        header: () => <CustomHeader />,
        headerShown: true,
        animation: "fade",
      }}
    >
      <Tab.Screen name="HomeStack" component={HomeStackScreen} />
      <Tab.Screen
        name={AppScreens.PETITIONS_SCREEN}
        component={PetitionScreen}
      />
      <Tab.Screen
        options={{ tabBarStyle: { display: "none" } }}
        name={AppScreens.MATCH_HANDLER}
        component={MatchHandlerScreen}
      />
      <Tab.Screen name={AppScreens.MATCH_SCREEN} component={MatchesScreen} />

      <Tab.Screen name={AppScreens.MATCH_DETAIL} component={MatchDetail} />
      {/* <Tab.Screen name={AppScreens.USER_SCREEN} component={UserScreen} />  */}
      <Tab.Screen name={AppScreens.FRIEND_SCREEN} component={FriendsScreen} options={{ tabBarStyle: { display: "none" } }}/>
      <Tab.Screen
        name={AppScreens.USER_SCREEN}
        component={UserScreen}
        options={{
          tabBarButton: () => null,
          tabBar: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

export function Principal() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="TabStackScreen" component={TabStackScreen} />
    </Drawer.Navigator>
  );
}

export function AuthStackScreen() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen
        name={AppScreens.LOGIN_SCREEN}
        component={LoginScreen}
      />
    </AuthStack.Navigator>
  );
}
