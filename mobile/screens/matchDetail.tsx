import React from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Text } from "react-native";
import { Div } from "react-native-magnus";
import matchService from "../service/match.service";
import useFetch from "../hooks/useGet";
import { QUERY_KEYS } from "../types/query.types";

const MatchDetail: React.FC<AppScreenProps<AppScreens.MATCH_DETAIL>> = ({
  route,
}) => {
  const { id } = route.params;
  console.log("Route params:", route.params); // <-- para ver si llega id
  

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
    </Div>
  );
};

export default MatchDetail;
