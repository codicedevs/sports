import React from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div, Text } from "react-native-magnus";
import useFetch from "../hooks/useGet";
import matchService from "../service/match.service";
import { QUERY_KEYS } from "../types/query.types";
import { useSession } from "../context/authProvider";
import { ScrollView } from "react-native-gesture-handler";
import { customTheme } from "../utils/theme";
import eventService from "../service/event.service";
import petitionService from "../service/petition.service";
import MatchInvitation from "../components/cards/invitationCard";
import EventsCard from "../components/cards/eventsCard";
import UpcomingMatchCard from "../components/cards/UpcomingMatchesCard";
import Petition from "../types/petition.type";
import MatchesCards from "../components/cards/matchesCards";
import { scale, verticalScale } from "react-native-size-matters";
import HandleMatchesButton from "../components/handleMatchesButton";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const { currentUser } = useSession()
  const { data: matches } = useFetch(() => matchService.getAll({
    where: {
      "user._id": currentUser._id
    }
  }), [QUERY_KEYS.MATCHES, currentUser]);
  const { data: petitions } = useFetch<
    { results: Petition[] }
  >(() => petitionService.getAll(

    {
      // "receiver": currentUser._id,
      populate: ["reference.id"]
    }

  ), [QUERY_KEYS.PETITIONS, currentUser]);
  const { showModal } = useSession();

  const { data: events } = useFetch(eventService.getAll, [QUERY_KEYS.EVENTS]); // pa hacer la llamada

  const fallbackEvent = {
    name: "TORNEO DE VERANO FUTBOL VETERANO", // pa hardcodear
    date: "12/3",
  };
  if (!petitions) return
  return (
    <Div>
      <ScrollView>
        <Button onPress={showModal}>Abrir</Button>
        <Div p={customTheme.spacing.medium}>
          <Div mb={customTheme.spacing.medium}>
            <MatchInvitation date={petitions.results[0].reference.id.date} time="10" title="Stalagol" matchType={petitions.results[0].reference.type} />
          </Div>
          <Div mb={customTheme.spacing.medium}>
            <EventsCard // hardcodeado cambiar, arreglar lo coso de event!!!!!!!!
              name={fallbackEvent.name}
              date={fallbackEvent.date}
            />
          </Div>
          <Text
            fontSize={customTheme.fontSize.medium}
            fontFamily="NotoSans-Italic"
          >
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
        <Div mb={customTheme.spacing.medium} px={customTheme.spacing.medium}>
            <HandleMatchesButton />
          </Div>
        <Div px={customTheme.spacing.medium}>
          <Text
            fontSize={customTheme.fontSize.medium}
            fontFamily="NotoSans-Italic"
          >
            Mis partidos
          </Text>
          <Div style={{ gap: scale(16) }}>
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
        </Div>
        <Div minH={verticalScale(150)}>
        </Div>
      </ScrollView>
    </Div>
  );
};

export default HomeScreen;
