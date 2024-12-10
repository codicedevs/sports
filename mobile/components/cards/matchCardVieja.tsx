// import { Div, Text } from "react-native-magnus"
// import { scale } from "react-native-size-matters"

// const MatchCard = () => {
//     return (
//         <Div h={'25%'} w={"90%"} flexDir="row" rounded={"2xl"} bg="red" shadow={"2xl"} shadowColor="black">
//             <Div flex={3} justifyContent="center" alignItems="center" roundedTopLeft={"2xl"} roundedBottomLeft={"2xl"} bg="blue">
//                 <Text fontSize={'6xl'}>1</Text>
//                 <Text>FRIDAY</Text>
//                 <Text>8:30 PM</Text>
//             </Div>
//             <Div justifyContent="flex-end" flex={7}>
//                 <Div flex={8} justifyContent="space-evenly" pl={scale(10)}>
//                     <Text>NOMBRE DEL PARTIDO?</Text>
//                     <Text>DETALLE?</Text>
//                 </Div>
//                 <Div flex={2} bg="black" justifyContent="center" pl={scale(10)} roundedBottomRight={"2xl"} >
//                     <Text color="white">LOYAL</Text>
//                 </Div>
//             </Div>
//         </Div>
//     )
// }

// export default MatchCard

import React, { useEffect, useState } from "react";
import { Button, Div, Icon, Text } from "react-native-magnus";
import { customTheme } from "../../utils/theme";
import { scale, verticalScale } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppScreens, AppScreensParamList } from "../../navigation/screens";
import dayjs from "dayjs";
import "dayjs/locale/es";
import Span from "../span";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSession } from "../../context/authProvider";
import { ConfirmationModal } from "../modal/confirmationModal";
import { useGlobalUI } from "../../context/globalUiContext";
import { useMutate } from "../../hooks/useMutate";
import Match from "../../types/match.type";
import { Skeleton } from "moti/skeleton";
import petitionService from "../../service/petition.service";

interface Location {
  name: string;
  address: string;
}

interface MatchCardProps {
  date: string;
  location: Location;
  playersLimit: number;
  playersConfirmed: number;
  match: Match;
  isLoading: boolean;
  isFetched: boolean;
}

type navigationProps = NativeStackNavigationProp<
  AppScreensParamList,
  AppScreens.MATCH_DETAIL_SCREEN
>;

