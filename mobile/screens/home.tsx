import React, { useContext, useState } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div, Text } from "react-native-magnus";
import useFetch from "../hooks/useGet";
import matchService from "../service/match.service";
import { QUERY_KEYS } from "../types/query.types";
import matchesCards from "../components/cards/matchesCards";
import Match from "../types/match.type";
import { useSession } from "../context/authProvider";
import { ScrollView } from "react-native-gesture-handler";
import { AuthContext } from "../context/authProvider";
import { customTheme } from "../utils/theme";
import UpcomingMatchCard from "../components/cards/UpcomingMatchesCard";
import MatchModalHandler from "../components/modal/matchModalHandler";
import EventsCard from "../components/cards/eventsCard";
import eventService from "../service/event.service";
import MatchesCards from "../components/cards/matchesCards";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const { data: matches } = useFetch(matchService.getAll, [QUERY_KEYS.MATCHES]);
  const { showModal } = useSession();

  const { data: events } = useFetch(eventService.getAll, [QUERY_KEYS.EVENTS]); // pa hacer la llamada

  const fallbackEvent = {
    name: "TORNEO DE VERANO FUTBOL VETERANO", // pa hardcodear
    date: "12/3",
  };

  return (
    <Div>
      <ScrollView>
        <Button onPress={showModal}>Abrir</Button>
        <Div p={customTheme.spacing.small}>
          <Div>
            <EventsCard // hardcodeado cambiar, arreglar lo coso de event!!!!!!!!
              name={fallbackEvent.name}
              date={fallbackEvent.date}
            />
          </Div>
          <Div>
            <Text
              mt={customTheme.spacing.small}
              fontSize={customTheme.fontSize.medium}
              fontFamily="NotoSans-Italic"
            >
              Próximos partidos
            </Text>
          </Div>
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
            <MatchesCards
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

export default HomeScreen;