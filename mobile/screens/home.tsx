import React, { useState } from "react";
import { scale } from "react-native-size-matters";
import { Button, Text, View, ScrollView } from "react-native";
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

  const steps = [
    <StepSport
      key="1"
      userInfo={userInfo}
      setUserInfo={updateUserInfo}
    />,
    <StepAvailability
      key="2"
      userInfo={userInfo}
      setUserInfo={updateUserInfo}
    />,
    <StepZones
      key="3"
      userInfo={userInfo}
      setUserInfo={updateUserInfo}
    />,
  ];

  const handleModalClose = () => {
    console.log("Información final del usuario:", userInfo);
    setModalVisible(false);
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
      />
    </>
  );
};

export default HomeScreen;
