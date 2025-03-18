import React, { useContext, useState } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div, Text } from "react-native-magnus";
import useFetch from "../hooks/useGet";
import matchService from "../service/match.service";
import { QUERY_KEYS } from "../types/query.types";
import MatchCard from "../components/matchesCards";
import Match from "../types/match.type";
import { useSession } from "../context/authProvider";
import { ScrollView } from "react-native-gesture-handler";
import { AuthContext } from "../context/authProvider";
import { customTheme } from "../utils/theme";
import UpcomingMatchCard from "../components/UpcomingMatchesCard";
import EventsCard from "../components/eventsCard";
import eventService from "../service/event.service";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const { data: matches } = useFetch(matchService.getAll, [QUERY_KEYS.MATCHES]);
  const { showModal } = useSession();

  const { data: events } = useFetch(eventService.getAll, [QUERY_KEYS.EVENTS]); // llamada a eventos se va au sar

  const fallbackEvent = {
    name: "TORNEO DE VERANO FUTBOL VETERANO",
    date: "12/3",
  };

  return (
    <Div>
      <ScrollView>
        <Button onPress={showModal}>Abrir</Button>
        <Div p={customTheme.spacing.small}>
          <Text
            fontSize={customTheme.fontSize.medium}
            fontFamily="NotoSans-Italic"
            ml={customTheme.spacing.small}
          >
            <Div>
              <EventsCard // hardcodeado cambiar, arreglar lo coso de event!!!!!!!!
                name={fallbackEvent.name}
                date={fallbackEvent.date}
              />
            </Div>
            Próximos partidos
          </Text>
          <ScrollView horizontal>
            {matches?.results.map((u: any) => (
              <UpcomingMatchCard
                key={u._id}
                matchId={u._id}
                date={u.date}
                hour={u.hour}
                players={u.users}
                maxPlayers={u.playersLimit}
                location={u.location}
                sportMode={u.sportMode}
              />
            ))}
          </ScrollView>
        </Div>

        <Div>
          <Text
            ml={customTheme.spacing.small}
            fontSize={customTheme.fontSize.medium}
            fontFamily="NotoSans-Italic"
          >
            Mis partidos
          </Text>

          {matches?.results.map((m: any) => (
            <MatchCard
              key={m._id}
              matchId={m._id}
              dayOfWeek={m.dayOfWeek}
              date={m.date} // string, ej: "2026-07-15T17:48:00.000Z"
              time={m.hour} // number, ej: 22
              location={m.location} // { name, address }
              players={m.users}
              maxPlayers={m.playersLimit}
              sportMode={m.sportMode}
            />
          ))}
        </Div>
      </ScrollView>
    </Div>
  );
};

export default HomeScreen;
