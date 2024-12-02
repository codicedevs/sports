import React from "react";
import { Div, Text } from "react-native-magnus";

const StatisticCard = () => {
  return (
    <Div w="100%" h="24%" justifyContent="flex-end">
      <Div
        flex={8.5}
        bg="gray500"
        roundedTop="2xl"
        justifyContent="center"
        px="lg"
      >
        <Text fontSize="5xl" fontWeight="bold">
          PREGAME
        </Text>
        <Text fontSize="5xl" fontWeight="bold">
          BREAKDOWN
        </Text>
      </Div>
      <Div
        w="100%"
        bg="blue"
        flex={1.5}
        roundedBottom="2xl"
        justifyContent="center"
        px="lg"
      >
        <Text>BULLS AT MAGIC</Text>
      </Div>
    </Div>
  );
};

export default StatisticCard;
