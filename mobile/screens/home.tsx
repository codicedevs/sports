import React, { useState } from "react";
import { Button, Text, View, ScrollView } from "react-native";
import ResponseModal from "../components/modal/responseModal";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import StatisticCard from "../components/statisticCard";
import SquareCard, { SquareCardProps } from "../components/squareCard";
import Location from "../types/location.type";
import Header from "../components/header";
import SectionTitle from "../components/sectionTitle";
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';

GoogleSignin.configure();

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const [open, setOpen] = useState(false);
  // a ver si se puede pushear
  const location1: Location = {
    _id: "1",
    name: "Location 1",
    address: "123 Street",
    location: {
      type: "Point",
      coordinates: [40.7128, -74.006],
    },
  };

  const handleGoogleSignIn = async () => {
  
    try {
      // Verificar si los servicios de Google Play están disponibles
      await GoogleSignin.hasPlayServices();
      // Intentar iniciar sesión con Google
      const userInfo = await GoogleSignin.signIn();
      // Sentry.captureMessage("Google Sign-In successful:") 
      // Sentry.captureMessage(userInfo.user) 
      console.log(userInfo)
    } catch(e){

    }
  
    //   if (res) {
    //     // Guardar los tokens en AsyncStorage
    //     await AsyncStorage.setItem("refresh", res.refreshToken ?? "");
    //     await AsyncStorage.setItem("access", res.accessToken ?? "");
  
    //     setCurrentUser(res.user);
    //   }
    // } catch (error) {
    //   // Manejo de errores específicos
    //   if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //   // Sentry.captureMessage("Google Sign-In cancelled by user") 
    //   } else if (error.code === statusCodes.IN_PROGRESS) {
    //   // Sentry.captureMessage("Google Sign-In already in progress") 
    //   } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //   // Sentry.captureMessage("Google Play services not available or outdated") 
    //   } else {
    //     // Sentry.captureException(error)
    //   }
    // }
  
    console.log("Google Sign-In process ended"); // Log final
  };

  const cardData: SquareCardProps[] = [
    {
      title: "YESTERDAY",
      score: "LOYAL",
      location: location1,
      backgroundimage: require("../assets/escudo1.png"),
    },
    {
      title: "TODAY",
      score: "150 W 120",
      location: location1,
      backgroundimage: require("../assets/escudo2.png"),
    },
    {
      title: "NEVER",
      score: "0 W 800",
      location: location1,
      backgroundimage: require("../assets/escudo3.png"),
    },
    {
      title: "NEVER",
      score: "0 W 800",
      location: location1,
      backgroundimage: require("../assets/escudo4.png"),
    },
    {
      title: "NEVER",
      score: "0 W 800",
      location: location1,
      backgroundimage: require("../assets/escudo5.png"),
    },
    {
      title: "NEVER",
      score: "0 W 800",
      location: location1,
      backgroundimage: require("../assets/escudo6.png"),
    },
  ];

  return (
    <View
      style={{
        padding: 20,
      }}
    >
      <Header/>
      <StatisticCard />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10, marginTop: 10,
        }}
      >
        {cardData.map((data, index) => (
          <SquareCard
            key={index}
            title={data.title}
            score={data.score}
            location={data.location}
            backgroundimage={data.backgroundimage}
          />
        ))}
      </ScrollView>
      <SectionTitle title="PROXIMOS PARTIDOS"/>
      <GoogleSigninButton
              style={{ width: "100%", height: 48 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={handleGoogleSignIn}
            />
    </View>
  );
};

export default HomeScreen;
