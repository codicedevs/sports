import React, { useEffect, useRef, useState, Context } from "react";
import { Div, Text, Modal } from "react-native-magnus";
import Match from "../../types/match.type";
import { customTheme } from "../../utils/theme";
import { verticalScale } from "react-native-size-matters";
import PlayersCounterInput from "../matche/Inputs/playersCounter";
import { Accordion } from "../collapsibleView";
import SportInput from "../matche/Inputs/sport";
import MatchPrivacyToggleInput from "../matche/Inputs/matchPrivacyToggle";
import { ScrollView, TouchableOpacity } from "react-native";
import MatchSchedulerInput from "../matche/Inputs/matchScheduler";
import SearchLocationInput from "../matche/Inputs/searchLocation";
import {
  MatchDetails,
  Place,
  PrivacyOption,
  Sport,
  SportMode,
} from "../../types/form.type";
import matchService from "../../service/match.service";
import { useMutate } from "../../hooks/useMutate";

interface MatchModalHandlerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onMatchCreated?: (matchId: string) => void;
}

const MatchModalHandler = ({
  open,
  setOpen,
  onMatchCreated,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  match?: Match;
}) => {
  const matchDetailsRef = useRef<MatchDetails>({
    selectedSport: null,
    selectedSportMode: null,
    playerLimit: 0,
    privacyOption: false,
    matchDate: undefined,
    location: null,
  });

  const [openId, setOpenId] = useState<null | string>(null);

  const createMatch = async () => {
    try {
      const res = await matchService.create({
        name: "Prueba3",
        date: matchDetailsRef.current.matchDate,
        location: matchDetailsRef.current.location?._id,
        playersLimit: matchDetailsRef.current.playerLimit,
        userId: "66fc580c32617aadfac71feb",
        sportMode: matchDetailsRef.current.selectedSportMode?._id,
        open: matchDetailsRef.current.privacyOption,
      });
      
      const createdMatchId = res.data._id;
      if (onMatchCreated) {
        onMatchCreated(createdMatchId);
      }
      console.log(res)
      closeModal();
    } catch (e) {
      console.error("Error al crear el partido:", e);
    }
  };

  const closeModal = () => {
    setOpenId(null);
    setOpen(false);
  };

  
console.log("RENDEEER","Rendering MatchSchedulerInput")

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
            id={"Deportes"}
            openId={openId}
            setOpenId={setOpenId}
            title={"Deporte"}
            rightText="Futbol 5"
            size={342}
          >
            <SportInput matchDetailsRef={matchDetailsRef} />
          </Accordion>
          <Accordion
            id={"PlayerInput"}
            openId={openId}
            setOpenId={setOpenId}
            title={"Cupo"}
            rightText="Agrega participantes"
            size={123}
          >
            <PlayersCounterInput matchDetailsRef={matchDetailsRef} />
          </Accordion>
          <Accordion
            id={"PrivacyToggle"}
            openId={openId}
            setOpenId={setOpenId}
            title={"Privacidad"}
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
            id={"Horario"}
            openId={openId}
            setOpenId={setOpenId}
            title={"Horario"}
            rightText="A definir"
            size={802}
          >
            <MatchSchedulerInput matchDetailsRef={matchDetailsRef} />
          </Accordion>
          <Accordion
            id={"Busqueda"}
            openId={openId}
            setOpenId={setOpenId}
            title={"¿Donde juegan?"}
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
        <TouchableOpacity onPress={createMatch}>
          <Div
            h={verticalScale(45)}
            justifyContent="center"
            bg={customTheme.colors.primary}
          >
            <Text textAlign="center">Crear</Text>
          </Div>
        </TouchableOpacity>
      </Div>
    </Modal>
  );
};

export default MatchModalHandler;