const SimpleMatchCard: React.FC<MatchCardProps> = ({
  date,
  location,
  playersLimit,
  playersConfirmed,
  match,
  isLoading,
  isFetched,
}) => {
  const navigation = useNavigation<navigationProps>();
  const { currentUser } = useSession();
  const { showSnackBar, showModal } = useGlobalUI();
  const [isModalVisible, setModalVisible] = useState(false);
  const [hasSentRequest, setHasSentRequest] = useState(false);

  useEffect(() => {
    // Verificar si ya existe una solicitud para este partido cuando se carga la tarjeta
    const checkExistingRequest = async () => {
      try {
        const existingPetition = await petitionService.getExistingPetition(
          currentUser._id,
          match._id
        );

        // Si se encuentra una petición, actualizamos el estado
        if (existingPetition) {
          setHasSentRequest(true);
        } else {
          setHasSentRequest(false); // Asegurarse de que está en falso si no se encuentra
        }
      } catch (error) {
        console.log(error);
        setHasSentRequest(false); // No hay petición, estado debe ser falso
      }
    };

    checkExistingRequest();
  }, [currentUser._id, match._id]);

  //verificamos si el usuario esta en el partido
  const isUserInMatch = match.users.some(
    (user: any) => user === currentUser._id
  );

  const createPetitionMutation = useMutate(
    async (petitionData: any) => {
      return await petitionService.create(petitionData);
    },
    () => {
      showSnackBar("success", "Tu solicitud ha sido enviada con éxito.");
    },
    (error) => {
      console.error("Error al enviar la solicitud:", error);
      showSnackBar(
        "error",
        "Hubo un problema al enviar tu solicitud. Intenta de nuevo."
      );
    },
    true // Activa el loader mientras se realiza la mutación
  );

  const handleJoinRequest = () => {
    setModalVisible(true); // Mostrar el modal cuando se presiona el botón
  };

  const handleCancelJoin = () => {
    setModalVisible(false); // Ocultar el modal cuando se presiona cancelar
  };

  const handleConfirmJoin = async () => {
    setModalVisible(false);
    const petitionData = {
      emitter: currentUser._id,
      receiver: match.userId,
      match: match._id,
    };
    // Llama a la mutación para crear la petición
    await createPetitionMutation(petitionData);
  };

  const navigateToMatchDetail = () => {
    navigation.navigate(AppScreens.CREATE_MATCH, {
      screen: AppScreens.MATCH_DETAIL_SCREEN,
      params: { matchId: match._id },
    });
  };

  if (isLoading && !isFetched) {
    return (
      <Div
        w={scale(320)}
        h={verticalScale(215)}
        rounded="xl"
        shadow="sm"
        overflow="hidden"
        borderStyle="solid"
        borderWidth={scale(1)}
        borderColor="#5040A5"
        mt="md"
      >
        <ImageBackground
          source={require("../../assets/matchCard.png")} // Ruta de la imagen de fondo
          style={{ flex: 1 }}
          resizeMode="cover" // Asegura que la imagen cubra todo el espacio
        >
          <LinearGradient
            colors={["rgba(44, 33, 102, 0.7)", "rgba(88, 66, 204, 0.7)"]}
            style={{
              flex: 1,
              padding: customTheme.spacing.medium,
              borderRadius: customTheme.borderRadius.small,
            }}
          >
            {/* Skeleton para la fecha */}
            <Div mb={10}>
              <Skeleton
                width={scale(200)}
                height={verticalScale(20)}
                radius={4}
                colorMode="light"
                backgroundColor="#e0e0e0"
              />
            </Div>

            {/* Skeleton para el nombre de la ubicación */}
            <Div mb={10}>
              <Skeleton
                width={scale(150)}
                height={verticalScale(25)}
                radius={4}
                colorMode="light"
                backgroundColor="#e0e0e0"
              />
            </Div>

            {/* Skeleton para la dirección */}
            <Div mb={10}>
              <Skeleton
                width={scale(180)}
                height={verticalScale(20)}
                radius={4}
                colorMode="light"
                backgroundColor="#e0e0e0"
              />
            </Div>

            {/* Skeleton para el texto de jugadores confirmados */}
            <Div mb={10}>
              <Skeleton
                width={scale(220)}
                height={verticalScale(20)}
                radius={4}
                colorMode="light"
                backgroundColor="#e0e0e0"
              />
            </Div>

            {/* Skeleton para el botón de unirse al partido */}
            <Div mt={10}>
              <Skeleton
                width={scale(120)}
                height={verticalScale(30)}
                radius={50}
                colorMode="light"
                backgroundColor="#e0e0e0"
              />
            </Div>
          </LinearGradient>
        </ImageBackground>
      </Div>
    );
  }
  return (
    <Pressable onPress={navigateToMatchDetail}>
      <Div
        w={scale(320)}
        h={verticalScale(215)}
        rounded="xl"
        shadow="sm"
        overflow="hidden"
        borderStyle="solid"
        borderWidth={scale(1)}
        borderColor="#5040A5"
        mt="md"
      >
        <ImageBackground
          source={require("../../assets/matchCard.png")} // Ruta de la imagen de fondo
          style={{ flex: 1 }}
          resizeMode="cover" // Asegura que la imagen cubra todo el espacio
        >
          <LinearGradient
            colors={["rgba(44, 33, 102, 0.7)", "rgba(88, 66, 204, 0.7)"]} // Colores del gradiente
            style={{
              flex: 1, // Ocupar todo el contenedor
              padding: customTheme.spacing.medium, // Agregar padding interno
              borderRadius: customTheme.borderRadius.small, // Para que coincida con los bordes redondeados de Magnus
            }}
          >
            <Span
              fontSize="md"
              color={customTheme.colors.background}
              bg={customTheme.colors.primary}
            >
              {dayjs(date).format("dddd D [de] MMMM HH:mm")}
            </Span>
            <Text
              fontSize="xxl"
              fontWeight="bold"
              color={customTheme.colors.tertiary}
              fontFamily="Athiti-Bold"
            >
              {location.name}
            </Text>
            <Text
              fontSize="xl"
              color={customTheme.colors.background}
              mb="xs"
              mt={scale(-35)}
            >
              {location.address}
            </Text>
            <Text fontSize="md" color={customTheme.colors.background}>
              Jugadores confirmados:{" "}
              <Text color={customTheme.colors.tertiary}>
                {" "}
                {playersConfirmed} / {playersLimit}
              </Text>
            </Text>

            {!isUserInMatch &&
              (!hasSentRequest ? (
                <Button
                  w={scale(120)}
                  h={scale(30)}
                  mt="md"
                  p={0}
                  bg={customTheme.colors.background}
                  rounded="circle"
                  onPress={handleJoinRequest}
                >
                  <Text
                    fontSize="md"
                    fontFamily={customTheme.fontFamily.bold}
                    color={customTheme.colors.text}
                  >
                    Unirse al partido
                  </Text>
                </Button>
              ) : (
                <Div row alignSelf="baseline" p="md">
                  <Icon
                    mr="lg"
                    name="send"
                    fontFamily="FontAwesome"
                    fontSize="xl"
                    color={customTheme.colors.tertiary}
                  />
                  <Text fontSize="lg" color={customTheme.colors.tertiary}>
                    Solicitud enviada
                  </Text>
                </Div>
              ))}

            {/* Modal de confirmación */}
            <ConfirmationModal
              isVisible={isModalVisible}
              onConfirm={handleConfirmJoin}
              onCancel={handleCancelJoin}
              title="Confirmación"
              subTitle="¿Queres solicitarle al DT un puesto en el equipo?"
              confirmText="Aceptar"
              declineText="Cancelar"
            />
          </LinearGradient>
        </ImageBackground>
      </Div>
    </Pressable>
  );
};

export default SimpleMatchCard;
