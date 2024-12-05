import React, { useCallback } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Match from "../types/match.type";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import SimpleMatchCard from "../components/cards/matchCard";
import useFetch from "../hooks/useGet";
import { QUERY_KEYS } from "../types/query.types";
import Header from "../components/header";
import { Div, Text } from "react-native-magnus";
import { customTheme } from "../utils/theme";
import { scale, verticalScale } from "react-native-size-matters";
import MatchService from "../service/match.service";

const AllMatches: React.FC<AppScreenProps<AppScreens.ALL_MATCHES>> = () => {
  const fetchAllAvailableMatches = async () => {
    const response = await MatchService.getAllAvailable();
    return response;
  };

  const {
    data: matches = [], // Valores predeterminados para evitar undefined
    isLoading,
    error: matchError,
    refetch,
    isFetching,
    isFetched,
  } = useFetch<Match[]>({
    fn: fetchAllAvailableMatches,
    key: [QUERY_KEYS.MATCHES],
    triggerLoader: true, // Si quieres que el loader global refleje el estado de carga
    options: {
      staleTime: 1000 * 60 * 5, // Mantén los datos frescos durante 5 minutos
      retry: 3, // Reintentar hasta 3 veces en caso de error
      refetchOnWindowFocus: false, // Evita el refetch al cambiar de pestaña
    },
    initialData: [], // Lista vacía como datos iniciales
  });

  useFocusEffect(
    useCallback(() => {
      refetch(); // Vuelve a realizar la solicitud de datos cuando se navega a la pantalla
    }, [refetch])
  );

  const renderMatchItem = ({ item }: { item: Match }) => (
    <SimpleMatchCard
      date={item.date}
      location={item.location}
      playersLimit={item.playersLimit}
      playersConfirmed={item.users.length}
      match={item}
      isLoading={isFetching}
      isFetched={isFetched}
    />
  );

  return (
    <Div flex={1} alignItems="center" bg={customTheme.colors.primary} p="lg">
      <Header />

      <Div
        h={verticalScale(115)}
        alignSelf="flex-start"
        p={customTheme.spacing.small}
        mt={scale(60)}
        mb={scale(20)}
      >
        <Text
          color={customTheme.colors.tertiary}
          fontSize="xxl"
          fontFamily={customTheme.fontFamily.bold}
        >
          Sumarse a
        </Text>
        <Text
          color={customTheme.colors.background}
          fontSize="xxl"
          fontFamily={customTheme.fontFamily.bold}
          mt={scale(-40)}
        >
          Partidos
        </Text>
      </Div>

      {isLoading || isFetching ? (
        <ActivityIndicator size="large" color={customTheme.colors.tertiary} />
      ) : matchError ? (
        <Text>Error al obtener los partidos: {matchError.message}</Text>
      ) : matches && matches.length === 0 ? (
        <Text>No hay partidos disponibles</Text>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item._id}
          renderItem={renderMatchItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <Div h={scale(10)} />}
        />
      )}
    </Div>
  );
};

export default AllMatches;
