import { Text, View, ScrollView } from "react-native";
import { Button } from "react-native-magnus";
import React, { useEffect, useState } from "react";
import { scale } from "react-native-size-matters";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import StatisticCard from "../components/statisticCard";
import SquareCard, { SquareCardProps } from "../components/squareCard";
import Location from "../types/location.type";
import Header from "../components/header";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure();
import SectionPhoto from "../components/SectionPhoto";
import MatchCard from "../components/cards/matchCard";
import ModalAnimation from "../components/cards/animatedCard";
import Index from "../components/matche";
import authService from "../service/auth.service";
import { useSession } from "../context/authProvider";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  // Estados para manejar los modales y pasos
  const [openStep, setOpenStep] = useState(false);
  const [open, setOpen] = useState(false);

  const { setCurrentUser } = useSession();

  const checkUser = async () => {
    try {
      const res = await authService.whoAmI()
      setCurrentUser(res)
    }
    catch (e) { 
      console.log(e)
    }
  }

  useEffect(() => {
    checkUser()
  }, [])
  // a ver si se puede pushear
  const location1: Location = {
    _id: "1",
    name: "Location 1",
    address: "123 Street",
    hour: "19:00 PM",
    location: {
      type: "Point",
      coordinates: [40.7128, -74.006],
    },
  };

  function handleStep() {
    setOpenStep(true);
  }

  const cardData: SquareCardProps[] = [
    {
      title: "Vie 8 dic",
      score: "LOYAL",
      location: location1,
      hour: "19:00 PM",
      backgroundimage: require("../assets/squarecard2.png"),
    },
    {
      title: "TODAY",
      score: "150 W 120",
      location: location1,
      hour: "19:00 PM",
      backgroundimage: require("../assets/squarecard1.png"),
    },
    {
      title: "NEVER",
      score: "0 W 800",
      hour: "19:00 PM",
      location: location1,
      backgroundimage: require("../assets/squaredcard3.png"),
    },
    {
      title: "NEVER",
      score: "0 W 800",
      hour: "19:00 PM",
      location: location1,
      backgroundimage: require("../assets/escudo4.png"),
    },
    {
      title: "NEVER",
      score: "0 W 800",
      hour: "19:00 PM",
      location: location1,
      backgroundimage: require("../assets/escudo5.png"),
    },
    {
      title: "NEVER",
      score: "0 W 800",
      hour: "19:00 PM",
      location: location1,
      backgroundimage: require("../assets/escudo6.png"),
    },
  ];

  return (
    <View style={{ flex: 1, padding: 8 }}>
      {/* Encabezado */}
      <Header />

      {/* Scroll principal */}
      <ScrollView
        contentContainerStyle={{
          padding: 10,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta de estadísticas */}
        <StatisticCard style={{ flex: 1 }} />

        {/* Scroll horizontal de tarjetas */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 10,
            marginTop: 10,
          }}
        >
          {cardData.map((data, index) => (
            <SquareCard
              key={index}
              title={data.title}
              score={data.score}
              hour={data.hour}
              location={data.location}
              backgroundimage={data.backgroundimage}
            />
          ))}
        </ScrollView>

        {/* Foto de sección */}
        <SectionPhoto backGroundImage={require("../assets/photoNew.png")} />

        {/* Tarjetas de partidos */}
        <MatchCard />
        <MatchCard />
        <MatchCard />
        <MatchCard />

        {/* Botón para abrir el Modal */}
        <Button onPress={handleStep} mt={10} bg="blue600">
          <Text style={{ color: "white" }}>Crear Partido</Text>
        </Button>

        {/* Modal con los Steps */}
        <ModalAnimation open={openStep} onFinish={() => setOpenStep(false)}>
          <Index />
        </ModalAnimation>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
