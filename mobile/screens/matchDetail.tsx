import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import {
  AppScreenProps,
  AppScreens,
  AppScreensParamList,
} from "../navigation/screens";
import { Button, Div, Image, Overlay, Text } from "react-native-magnus";
import matchService from "../service/match.service";
import useFetch from "../hooks/useGet";
import { QUERY_KEYS } from "../types/query.types";
import { customTheme } from "../utils/theme";
import { ActivityIndicator } from "react-native";
import MatchPrivacyDisplay from "../components/matche/Inputs/matchPrivacyDisplay";
import MatchSchedulerInput from "../components/matche/Inputs/matchScheduler";
import SearchLocationInput from "../components/matche/Inputs/searchLocation";
import { scale } from "react-native-size-matters";
import { useSession } from "../context/authProvider";
import MatchModalHandler from "../components/modal/matchModalHandler";
import Field from "../components/matche/Detail/field";
import PlayerStatusList from "../components/matche/Detail/playerStatusList";
import InviteModal from "../components/modal/invitePlayer";
import { ActivityScreen } from "./activityScreen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Clipboard from "expo-clipboard";
import { useGlobalUI } from "../context/globalUiContext";

type TabKey = "partido" | "jugadores" | "actividad" | "equipos";

type Props = NativeStackScreenProps<
  AppScreensParamList,
  AppScreens.MATCH_DETAIL
>;

