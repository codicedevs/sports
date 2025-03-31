import React, { useCallback } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Div, Text } from "react-native-magnus";
import useFetch from "../hooks/useGet";
import matchService from "../service/match.service";
import { QUERY_KEYS } from "../types/query.types";
import { useSession } from "../context/authProvider";
import { ScrollView } from "react-native-gesture-handler";
import { customTheme } from "../utils/theme";
import UpcomingMatchCard from "../components/cards/UpcomingMatchesCard";
import EventsCard from "../components/cards/eventsCard";
import eventService from "../service/event.service";
import MatchesCards from "../components/cards/matchesCards";
import { scale, verticalScale } from "react-native-size-matters";
import HandleMatchesButton from "../components/handleMatchesButton";
import { useFocusEffect } from "@react-navigation/native";
import petitionService from "../service/petition.service";
import Petition from "../types/petition.type";
import MatchInvitation from "../components/cards/invitationCard";


const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const { currentUser } = useSession()
  const { data: matches, refetch } = useFetch(() => matchService.getAll({
    where: {
      "user._id": currentUser._id
    }
  }), [QUERY_KEYS.MATCHES, currentUser]);
  const now = new Date().toISOString();
  const { data: publicMatches, refetch: refetchPublic } = useFetch(() => matchService.getAll({
    where: {
      "open": true,
      "date": { $gte: now }
    }
  }), [QUERY_KEYS.PUBLIC_MATCHES]);

  const { data: petitions, refetch: refetchPetition } = useFetch<{ results: Petition[] }>(() => petitionService.getAll(

    {
      populate: ["reference.id"],
      where: {
        status: ['pending'],
        receiver: [currentUser._id]
      }
    }

  ), [QUERY_KEYS.PETITIONS, currentUser]);
  const { data: events } = useFetch(eventService.getAll, [QUERY_KEYS.EVENTS]); // pa hacer la llamada

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchPetition();
      refetchPublic()
    }, [])
  );
  
  const fallbackEvent = {
    name: "TORNEO DE VERANO FUTBOL VETERANO", // pa hardcodear
    date: "12/3",
  };

  return (
    <Div>
      <ScrollView>
        <Div p={customTheme.spacing.medium}>
          <Div mb={customTheme.spacing.medium}>
            {
              (currentUser && petitions) &&
              (
                petitions.totalCount !== 0 &&
                <MatchInvitation date={petitions.results[0]?.reference?.id.date} time="10" title="Stalagol" matchType={petitions.results[0]?.reference.type} petition={petitions.results[0]} />
              )
            }
          </Div>
          <Div mb={customTheme.spacing.medium}>
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
            {publicMatches?.results?.map((u: any) => (
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
        {currentUser && (
          <Div px={customTheme.spacing.medium}>
            <Text
              fontSize={customTheme.fontSize.medium}
              fontFamily="NotoSans-Italic"
            >
              Mis partidos
            </Text>
            <Div style={{ gap: scale(16) }}>
              {matches?.results?.map((m: any) => (
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
        )}
        <Div minH={verticalScale(150)}></Div>
      </ScrollView>
    </Div>
  );
};

export default HomeScreen;
