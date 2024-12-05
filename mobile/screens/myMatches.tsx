import { useState } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Div, Text } from "react-native-magnus";
import Header from "../components/header";
import { customTheme } from "../utils/theme";
import { FlatList, TouchableOpacity } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useSession } from "../context/authProvider";
import userService from "../service/user.service";
import useFetch from "../hooks/useGet";
import SimpleMatchCard from "../components/cards/matchCard";
import { QUERY_KEYS } from "../types/query.types";
import Match from "../types/match.type";

const MyMatchesScreen: React.FC<AppScreenProps<AppScreens.MY_MATCHES>> = ({
  route,
  navigation,
}) => {
  const { currentUser } = useSession();
  const [selectedTab, setSelectedTab] = useState("active");

  const userId = currentUser._id;

  const getAllMyMatches = async () => {
    const res = await userService.getUserMatches(userId);
    return res.data;
  };

  // Traemos todos los partidos del usuario
  const {
    data: matches = [], // Valor predeterminado para evitar undefined
    isFetching,
    isFetched,
    isLoading,
    error: matchError,
  } = useFetch<Match[]>({
    fn: getAllMyMatches, // Función para obtener los partidos
    key: [QUERY_KEYS.MATCHES], // Clave única de consulta
    triggerLoader: true, // Activa el loader global si es necesario
    options: {
      staleTime: 1000 * 60 * 5, // Datos frescos durante 5 minutos
      refetchOnWindowFocus: true, // Habilita la actualización automática al enfocar la ventana
      cacheTime: 1000 * 60 * 10, // Cachea los datos durante 10 minutos
      retry: 3, // Reintenta hasta 3 veces en caso de error
    },
    initialData: [], // Proporciona un array vacío como datos iniciales
  });

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

  // Filtrar los partidos según la pestaña seleccionada
  const filteredMatches = matches.filter((match) => {
    if (selectedTab === "active") {
      return new Date(match.date) > new Date(); // Partidos que no han ocurrido
    } else if (selectedTab === "finished") {
      return new Date(match.date) <= new Date(); // Partidos finalizados
    } else {
      return true; // Mostrar todos los partidos
    }
  });

  return (
    <Div flex={1} bg={customTheme.colors.primary} p="lg">
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
          Tus
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

      {/* Pestañas */}
      <Div flexDir="row" w={"100%"} alignItems="center">
        <Div
          flex={1}
          justifyContent="space-around"
          mb="lg"
          borderBottomWidth={2}
          borderBottomColor={
            selectedTab === "active" ? customTheme.colors.tertiary : "gray600" // Solo se muestra el borde cuando está seleccionada
          }
        >
          <TouchableOpacity onPress={() => setSelectedTab("active")}>
            <Text
              textAlign="center"
              fontSize="lg"
              fontWeight="bold"
              color={
                selectedTab === "active"
                  ? customTheme.colors.tertiary
                  : "gray600"
              }
            >
              Activos
            </Text>
          </TouchableOpacity>
        </Div>

        <Div
          flex={1}
          justifyContent="space-around"
          mb="lg"
          borderBottomWidth={2}
          borderBottomColor={
            selectedTab === "all" ? customTheme.colors.tertiary : "gray600" // Solo se muestra el borde cuando está seleccionada
          }
        >
          <TouchableOpacity onPress={() => setSelectedTab("all")}>
            <Text
              textAlign="center"
              fontSize="lg"
              fontWeight="bold"
              color={
                selectedTab === "all" ? customTheme.colors.tertiary : "gray600"
              }
            >
              Todos
            </Text>
          </TouchableOpacity>
        </Div>

        <Div
          flex={1}
          justifyContent="space-around"
          mb="lg"
          borderBottomWidth={2}
          borderBottomColor={
            selectedTab === "finished" ? customTheme.colors.tertiary : "gray600" // Solo se muestra el borde cuando está seleccionada
          }
        >
          <TouchableOpacity onPress={() => setSelectedTab("finished")}>
            <Text
              textAlign="center"
              fontSize="lg"
              fontWeight="bold"
              color={
                selectedTab === "finished"
                  ? customTheme.colors.tertiary
                  : "gray600"
              }
            >
              Finalizados
            </Text>
          </TouchableOpacity>
        </Div>
      </Div>
      {/* Mostrar partidos filtrados según la pestaña seleccionada */}
      <Div flex={1}>
        {isLoading || isFetching ? (
          <Text>Cargando partidos...</Text> // Mostrar estado de carga
        ) : matchError ? (
          <Text>Error al obtener los partidos: {matchError.message}</Text> // Mostrar error si ocurre
        ) : filteredMatches.length === 0 ? (
          <Text color={customTheme.colors.background}>
            No hay partidos en esta categoría
          </Text> // Mostrar si no hay partidos
        ) : (
          <FlatList
            data={filteredMatches} // Partidos filtrados
            keyExtractor={(item) => item._id}
            renderItem={renderMatchItem}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <Div h={scale(10)} />} // Espaciado entre ítems
          />
        )}
      </Div>
    </Div>
  );
};

export default MyMatchesScreen;
