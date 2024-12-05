import React, { useState } from "react";
import { Div, Text } from "react-native-magnus";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { customTheme } from "../utils/theme";
import MatchInfo from "../components/matchDetail/matchInfo";
import MatchPlayers from "../components/matchDetail/matchPlayers";
import Header from "../components/header";
import { scale, verticalScale } from "react-native-size-matters";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import matchService from "../service/match.service";
import useFetch from "../hooks/useGet";
import { QUERY_KEYS } from "../types/query.types";
import Match from "../types/match.type";
import { useFocusEffect } from "@react-navigation/native";
import { Skeleton } from "moti/skeleton";

const MatchDetailScreen: React.FC<
  AppScreenProps<AppScreens.MATCH_DETAIL_SCREEN>
> = ({ route }) => {
  const [selectedTab, setSelectedTab] = useState("info");

  // Obtener los parámetros de navegación
  const { matchId } = route.params; // Obtener el partido de los parámetros

  // Usar el hook useFetch para obtener el partido
  const {
    data: match,
    error,
    isLoading,
    refetch,
  } = useFetch<Match>({
    fn: () => matchService.findOne(matchId), // La función para obtener los datos del partido
    key: [QUERY_KEYS.MATCHES, matchId], // Clave única de consulta
    triggerLoader: true, // Activa el loader global
    options: {
      retry: 2, // Reintenta la consulta en caso de error, máximo 2 veces
      staleTime: 1000 * 60, // Mantén los datos frescos por 1 minuto
      cacheTime: 1000 * 60 * 5, // Cachea los datos por 5 minutos
      refetchOnWindowFocus: false, // No actualices automáticamente al cambiar de pestaña
    },
  });
  // Refetch al ganar el foco de la pantalla
  useFocusEffect(() => {
    refetch(); // Refetch los datos del partido cuando la pantalla está activa
  });

  // Mostrar un spinner de carga mientras los datos están siendo obtenidos
  if (isLoading) {
    return (
      <Div
        flex={1}
        justifyContent="center"
        alignItems="center"
        p="lg"
        bg={customTheme.colors.primary}
      >
        {/* Skeleton Header */}
        <Div mb="md" w="100%" alignItems="center">
          <Skeleton
            width={scale(320)}
            height={30}
            colorMode="light"
            backgroundColor="#e0e0e0"
          />
        </Div>

        {/* Skeleton Tabs */}
        <Div flexDir="row" justifyContent="space-around" mb="lg" w="100%">
          <Skeleton
            width={scale(100)}
            height={30}
            colorMode="light"
            backgroundColor="#e0e0e0"
          />
          <Skeleton
            width={scale(100)}
            height={30}
            colorMode="light"
            backgroundColor="#e0e0e0"
          />
        </Div>

        {/* Skeleton del Mapa */}
        <Div mb="lg" w="100%" alignItems="center">
          <Skeleton
            width="90%"
            height={verticalScale(240)}
            colorMode="light"
            backgroundColor="#e0e0e0"
          />
        </Div>

        {/* Skeleton Content */}
        <Div w="100%" alignItems="center">
          {Array.from({ length: 5 }).map((_, index) => (
            <Div key={index} mb="lg" w="90%">
              <Skeleton
                width="100%"
                height={20}
                colorMode="light"
                backgroundColor="#e0e0e0"
              />
            </Div>
          ))}
        </Div>
      </Div>
    );
  }

  // Si hay un error, mostramos un mensaje de error
  if (error) {
    return (
      <Div flex={1} justifyContent="center" alignItems="center">
        <Text color="red" fontSize="lg">
          {error.message || "Error al cargar el partido"}
        </Text>
      </Div>
    );
  }

  return (
    <Div flex={1} bg={customTheme.colors.primary} p="lg">
      <Header />
      {/* Pestañas */}
      <Div flexDir="row" w={"100%"}>
        <Div
          flex={1}
          justifyContent="space-around"
          mb="lg"
          mt={scale(80)}
          borderBottomWidth={2}
          borderBottomColor={
            selectedTab === "info" ? customTheme.colors.tertiary : "gray600" // Solo se muestra el borde cuando está seleccionada
          }
        >
          <TouchableOpacity onPress={() => setSelectedTab("info")}>
            <Text
              textAlign="center"
              fontSize="lg"
              fontWeight="bold"
              color={
                selectedTab === "info" ? customTheme.colors.tertiary : "gray600"
              }
            >
              Info de Partido
            </Text>
          </TouchableOpacity>
        </Div>

        <Div
          flex={1}
          justifyContent="space-around"
          mb="lg"
          mt={scale(80)}
          borderBottomWidth={2}
          borderBottomColor={
            selectedTab === "players" ? customTheme.colors.tertiary : "gray600" // Solo se muestra el borde cuando está seleccionada
          }
        >
          <TouchableOpacity onPress={() => setSelectedTab("players")}>
            <Text
              textAlign="center"
              fontSize="lg"
              fontWeight="bold"
              color={
                selectedTab === "players"
                  ? customTheme.colors.tertiary
                  : "gray600"
              }
            >
              Jugadores
            </Text>
          </TouchableOpacity>
        </Div>
      </Div>
      {/* Renderizado condicional basado en la pestaña seleccionada */}
      <Div flex={1}>
        {selectedTab === "info" ? (
          <MatchInfo match={match} />
        ) : (
          <MatchPlayers players={match.users} match={match} />
        )}
      </Div>
    </Div>
  );
};

export default MatchDetailScreen;
