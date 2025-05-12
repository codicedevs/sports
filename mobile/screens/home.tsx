import React, { useCallback, useEffect } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Div, Text } from "react-native-magnus";
import useFetch from "../hooks/useGet";
import matchService from "../service/match.service";
import { QUERY_KEYS } from "../types/query.types";
import { useSession } from "../context/authProvider";
import { ScrollView } from "react-native-gesture-handler";
import { customTheme } from "../utils/theme";
import UpcomingMatchCard from "../components/cards/UpcomingMatchesCard";
import EventsCard from "../components/cards/EventsCard";
import eventService from "../service/event.service";
import MatchesCards from "../components/cards/MatchesCards";
import { scale, verticalScale } from "react-native-size-matters";
import HandleMatchesButton from "../components/HandleMatchesButton";
import { useFocusEffect } from "@react-navigation/native";
import petitionService from "../service/petition.service";
import Petition from "../types/petition.type";
import MatchInvitation from "../components/cards/InvitationCard";
import MatchesCardSK from "../components/cards/MatchesCardSK";
import UpcomingMatchesCardSK from "../components/cards/UpcomingMatchesCardSK";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const { currentUser, setCurrentUser } = useSession();
  const {
    data: matches,
    refetch,
    isFetching: isFetchingMatches,
  } = useFetch(
    () =>
      matchService.getAll({
        where: {
          "user._id": currentUser._id,
        },
      }),
    [QUERY_KEYS.MATCHES, currentUser]
  );
  const now = new Date().toISOString();
  const {
    data: publicMatches,
    refetch: refetchPublic,
    isFetching: isFetchingPublic,
  } = useFetch(
    () =>
      matchService.getAll({
        where: {
          open: true,
          date: { $gte: now },
        },
      }),
    [QUERY_KEYS.PUBLIC_MATCHES]
  );

  const { data: petitions, refetch: refetchPetition } = useFetch<{
    results: Petition[];
  }>(
    () =>
      petitionService.getAll({
        populate: ["reference.id"],
        where: {
          status: ["pending"],
          receiver: [currentUser._id],
        },
      }),
    [QUERY_KEYS.PETITIONS, currentUser]
  );
  const { data: events } = useFetch(eventService.getAll, [QUERY_KEYS.EVENTS]);

  const handleActionCompleted = () => {
    refetchPetition();
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchPetition();
      refetchPublic();
    }, [])
  );
  // const { currentUser } = useSession()
  // const queryClient = useQueryClient()
  // const lastUpdatedAtRef = useRef<string | null>(null)
  // const { data: matches, refetch } = useFetch(() => matchService.getAll({
  //   where: {
  //     "user._id": currentUser._id
  //   }
  // }), [QUERY_KEYS.MATCHES, currentUser]);
  // const now = new Date().toISOString();
  // //Busco todas las matches LA PRIMERA VEZ
  // const { data: publicMatches, refetch: refetchPublic } = useFetch(() => matchService.getAll({
  //   where: {
  //     "open": true,
  //     "date": { $gte: now }
  //   }
  // }), [QUERY_KEYS.PUBLIC_MATCHES],
  //   () => {
  //     lastUpdatedAtRef.current = new Date().toISOString()
  //   }
  //   ,
  //   {
  //     options: {
  //       staleTime: "infinity"
  //     }
  //   }
  // );

  // FUNCION UPDATE QUE CHEQUEA SI HAY CAMBIOS EN LA INFORMACION SI HAY LOS AGREGA Y SI NO NADA
  // const { data } = useFetch(
  //   async () => {
  //     if (!lastUpdatedAtRef.current) {
  //       return Promise.resolve([]);
  //     } else {
  //       return matchService.getAll({
  //         where: {date: { $gt: lastUpdatedAtRef.current }}
  //       });
  //     }
  //   },
  //   [QUERY_KEYS.PUBLIC_MATCHES, "UPDATES"],
  //   (newItems) => {
  //     if (newItems.length > 0) {
  //       queryClient.setQueryData(['items'], (oldItems: any[] = []) => {
  //         const merged = [...newItems, ...oldItems].filter(
  //           (item, index, self) =>
  //             index === self.findIndex((i) => i.id === item.id)
  //         )
  //         return merged
  //       })
  //     }
  //     lastUpdatedAtRef.current = new Date().toISOString()
  //   },
  //   {
  //     options: { enabled: false }
  //   }
  // );

  //   const updateQuery = useQuery({
  //     queryKey: [QUERY_KEYS.PUBLIC_MATCHES, 'updates'],
  //     queryFn: async () => {
  //       if (!lastUpdatedAtRef.current) return []

  //       return await matchService.getAll({
  //         where: { date: { $gt: lastUpdatedAtRef.current } }
  //       })
  //     },
  //     enabled: false, // run manually
  //     meta: {
  //       onSuccess: (newItems) => {
  //         if (newItems.length > 0) {
  //           queryClient.setQueryData([QUERY_KEYS.PUBLIC_MATCHES], (oldItems: any[] = []) => {
  //             const merged = [...newItems, ...oldItems].filter(
  //               (item, index, self) =>
  //                 index === self.findIndex((i) => i.id === item.id) // remove duplicates
  //             )
  //             return merged
  //           })
  //           lastUpdatedAtRef.current = new Date().toISOString()
  //         }
  //       }
  //     }
  //   })
  //   const { data: petitions, refetch: refetchPetition } = useFetch<{ results: Petition[] }>(() => petitionService.getAll(
  // 123,
  //     {
  //       populate: ["reference.id"],
  //       where: {
  //         status: ['pending'],
  //         receiver: [currentUser._id]
  //       }
  //     }

  //   ), [QUERY_KEYS.PETITIONS, currentUser]);
  //   const { data: events } = useFetch(eventService.getAll, [QUERY_KEYS.EVENTS]); // pa hacer la llamada

  //   useFocusEffect(
  //     useCallback(() => {
  //       // refetch();
  //       // refetchPetition();
  //       // refetchPublic()

  //       updateQuery.refetch()

  const loadSession = async () => {
    const [accessToken, refreshToken, userJson] = await AsyncStorage.multiGet([
      "@access_token",
      "@refresh_token",
      "@user",
    ]);

    if (accessToken[1] && userJson[1]) {
      const user = JSON.parse(userJson[1]);
      setCurrentUser(user);
      // Podés también setear los tokens a algún contexto si los usás globalmente
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const fallbackEvent = {
    name: "TORNEO DE VERANO FUTBOL VETERANO", // pa hardcodear
    date: "12/3",
  };

  const NoMatchesMessage = (
    { message }: { message: string } // si no hay partidos
  ) => (
    <Div alignItems="center" mt={customTheme.spacing.medium}>
     
      <Text
        fontSize={customTheme.fontSize.medium}
        color={customTheme.colors.gray}
        textAlign="center"
        mt={customTheme.spacing.small}
      >
        {message}
      </Text>
    </Div>
  );

  return (
    <Div bg="white">
      <ScrollView>
        <Div pb={customTheme.spacing.medium} px={customTheme.spacing.medium}>
          <Div mb={customTheme.spacing.medium}>
            {currentUser && petitions && petitions.totalCount !== 0 && (
              <MatchInvitation
                date={petitions.results[0]?.reference?.id.date}
                time={petitions.results[0]?.reference.id.hour?.toString()}
                title={petitions.results[0]?.reference.id.name}
                matchType={petitions.results[0]?.reference.type}
                petition={petitions.results[0]}
                onActionCompleted={handleActionCompleted}
              />
            )}
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
          {!publicMatches ? (
            <Div flexDir="row">
              <UpcomingMatchesCardSK />
              <UpcomingMatchesCardSK />
            </Div>
          ) : publicMatches?.results?.length === 0 ? (
            <NoMatchesMessage message="No hay próximos partidos públicos." />
          ) : (
            <ScrollView horizontal>
              {publicMatches?.results
                ?.sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((u: any) => (
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
          )}
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
            {!matches ? (
              <MatchesCardSK />
            ) : matches?.results?.length === 0 ? (
              <NoMatchesMessage message="No tienes partidos creados." />
            ) : (
              <Div style={{ gap: scale(16) }}>
                {matches?.results
                  ?.sort(
                    (a: any, b: any) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                  )
                  .map((m: any) => (
                    <MatchesCards
                      key={m._id}
                      matchId={m._id}
                      dayOfWeek={m.dayOfWeek}
                      date={m.date}
                      time={m.hour}
                      location={m.location}
                      players={m.users}
                      maxPlayers={m.playersLimit}
                      sportMode={m.sportMode}
                    />
                  ))}
              </Div>
            )}
          </Div>
        )}
        <Div minH={verticalScale(150)}></Div>
      </ScrollView>
    </Div>
  );
};

export default HomeScreen;
