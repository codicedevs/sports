import React, { useState } from "react";
import { Button, Text, View, ScrollView } from "react-native";
import ResponseModal from "../components/modal/responseModal";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import StatisticCard from "../components/statisticCard";
import SquareCard, { SquareCardProps } from "../components/squareCard";
import Location from "../types/location.type";
import Header from "../components/header";
import SectionTitle from "../components/sectionTitle";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const [open, setOpen] = useState(false);
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
    <View
      style={{
        padding: 20,
      }}
    >
      <Header />
      <StatisticCard />
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
      <SectionTitle title="PROXIMOS PARTIDOS" />
    </View>
  );
};

export default HomeScreen;
