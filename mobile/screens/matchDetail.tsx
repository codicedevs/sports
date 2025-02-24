import React from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";

import { Div, Image, Text } from "react-native-magnus";
import matchService from "../service/match.service";
import useFetch from "../hooks/useGet";
import { QUERY_KEYS } from "../types/query.types";
import { customTheme } from "../utils/theme";

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
    <Div p={customTheme.spacing.medium}>
      <Text>Partido id: {id}</Text>
      <Div flexDir="row" alignItems="center">
        <Div justifyContent="flex-start">
          <Image
            source={require("../assets/iconflecha2.png")}
            style={{ width: 20, height: 20, resizeMode: "contain" }}
          />
        </Div>
        <Div w="75%" alignItems="center">
          <Text
            fontSize={customTheme.fontSize.medium}
            fontFamily="NotoSans-Variable"
          >
            Detalle del partido
          </Text>
        </Div>
      </Div>
      <Div flexDir="row" justifyContent="space-between">
        <Div>
          <Text>FUTBOL 5</Text>
        </Div>
        <Div flexDir="row">
          <Image
            source={require("../assets/iconUser.png")}
            style={{ width: 20, height: 20, resizeMode: "contain" }}
          />
          <Text>5/10</Text>
        </Div>
      </Div>
    </Div>
  );
};

export default MatchDetail;
