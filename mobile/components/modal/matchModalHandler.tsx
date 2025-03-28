import React, { useEffect, useRef, useState } from "react";
import { Div, Text, Modal } from "react-native-magnus";
import { verticalScale } from "react-native-size-matters";
import { ScrollView, TouchableOpacity } from "react-native";
import { customTheme } from "../../utils/theme";
import { Accordion } from "../collapsibleView";
import PlayersCounterInput from "../matche/Inputs/playersCounter";
import SportInput from "../matche/Inputs/sport";
import MatchPrivacyToggleInput from "../matche/Inputs/matchPrivacyToggle";
import MatchSchedulerInput from "../matche/Inputs/matchScheduler";
import SearchLocationInput from "../matche/Inputs/searchLocation";
import { MatchDetails } from "../../types/form.type";
import matchService from "../../service/match.service";
import { QueryObserverResult } from "@tanstack/react-query";
//falta hacer un cambio que se muestre bien los datos actuales, estan hardcodeados
/* =======================================
   1) Declaramos la interfaz de props,
      incluyendo onMatchCreated
   ======================================= */
interface MatchModalHandlerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  match?: string;
  refetch?: () => Promise<QueryObserverResult<any, Error>>;
  onMatchCreated?: (matchId: string) => void; // <-- MARCADO: Agregamos prop opcional
}

export default function MatchModalHandler({
  open,
  setOpen,
  match,
  refetch,
  onMatchCreated, // <-- MARCADO: desestructuramos
}: MatchModalHandlerProps) {
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
      const res = await matchService.getById(match._id);
      // Ajusta según la forma real de la respuesta
      matchDetailsRef.current.selectedSport = res.data.sportMode?.sport || null;
      matchDetailsRef.current.selectedSportMode = res.data.sportMode || null;
      matchDetailsRef.current.playerLimit = res.data.playersLimit || 0;
      matchDetailsRef.current.privacyOption = res.data.open || false;
      matchDetailsRef.current.matchDate = res.data.date;
      matchDetailsRef.current.location = res.data.location || null;
    } catch (e) {
      console.error("Error al fetchMatch:", e);
      console.log(e);
    }
  }

  /* =======================================
     3) Función para crear el partido:
        si onMatchCreated existe, se llama
     ======================================= */
  async function createMatch() {
    try {
      console.log(1);
      
      const res = await matchService.create({
        name: "Prueba3",
        date: matchDetailsRef.current.matchDate,
        location: matchDetailsRef.current.location?._id,
        playersLimit: matchDetailsRef.current.playerLimit,
        userId: "66e482584509915a15968bd7",
        sportMode: "67c873ffeb647cc591249358",
        open: matchDetailsRef.current.privacyOption,
      }); 
      console.log(2);
      const createdMatchId = res.data._id;
      console.log(3); 
      // <-- MARCADO: si onMatchCreated está definido, lo llamamos
      if (onMatchCreated) {
        onMatchCreated(createdMatchId);
      }
      closeModal();
    } catch (e) {
      console.error("Error al crear el partido:", e);
    }
  }

  const editMatch = async () => {
    try {
      const res = await matchService.update(match._id, {
        name: "Prueba3",
        date: matchDetailsRef.current.matchDate,
        location: matchDetailsRef.current.location?._id,
        playersLimit: matchDetailsRef.current.playerLimit,
        userId: "6720ef0e3a78ebc10564e979",
        sportMode: matchDetailsRef.current.selectedSportMode?._id,
        open: matchDetailsRef.current.privacyOption,
      });
      if(res) refetch();
      closeModal();
      console.log("Partido editado:", res);
    } catch (e) {
      console.log(e, "ERROR");
    }
  };

  const handleAction = () => {
    if (!match) {
      createMatch();
    } else {
      editMatch();
    }
  };

  function closeModal() {
    setOpenId(null);
    setOpen(false);
  }

  return (
    <Modal isVisible={open} onBackButtonPress={closeModal}>
      <ScrollView>
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
          <Div
            borderBottomWidth={1}
            borderBottomColor={customTheme.colors.gray}
          />
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
        <TouchableOpacity onPress={handleAction} >
          <Div
            h={verticalScale(45)}
            justifyContent="center"
            bg={customTheme.colors.primary}
          >
            <Text textAlign="center">{!match ? "Crear" : "Editar"}</Text>
          </Div>
        </TouchableOpacity>
      </Div>
    </Modal>
  );
}