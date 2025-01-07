import { Button, Text, View, ScrollView } from "react-native";
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
import StepModal from "../components/modal/stepModal";
import { UserPreferences } from "../types/preferences.type";
import { StepAvailability, StepSport, StepZones } from "../components/userPreferencesSteps";
import authService from "../service/auth.service";
import { useSession } from "../context/authProvider";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<UserPreferences>({
    sport: '',
    sportMode: '',
    availability: [],
    preferredZones: [],
  });
  const [counterSteps, setCounterSteps] = useState(0)

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

  const updateUserInfo = (info: Partial<UserPreferences>) => {
    setUserInfo((prev) => ({ ...prev, ...info }));
  };

  const handleNext = (data: any) => {
    setUserInfo((prev) => ({ ...prev, ...data }));
    if (counterSteps < steps.length - 1) {
      setCounterSteps((prev) => prev + 1);
    } else {
      handleModalClose();
    }
  };
  
  const steps = [
    <StepSport userInfo={userInfo} setUserInfo={setUserInfo} onNext={handleNext} />,
    <StepAvailability userInfo={userInfo} setUserInfo={setUserInfo} onNext={handleNext} />,
    <StepZones userInfo={userInfo} setUserInfo={setUserInfo} onNext={handleNext} />,
  ];
  

  const handleModalClose = () => {
    console.log("Información final del usuario:", userInfo);
    setModalVisible(false);
    setCounterSteps(0);
    setUserInfo({
      sport: '',
      sportMode: '',
      availability: [],
      preferredZones: [],
    });
  };

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
    <>
      <View style={{ flex: 1, padding: 8 }}>
        <Header />
        <ScrollView
          contentContainerStyle={{
            padding: scale(8),
            gap: scale(10),
          }}
          showsVerticalScrollIndicator={false}
        >
          <StatisticCard style={{ flex: 1 }} />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: scale(8),
              marginTop: scale(9),
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
          <SectionPhoto backGroundImage={require("../assets/photoNew.png")} />
          <MatchCard />
          <MatchCard />
          <MatchCard />
          <MatchCard />
        </ScrollView>
        <Button title="Abrir Modal" onPress={() => setModalVisible(true)} />
      </View>
      
      {/* Modal con Steps */}
      <StepModal
        steps={steps}
        visible={modalVisible}
        onClose={handleModalClose}
        currentStep={counterSteps}
      />
    </>
  );
};

export default HomeScreen;
