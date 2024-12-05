import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground } from "react-native";
import { Div, Text, Button } from "react-native-magnus";
import { scale, verticalScale } from "react-native-size-matters";
import { customTheme } from "../../utils/theme";
import Span from "../span";
import dayjs from "dayjs";
import { Skeleton } from "moti/skeleton";

interface Location {
  name: string;
  address: string;
}

interface Emitter {
  name: string;
}

interface PetitionCardProps {
  matchName: string;
  date: string;
  location: Location;
  status: string;
  emitter: Emitter;
  onAccept?: () => void;
  onReject?: () => void;
  isLoading: boolean;
  isFetched: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "accepted":
      return "green700";
    case "declined":
      return "red700";
    case "pending":
    default:
      return "white";
  }
};

const getStatusName = (status: string) => {
  switch (status) {
    case "accepted":
      return "Aceptada";
    case "declined":
      return "Rechazada";
    case "pending":
    default:
      return "Pendiente";
  }
};

const PetitionCard: React.FC<PetitionCardProps> = ({
  date,
  location,
  status,
  emitter,
  onAccept,
  onReject,
  isLoading,
  isFetched,
}) => {
  if (isLoading && !isFetched) {
    return (
      <Div
        w={scale(320)}
        h={verticalScale(190)}
        rounded="xl"
        shadow="sm"
        overflow="hidden"
        borderStyle="solid"
        borderWidth={scale(1)}
        borderColor="#5040A5"
        mt="md"
      >
        <ImageBackground
          source={require("../../assets/petitionImg.png")} // Ruta de la imagen de fondo
          style={{ flex: 1 }}
          resizeMode="cover" // Asegura que la imagen cubra todo el espacio
        >
          <LinearGradient
            colors={["rgba(44, 33, 102, 0.7)", "rgba(88, 66, 204, 0.5)"]} // Colores del gradiente
            style={{
              flex: 1,
              padding: customTheme.spacing.medium,
              borderRadius: customTheme.borderRadius.small,
            }}
          >
            {/* Skeleton para el estado de la petición */}
            <Div position="absolute" right={scale(30)} top={scale(20)}>
              <Skeleton width={80} height={20} radius={4} colorMode="light" />
            </Div>

            {/* Skeleton para la fecha del partido */}
            <Div mb={customTheme.spacing.small}>
              <Skeleton
                width={150}
                height={20}
                radius={4}
                colorMode="light"
                backgroundColor={customTheme.colors.secondary}
              />
            </Div>

            <Div>
              {/* Skeleton para el nombre del partido */}
              <Div mb={customTheme.spacing.small}>
                <Skeleton
                  width={200}
                  height={24}
                  radius={4}
                  colorMode="light"
                  backgroundColor={customTheme.colors.background}
                />
              </Div>

              {/* Skeleton para el nombre de la ubicación */}
              <Div mb={customTheme.spacing.small}>
                <Skeleton
                  width={150}
                  height={20}
                  radius={4}
                  colorMode="light"
                  backgroundColor={customTheme.colors.tertiary}
                />
              </Div>

              {/* Skeleton para la dirección de la ubicación */}
              <Div mb={customTheme.spacing.medium}>
                <Skeleton
                  width={180}
                  height={20}
                  radius={4}
                  colorMode="light"
                  backgroundColor={customTheme.colors.background}
                />
              </Div>

              {/* Skeleton para los botones de aceptar o rechazar */}
              <Div row justifyContent="space-between" mt="lg">
                <Skeleton
                  width={90}
                  height={40}
                  radius={20}
                  colorMode="light"
                  backgroundColor={customTheme.colors.accent}
                />
                <Skeleton
                  width={90}
                  height={40}
                  radius={20}
                  colorMode="light"
                  backgroundColor={customTheme.colors.background}
                />
              </Div>
            </Div>
          </LinearGradient>
        </ImageBackground>
      </Div>
    );
  }
  return (
    <Div
      w={scale(320)}
      h={verticalScale(190)}
      rounded="xl"
      shadow="sm"
      overflow="hidden"
      borderStyle="solid"
      borderWidth={scale(1)}
      borderColor="#5040A5"
      mt="md"
    >
      <ImageBackground
        source={require("../../assets/petitionImg.png")} // Ruta de la imagen de fondo
        style={{ flex: 1 }}
        resizeMode="cover" // Asegura que la imagen cubra todo el espacio
      >
        <LinearGradient
          colors={["rgba(44, 33, 102, 0.7)", "rgba(88, 66, 204, 0.5)"]} // Colores del gradiente
          style={{
            flex: 1, // Ocupar todo el contenedor
            padding: customTheme.spacing.medium, // Agregar padding interno
            borderRadius: customTheme.borderRadius.small, // Para que coincida con los bordes redondeados de Magnus
          }}
        >
          {/* Estado de la petición */}
          <Div position="absolute" flex={1} right={scale(30)} top={scale(20)}>
            <Text
              fontSize="lg"
              color={getStatusColor(status)}
              textAlign="right"
            >
              {getStatusName(status)}
            </Text>
          </Div>

          {/* Fecha del partido */}
          <Span
            fontSize="md"
            color={customTheme.colors.background}
            bg={customTheme.colors.secondary}
          >
            {dayjs(date).format("dddd D [de] MMMM HH:mm")}
          </Span>

          <Div>
            {/* Nombre del partido */}
            <Text
              fontSize={customTheme.fontSize.title}
              fontWeight="bold"
              color={customTheme.colors.background}
              fontFamily="Athiti-Bold"
            >
              {emitter.name}{" "}
              <Text
                fontSize="lg"
                color={customTheme.colors.background}
                fontFamily="Athiti-Bold"
              >
                quiere unisrse al partido
              </Text>
            </Text>

            <Text fontSize="lg" color={customTheme.colors.tertiary}>
              {location.name}
            </Text>

            <Text fontSize="lg" color={customTheme.colors.background}>
              {location.address}
            </Text>

            {/* Botones de aceptar o rechazar solo si la petición está pendiente */}
            {status === "pending" && (
              <Div row justifyContent="space-between" mt="lg">
                <Button
                  bg={customTheme.colors.accent}
                  color="white"
                  onPress={onAccept}
                  rounded="circle"
                  px="xl"
                >
                  Aceptar
                </Button>
                <Button
                  bg={customTheme.colors.background}
                  color={customTheme.colors.text}
                  onPress={onReject}
                  rounded="circle"
                  px="xl"
                >
                  Rechazar
                </Button>
              </Div>
            )}
          </Div>
        </LinearGradient>
      </ImageBackground>
    </Div>
  );
};

export default PetitionCard;
