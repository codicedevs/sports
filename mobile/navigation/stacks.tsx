import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import LoginScreen from "../screens/auth/login";
import HomeScreen from "../screens/home";
import PetitionsScreen from "../screens/petitions";
import MatchDetailScreen from "../screens/matchDetailScreen";
import CreateMatchForm from "../screens/createMatch";
import EditMatchScreen from "../screens/editMatch";
import MyMatchesScreen from "../screens/myMatches";
import AllMatches from "../screens/allMatches";
import CustomDrawer from "../components/drawer";
import { AppScreens, AppScreensParamList } from "./screens";
import { Icon } from "react-native-magnus";
import { customTheme } from "../utils/theme";
import { scale } from "react-native-size-matters";
import CreateMatchScreen from "../screens/createMatch";

const PetitionsStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const CreateMatchStack = createNativeStackNavigator<AppScreensParamList>();
const HomeStack = createNativeStackNavigator<AppScreensParamList>();

export function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen
        name={AppScreens.HOME_SCREEN}
        component={(props: any) => <HomeScreen {...props} />}
      />
      <HomeStack.Screen
        name={AppScreens.MY_MATCHES}
        component={MyMatchesScreen}
      />
      <HomeStack.Screen
        name={AppScreens.PETITIONS_SCREEN}
        component={PetitionsScreen}
      />
      <HomeStack.Screen name={AppScreens.ALL_MATCHES} component={AllMatches} />
    </HomeStack.Navigator>
  );
}

export function PetitionstackScreen() {
  return (
    <PetitionsStack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        headerShown: false,
      }}
    >
      <PetitionsStack.Screen
        name={AppScreens.PETITIONS_SCREEN}
        component={(props: any) => <PetitionsScreen {...props} />}
      />
    </PetitionsStack.Navigator>
  );
}

export function CreateMatchStackScreen() {
  return (
    <CreateMatchStack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        headerShown: false,
      }}
    >
      <CreateMatchStack.Screen
        name={AppScreens.CREATE_MATCH}
        component={CreateMatchForm}
      />
      <CreateMatchStack.Screen
        name={AppScreens.MATCH_DETAIL_SCREEN}
        component={MatchDetailScreen}
      />
      <CreateMatchStack.Screen
        name={AppScreens.EDIT_MATCH}
        component={EditMatchScreen}
      />
      <CreateMatchStack.Screen
        name={AppScreens.ALL_MATCHES}
        component={AllMatches}
      />
    </CreateMatchStack.Navigator>
  );
}

export function TabStackScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: scale(50),
          backgroundColor: customTheme.colors.primary,
          borderTopWidth: 0,
        },
        tabBarShowLabel: false,
        tabBarIconStyle: { marginVertical: scale(5) },
        tabBarActiveTintColor: customTheme.colors.tertiary,
        tabBarInactiveTintColor: customTheme.colors.background,
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} fontSize={size} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Previene el comportamiento por defecto
            e.preventDefault();

            // Restablece la pila y navega a la pantalla principal de Home
            navigation.navigate("HomeStack", {
              screen: AppScreens.HOME_SCREEN,
            });
          },
        })}
      />
      <Tab.Screen
        name="CreateMatch"
        component={CreateMatchStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="pluscircleo" color={color} fontSize={size} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Previene el comportamiento por defecto
            e.preventDefault();

            navigation.navigate("CreateMatch", {
              screen: AppScreens.CREATE_MATCH,
            });
          },
        })}
      />
      <Tab.Screen
        name="Solicitudes"
        component={PetitionstackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="mail" color={color} fontSize={size} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Previene el comportamiento por defecto
            e.preventDefault();

            // Restablece la pila y navega a la pantalla principal de Home
            navigation.navigate("Solicitudes", {
              screen: AppScreens.PETITIONS_SCREEN,
            });
          },
        })}
      />
    </Tab.Navigator>
  );
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
