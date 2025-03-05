import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div, Image, Text } from "react-native-magnus";
import matchService from "../service/match.service";
import useFetch from "../hooks/useGet";
import { QUERY_KEYS } from "../types/query.types";
import { customTheme } from "../utils/theme";
import { ActivityIndicator } from "react-native";
import MatchPrivacyDisplay from "../components/matche/Inputs/matchPrivacyDisplay";
import MatchSchedulerInput from "../components/matche/Inputs/matchScheduler";
import SearchLocationInput from "../components/matche/Inputs/searchLocation";
import { scale } from "react-native-size-matters";

type TabKey = "partido" | "jugadores" | "actividad" | "equipos";

const MatchDetail: React.FC<AppScreenProps<AppScreens.MATCH_DETAIL>> = ({
  route,
}) => {
  const { id } = route.params;

  const [activeTab, setActiveTab] = useState<TabKey>("partido");

  const fetchMatchInfo = async () => {
    const res = await matchService.getById(id);

    return res.data;
  };

  const {
    data: match,
    isFetching,
    error,
  } = useFetch(fetchMatchInfo, [QUERY_KEYS.MATCH]);

  if (isFetching) {
    return (
      <Div justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={customTheme.colors.primary} />
      </Div>
    );
  }

  if (!match || error) {
    return (
      <Div justifyContent="center" alignItems="center">
        <Text color="red">No se pudo cargar la información del partido.</Text>
      </Div>
    );
  }

  const { _id, open, playersLimit, users, date, sportMode, location } = match;
  const playerCount = users?.length || 0;
  const dateObject = new Date(date);

  return (
    <Div flex={1}>
      {/*  pestañas */}
      <Div
        flexDir="row"
        justifyContent="space-around"
        alignItems="center"
        borderBottomWidth={1}
        borderBottomColor="#bbbbbf"
        mb={customTheme.spacing.medium}
        mt={customTheme.spacing.small}
      >
        <TouchableOpacity onPress={() => setActiveTab("partido")}>
          <Text
            bg={
              activeTab === "partido"
                ? customTheme.colors.primary
                : "transparent"
            }
          >
            Partido
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("jugadores")}>
          <Text
            bg={
              activeTab === "jugadores"
                ? customTheme.colors.primary
                : "transparent"
            }
          >
            Jugadores
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("actividad")}>
          <Text
            bg={
              activeTab === "actividad"
                ? customTheme.colors.primary
                : "transparent"
            }
          >
            Actividad
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("equipos")}>
          <Text
            bg={
              activeTab === "equipos"
                ? customTheme.colors.primary
                : "transparent"
            }
          >
            Equipos
          </Text>
        </TouchableOpacity>
      </Div>
      <ScrollView style={{ flex: 1 }}>
        {activeTab === "partido" && (
          <Div flex={1}>
            <Div p={customTheme.spacing.small}>
              {/* yttulo */}
              <Div flexDir="row" alignItems="center">
                <Div justifyContent="flex-start" p={customTheme.spacing.small}>
                  <Image
                    source={require("../assets/iconflecha2.png")}
                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                  />
                </Div>
                <Div w="75%" alignItems="center">
                  <Text
                    fontSize={customTheme.fontSize.medium}
                    fontFamily="NotoSans-Variable"
                  >
                    Detalle del partido
                  </Text>
                </Div>
              </Div>
              {/* tipo y cant de jug */}
              <Div
                flexDir="row"
                justifyContent="space-between"
                alignItems="center"
                p={customTheme.spacing.small}
              >
                <Div>
                  <Text
                    fontSize={customTheme.fontSize.large}
                    fontFamily="NotoSans-BoldItalic"
                  >
                    Fútbol 5 {/* hardcodeado{sportMode} */}
                  </Text>
                </Div>
                <Div
                  flexDir="row"
                  justifyContent="center"
                  bg={customTheme.colors.primary}
                >
                  <Image
                    source={require("../assets/iconUser.png")}
                    w={customTheme.fontSize.medium}
                    resizeMode="contain"
                    mr={customTheme.spacing.small}
                  />
                  <Text
                    fontSize={customTheme.fontSize.medium}
                    fontFamily="NotoSans-BoldItalic"
                  >
                    {playerCount}/{playersLimit}
                  </Text>
                </Div>
              </Div>
              {/* privacidad */}
              <Div>
                <MatchPrivacyDisplay isPublic={open} />
              </Div>
              <Div
                mb={customTheme.spacing.small}
                mt={customTheme.spacing.small}
                
                borderTopColor="#bbbbbf"
                borderTopWidth={scale(1)}
              />
              {/* fecha y lugar */}
              <Div mb={customTheme.spacing.small}>
                <MatchSchedulerInput date={dateObject} readOnly />
                <SearchLocationInput readOnly location={location} />
              </Div>
              {/* Bot Invitar / Compartir */}
              <Div >
                <Div
                  p={customTheme.spacing.small}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Button mb={customTheme.spacing.small} bg="black" block>
                    <Image
                      source={require("../assets/iconUserAdd.png")}
                      style={{ width: 20, height: 20, resizeMode: "contain" }}
                    />
                    <Text
                      fontSize={customTheme.fontSize.medium}
                      fontFamily="NotoSans-BoldItalic"
                      ml={customTheme.spacing.small}
                      color="white"
                    >
                      Invitar
                    </Text>
                  </Button>
                  <Div>
                    <Button bg="black" block>
                      <Image
                        source={require("../assets/iconShare.png")}
                        style={{ width: 18, height: 18, resizeMode: "contain" }}
                      />
                      <Text
                        fontSize={customTheme.fontSize.medium}
                        fontFamily="NotoSans-BoldItalic"
                        ml={customTheme.spacing.small}
                        color="white"
                      >
                        Compartir
                      </Text>
                    </Button>
                  </Div>
                </Div>
              </Div>
            </Div>
           
          </Div>
        )}

        {activeTab === "jugadores" && (
          <Div>
            <Text>endeiente </Text>
          </Div>
        )}

        {activeTab === "actividad" && (
          <Div>
            <Text>pendiente</Text>
          </Div>
        )}

        {activeTab === "equipos" && (
          <Div>
            <Text>pendiente</Text>
          </Div>
        )}
      </ScrollView>
       {/* Botones Eliminar / Guardar */}
       <Div justifyContent="flex-end" flex={3} position="absolute" bottom={0}
      left={0}
      right={0}
      bg="black">
              <Div bg="black">
                <Div
                  mb={customTheme.spacing.small}
                  w="100%"
                  borderTopColor="black"
                  borderTopWidth={scale(1)}
                />
                <Div
                  flexDir="row"
                  justifyContent="space-between"
                  p={customTheme.spacing.small}
                >
                  <Button
                    w="48%"
                    bg="white"
                    borderWidth={1}
                    borderColor="black"
                    block
                  >
                    <Text>Eliminar</Text>
                  </Button>
                  <Button w="48%" block bg={customTheme.colors.primary}>
                    <Text color={customTheme.colors.text}>Guardar</Text>
                  </Button>
                </Div>
              </Div>
            </Div>
    </Div>
  );
};

export default MatchDetail;
