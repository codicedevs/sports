import React, { useState } from "react";
import { Button, Text, View, ScrollView } from "react-native";
import ResponseModal from "../components/modal/responseModal";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import StatisticCard from "../components/statisticCard";
import SquareCard, { SquareCardProps } from "../components/squareCard";
import Location from "../types/location.type";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const [open, setOpen] = useState(false);

  const location1: Location = {
    _id: "1",
    name: "Location 1",
    address: "123 Street",
    location: {
      type: "Point",
      coordinates: [40.7128, -74.0060], 
    },
  };

  const cardData: SquareCardProps[]= [
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

  const toggleModal = () => {
    setOpen(!open);
  };

  return (
    <View
      style={{
        padding: 20,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button onPress={toggleModal} title="Detalles" />
      <Text>Home!</Text>
      <StatisticCard />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10, marginTop: 35,
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
    </View>
  );
};

export default HomeScreen;
