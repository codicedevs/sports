import React from "react";
import { FlatList } from "react-native";
import useFetch from "../hooks/useGet";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import userService from "../service/user.service";
import { QUERY_KEYS } from "../types/query.types";
import { useSession } from "../context/authProvider";
import Petition from "../types/petition.type";
import PetitionCard from "../components/cards/petitionCard";
import { Div, Text } from "react-native-magnus";
import Header from "../components/header";
import { useMutate } from "../hooks/useMutate";
import petitionService from "../service/petition.service";
import { useQueryClient } from "@tanstack/react-query";
import { useGlobalUI } from "../context/globalUiContext";
import { customTheme } from "../utils/theme";
import { scale, verticalScale } from "react-native-size-matters";

const PetitionsScreen: React.FC<
  AppScreenProps<AppScreens.PETITIONS_SCREEN>
> = ({ navigation }) => {
  const { currentUser } = useSession();
  const queryClient = useQueryClient();
  const { showSnackBar, showModal } = useGlobalUI(); // Usamos el contexto global para snackbar y modal

  // traemos las peticiones del usuario
  const {
    data: petitions = [], // Valor predeterminado como un array vacío
    error: petitionError,
    isFetching,
    isFetched,
  } = useFetch<Petition[]>({
    fn: () => userService.getUserPetitions(currentUser?._id), // Función para obtener las peticiones del usuario
    key: [QUERY_KEYS.PETITIONS, currentUser?._id], // Clave única, incluye el ID del usuario
    triggerLoader: true, // Activa el loader global si es necesario
    options: {
      staleTime: 1000 * 60 * 10, // Los datos son frescos por 10 minutos
      cacheTime: 1000 * 60 * 30, // Cachea los datos por 30 minutos
      enabled: !!currentUser?._id, // Solo ejecuta si el ID del usuario está definido
      retry: 3, // Reintenta hasta 3 veces en caso de error
    },
    initialData: [], // Datos iniciales como un array vacío
  });

  // Filtramos solo las peticiones con status "pending"
  const pendingPetitions = petitions?.filter(
    (petition) => petition.status === "pending"
  );

  const acceptPetition = useMutate(
    (petitionId: string) => petitionService.acceptPetition(petitionId),
    () => {
      showModal("success", "Solicitud aceptada");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PETITIONS] });
    },
    (error) => {
      showSnackBar("error", "Error al aceptar la solicitud.");
      console.log("error al acptar la solicitud", error);
    }
  );

  const rejectPetition = useMutate(
    (petitionId: string) => petitionService.declinePetition(petitionId),
    () => {
      showModal("error", "Solicitud rechazada");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PETITIONS] });
    },
    (error) => {
      showSnackBar("error", "Error al rechazar la solicitud");
      console.error("Error al rechazar la petición", error);
    }
  );

  const handleAcceptPetition = (petitionId: string) => {
    acceptPetition(petitionId);
  };

  const handleRejectPetition = (petitionId: string) => {
    rejectPetition(petitionId);
  };

  const renderPetitionItem = ({ item }: { item: Petition }) => (
    <PetitionCard
      matchName={item.match.name} // Muestra el nombre del partido al que se refiere la petición
      date={item.match.date}
      location={item.match.location}
      status={item.status}
      emitter={item.emitter}
      onAccept={() => handleAcceptPetition(item._id)}
      onReject={() => handleRejectPetition(item._id)}
      isLoading={isFetching}
      isFetched={isFetched}
    />
  );

  return (
    <>
      <Div
        flex={1}
        justifyContent="flex-start"
        p="lg"
        bg={customTheme.colors.primary}
      >
        <Header />

        <Div
          mt={scale(60)}
          h={verticalScale(110)}
          alignSelf="flex-start"
          p={customTheme.spacing.small}
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
            Solicitudes
          </Text>
        </Div>

        {pendingPetitions && pendingPetitions.length > 0 ? (
          <FlatList
            data={pendingPetitions} // Mostramos solo las peticiones filtradas
            renderItem={renderPetitionItem}
            keyExtractor={(item) => item._id}
          />
        ) : (
          <Text color={customTheme.colors.background}>
            No tienes solicitudes pendientes.
          </Text>
        )}
      </Div>
    </>
  );
};

export default PetitionsScreen;
