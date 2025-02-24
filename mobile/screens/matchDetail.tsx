import React from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Text } from "react-native";
import { Div, Image } from "react-native-magnus";
import matchService from "../service/match.service";
import useFetch from "../hooks/useGet";
import { QUERY_KEYS } from "../types/query.types";

const MatchDetail: React.FC<AppScreenProps<AppScreens.MATCH_DETAIL>> = ({
  route,
}) => {
  const { id } = route.params;

  const fetchMatchInfo = async () => {
    const res = await matchService.getById(id);
    return res.data;
  };

  const { data: match, isFetching } = useFetch(fetchMatchInfo, [
    QUERY_KEYS.MATCH,
  ]);

  return (
    <Div>
      <Text>Partido id: {id}</Text>
      <Image source={require("../assets/iconflecha2.png")} />

    </Div>
  );
};

export default MatchDetail;
