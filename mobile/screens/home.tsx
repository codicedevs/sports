import React, { useState } from "react";
import { Button, Text, View, ScrollView } from "react-native";
import ResponseModal from "../components/modal/responseModal";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import StatisticCard from "../components/statisticCard";
import SquareCard from "../components/squareCard";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const [open, setOpen] = useState(false);

  const cardData = [
    {
      title: "YESTERDAY",
      score: "127 W 108",
      location: "Away",
      backgroundImage: require("../assets/escudo1.png"),
    },
    {
      title: "TODAY",
      score: "150 W 120",
      location: "Home",
      backgroundImage: require("../assets/escudo2.png"),
    },
    {
      title: "NEVER",
      score: "0 W 800",
      location: "Home",
      backgroundImage: require("../assets/escudo3.png"),
    },
    {
      title: "NEVER",
      score: "0 W 800",
      location: "Home",
      backgroundImage: require("../assets/escudo4.png"),
    },
    {
      title: "NEVER",
      score: "0 W 800",
      location: "Home",
      backgroundImage: require("../assets/escudo5.png"),
    },
    {
      title: "NEVER",
      score: "0 W 800",
      location: "Home",
      backgroundImage: require("../assets/escudo6.png"),
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
      <ResponseModal status={false} isVisible={open} setIsVisible={setOpen} />
      <Button onPress={toggleModal} title="Detalles" />
      <Text>Home!</Text>
      <StatisticCard />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10, marginTop: 15,
        }}
      >
        {cardData.map((data, index) => (
          <SquareCard
            key={index}
            tittle={data.title}
            score={data.score}
            location={data.location}
            backgroundimage={data.backgroundImage}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