const MatchDetail: React.FC<Props> = ({ navigation, route }) => {
  const { id } = route.params;
  const { currentUser } = useSession();
  const [activeTab, setActiveTab] = useState<TabKey>("partido");
  const [visible, setVisible] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const {
    data: match,
    isFetching,
    error,
    refetch,
  } = useFetch(() => matchService.getById(id), [QUERY_KEYS.MATCH]);
  const [isParticipe, setIsParticipe] = useState(false);
  const { showSnackBar } = useGlobalUI();

  function isPlayer() {
    if (!match) return;
    if (currentUser === null || undefined) {
      return;
    }
    if (currentUser) {
      const user = match.data?.users.find((u) => u === currentUser._id);
      if (user) {
        setIsParticipe(true);
      } else {
        setIsParticipe(false);
      }
    }
  }

  useEffect(() => {
    isPlayer();
  }, [match]);

  if (isFetching) {
    return (
      <Div justifyContent="center" alignItems="center" flex={1}>
        <ActivityIndicator size="large" color={customTheme.colors.black} />
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
  const { _id, open, playersLimit, users, date, sportMode, location, user } =
    match.data;
  const playerCount = users?.length || 0;
  const dateObject = new Date(date);
  const isAdmin = user?._id === currentUser?._id; //SI el usuario que creo el partido dejo de existir genera conflictos

  const handleShare = () => {
    const url = `https://miapp.com/match/${id}`;
    Clipboard.setStringAsync(url);
    showSnackBar("success", "Copiado en el portapapeles!");
  };

  return (
    <>
      <MatchModalHandler
        open={visible}
        setOpen={setVisible}
        match={match.data}
        refetch={refetch}
      />
      <Overlay
        visible={deleteModal}
        bg="black"
        style={{ borderWidth: 1, borderColor: "#FFAF26" }}
        p={customTheme.spacing.medium}
      >
        <Text
          my={customTheme.spacing.small}
          p={customTheme.spacing.small}
          color="white"
        >
          ¿Estas seguro que quieres eliminar el partido?
        </Text>
        <Div
          flexDir="row"
          justifyContent="space-between"
          style={{ gap: scale(10) }}
        >
          <Button
            flex={1}
            onPress={() => setDeleteModal(false)}
            borderWidth={1}
            borderColor="white"
            bg="black"
            color="white"
          >
            Cancelar
          </Button>
          <Button flex={1} bg={"#FFAF26"} color="black">
            Eliminar
          </Button>
        </Div>
      </Overlay>
      <Div bg="white" flex={1}>
        <Div
          flexDir="row"
          justifyContent="space-around"
          alignItems="center"
          borderBottomWidth={1}
          borderBottomColor="#bbbbbf"
          mb={customTheme.spacing.small}
          mt={customTheme.spacing.small}
        >
          {isParticipe && (
            <TouchableOpacity
              onPress={() => setActiveTab("partido")}
              style={{
                backgroundColor:
                  activeTab === "partido"
                    ? customTheme.colors.primary
                    : "transparent",
                padding: customTheme.spacing.small,
              }}
            >
              <Text>Partido</Text>
            </TouchableOpacity>
          )}
          {isParticipe && (
            <>
              <TouchableOpacity
                onPress={() => setActiveTab("jugadores")}
                style={{
                  backgroundColor:
                    activeTab === "jugadores"
                      ? customTheme.colors.primary
                      : "transparent",
                  padding: customTheme.spacing.small,
                }}
              >
                <Text>Jugadores</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab("actividad")}
                style={{
                  backgroundColor:
                    activeTab === "actividad"
                      ? customTheme.colors.primary
                      : "transparent",
                  padding: customTheme.spacing.small,
                }}
              >
                <Text>Actividad</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("equipos")}
                style={{
                  backgroundColor:
                    activeTab === "equipos"
                      ? customTheme.colors.primary
                      : "transparent",
                  padding: customTheme.spacing.small,
                }}
              >
                <Text>Armar equipos</Text>
              </TouchableOpacity>
            </>
          )}
        </Div>

        {activeTab === "partido" && (
          <>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 120 }}
            >
              <Div flex={1}>
                <Div>
                  <Div flexDir="column" justifyContent="space-between">
                    <Div
                      flexDir="row"
                      justifyContent="space-between"
                      w="100%"
                      p={customTheme.spacing.small}
                    >
                      <Div>
                        <Text
                          fontSize={customTheme.fontSize.large}
                          fontFamily="NotoSans-BoldItalic"
                        >
                          {sportMode.name}
                        </Text>
                      </Div>
                      <Div
                        flexDir="row"
                        justifyContent="center"
                        bg={customTheme.colors.enabledPlayers}
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
                    {isParticipe && (
                      <Div>
                        <MatchPrivacyDisplay isPublic={open} />
                      </Div>
                    )}
                  </Div>
                  <Div
                    mb={customTheme.spacing.small}
                    mt={customTheme.spacing.small}
                    borderTopColor="#bbbbbf"
                    borderTopWidth={scale(1)}
                  />
                  <Div mb={customTheme.spacing.small}>
                    <MatchSchedulerInput date={dateObject} readOnly />
                    <SearchLocationInput readOnly location={location} />
                  </Div>
                  {isParticipe ? (
                    <Div
                      p={customTheme.spacing.small}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Button
                        mb={customTheme.spacing.small}
                        bg="black"
                        block
                        onPress={() => setInviteOpen(true)}
                      >
                        <Image
                          source={require("../assets/iconUserAdd.png")}
                          style={{
                            width: 20,
                            height: 20,
                            resizeMode: "contain",
                          }}
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
                        <Button
                          bg="white"
                          block
                          borderColor="black"
                          borderWidth={1}
                          onPress={handleShare}
                        >
                          <Image
                            source={require("../assets/iconShare.png")}
                            style={{
                              width: 18,
                              height: 18,
                              resizeMode: "contain",
                              tintColor: "black",
                            }}
                          />
                          <Text
                            fontSize={customTheme.fontSize.medium}
                            fontFamily="NotoSans-BoldItalic"
                            ml={customTheme.spacing.small}
                            color="black"
                          >
                            Compartir
                          </Text>
                        </Button>
                      </Div>
                    </Div>
                  ) : (
                    <Div
                      p={customTheme.spacing.small}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Button mb={customTheme.spacing.small} bg="black" block>
                        <Image
                          source={require("../assets/iconUserAdd.png")}
                          style={{
                            width: 20,
                            height: 20,
                            resizeMode: "contain",
                          }}
                        />
                        <Text
                          fontSize={customTheme.fontSize.medium}
                          fontFamily="NotoSans-BoldItalic"
                          ml={customTheme.spacing.small}
                          color="white"
                        >
                          Solicitar unirse al partido
                        </Text>
                      </Button>
                    </Div>
                  )}
                </Div>
              </Div>
            </ScrollView>
            {isAdmin && (
              <Div
                justifyContent="flex-end"
                flex={3}
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                bg="white"
              >
                <Div>
                  <Div
                    mb={customTheme.spacing.small}
                    w="100%"
                    borderTopColor="rgb(214, 214, 214)"
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
                      onPress={() => setDeleteModal(true)}
                    >
                      <Text fontFamily="NotoSans-BoldItalic">Eliminar</Text>
                    </Button>
                    <Button
                      w="48%"
                      block
                      bg={customTheme.colors.secondaryBackground}
                      onPress={() => setVisible(true)}
                    >
                      <Text
                        color={customTheme.colors.background}
                        fontFamily="NotoSans-BoldItalic"
                      >
                        Editar
                      </Text>
                    </Button>
                  </Div>
                </Div>
              </Div>
            )}
          </>
        )}

        {activeTab === "jugadores" && (
          <Div flex={1}>
            <PlayerStatusList match={match.data} />
          </Div>
        )}

        {activeTab === "actividad" && (
          <Div flex={1}>
            <ActivityScreen match={match.data} />
          </Div>
        )}

        {activeTab === "equipos" && (
          <Div h={"90%"}>
            <Field match={match.data} isAdmin={isAdmin} />
          </Div>
        )}

        {/* Botones Eliminar / Guardar */}
        <Div
          justifyContent="flex-end"
          flex={3}
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          bg="black"
        ></Div>
        <InviteModal open={inviteOpen} setOpen={setInviteOpen} matchId={id} />
      </Div>
    </>
  );
};

export default MatchDetail;
