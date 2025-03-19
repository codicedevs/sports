import React, { useEffect, useRef, useState } from "react";
import { ScrollView, TouchableOpacity, View, StyleSheet } from "react-native";
import { Div, Text } from "react-native-magnus";
import { verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { MatchDetails } from "../types/form.type";
import matchService from "../service/match.service";
import { customTheme } from "../utils/theme";
import { Accordion } from "../components/collapsibleView";
import SportInput from "../components/matche/Inputs/sport";
import PlayersCounterInput from "../components/matche/Inputs/playersCounter";
import MatchPrivacyToggleInput from "../components/matche/Inputs/matchPrivacyToggle";
import MatchSchedulerInput from "../components/matche/Inputs/matchScheduler";
import SearchLocationInput from "../components/matche/Inputs/searchLocation";

interface MatchHandlerScreenProps {
  match?: string;
  onMatchCreated?: (matchId: string) => void;
}

export default function MatchHandlerScreen({
  match,
  onMatchCreated,
}: MatchHandlerScreenProps) {
  const navigation = useNavigation();
  const [openId, setOpenId] = useState<null | string>(null);

  // Objeto con la info del partido a crear/editar
  const matchDetailsRef = useRef<MatchDetails>({
    selectedSport: null,
    selectedSportMode: null,
    playerLimit: 0,
    privacyOption: false,
    matchDate: undefined,
    location: null,
  });

  useEffect(() => {
    if (match) {
      fetchMatch();
    }
  }, [match]);

  async function fetchMatch() {
    if (!match) return;
    try {
      const res = await matchService.getById(match);
      // Ajusta según la forma real de la respuesta
      matchDetailsRef.current.selectedSport = res.data.sportMode?.sport || null;
      matchDetailsRef.current.selectedSportMode = res.data.sportMode || null;
      matchDetailsRef.current.playerLimit = res.data.playersLimit || 0;
      matchDetailsRef.current.privacyOption = res.data.open || false;
      matchDetailsRef.current.matchDate = res.data.date;
      matchDetailsRef.current.location = res.data.location || null;
    } catch (e) {
      console.error("Error al fetchMatch:", e);
    }
  }

  async function createMatch() {
    try {
      const res = await matchService.create({
        name: "Prueba3",
        date: matchDetailsRef.current.matchDate,
        location: matchDetailsRef.current.location?._id,
        playersLimit: matchDetailsRef.current.playerLimit,
        userId: "66e482584509915a15968bd7",
        sportMode: "67c873ffeb647cc591249358",
        open: matchDetailsRef.current.privacyOption,
      });
      const createdMatchId = res.data._id;
      if (onMatchCreated) {
        onMatchCreated(createdMatchId);
      }
      closeScreen();
    } catch (e) {
      console.error("Error al crear el partido:", e);
    }
  }

  async function editMatch() {
    try {
      const res = await matchService.update("67af556cb453684f313e9a4b", {
        name: "Prueba3",
        date: matchDetailsRef.current.matchDate,
        location: matchDetailsRef.current.location?._id,
        playersLimit: matchDetailsRef.current.playerLimit,
        userId: "6720ef0e3a78ebc10564e979",
        sportMode: matchDetailsRef.current.selectedSportMode?._id,
        open: matchDetailsRef.current.privacyOption,
      });
      console.log("Partido editado:", res);
    } catch (e) {
      console.error("Error al editar el partido:", e);
    }
  }

  const handleAction = () => {
    if (!match) {
      createMatch();
    } else {
      editMatch();
    }
  };

  function closeScreen() {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      {/* Header con botón de cerrar */}
      {/* <Div
        p="md"
        bg={customTheme.colors.primary}
        flexDir="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text
          color="white"
          fontSize="xl"
          fontFamily="NotoSans-Variable"
        >
          {match ? "Editar Partido" : "Crear Partido"}
        </Text>
        <TouchableOpacity onPress={closeScreen}>
          <Text color="white" fontSize="md">
            Cerrar
          </Text>
        </TouchableOpacity>
      </Div> */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Div
          flex={1}
          style={{ gap: verticalScale(16) }}
          bg={customTheme.colors.background}
          p={customTheme.spacing.medium}
        >
          <Accordion
            id="Deportes"
            openId={openId}
            setOpenId={setOpenId}
            title="Deporte"
            rightText="Futbol 5"
            size={342}
          >
            <SportInput matchDetailsRef={matchDetailsRef} />
          </Accordion>
          <Accordion
            id="PlayerInput"
            openId={openId}
            setOpenId={setOpenId}
            title="Cupo"
            rightText="Agrega participantes"
            size={123}
          >
            <PlayersCounterInput matchDetailsRef={matchDetailsRef} />
          </Accordion>
          <Accordion
            id="PrivacyToggle"
            openId={openId}
            setOpenId={setOpenId}
            title="Privacidad"
            rightText="Privada"
            size={134}
          >
            <MatchPrivacyToggleInput matchDetailsRef={matchDetailsRef} />
          </Accordion>
          <Div borderBottomWidth={1} borderBottomColor={customTheme.colors.gray} />
          <Text
            fontSize={customTheme.fontSize.medium}
            color={customTheme.colors.gray}
            fontFamily="NotoSans-Variable"
          >
            Campos no obligatorios para crear
          </Text>
          <Accordion
            id="Horario"
            openId={openId}
            setOpenId={setOpenId}
            title="Horario"
            rightText="A definir"
            size={802}
          >
            <MatchSchedulerInput matchDetailsRef={matchDetailsRef} />
          </Accordion>
          <Accordion
            id="Busqueda"
            openId={openId}
            setOpenId={setOpenId}
            title="¿Donde juegan?"
            rightText="A definir"
            size={300}
          >
            <SearchLocationInput matchDetailsRef={matchDetailsRef} />
          </Accordion>
        </Div>
      </ScrollView>
      <Div
        justifyContent="center"
        bg="#151515E5"
        h={verticalScale(80)}
        p={customTheme.spacing.medium}
      >
        <TouchableOpacity onPress={handleAction}>
          <Div
            h={verticalScale(45)}
            justifyContent="center"
            bg={customTheme.colors.primary}
          >
            <Text textAlign="center" color="black">
              {!match ? "Crear" : "Editar"}
            </Text>
          </Div>
        </TouchableOpacity>
      </Div>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
