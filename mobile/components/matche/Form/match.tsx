import { useEffect, useRef, useState } from "react";
import { useGlobalUI } from "../../../context/globalUiContext";
import { MatchDetails } from "../../../types/form.type";
import Match from "../../../types/match.type";
import matchService from "../../../service/match.service";
import { Div, Text } from "react-native-magnus";
import { Image, ScrollView, TouchableOpacity } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { customTheme } from "../../../utils/theme";
import { Accordion } from "../../collapsibleView";
import SportInput from "../Inputs/sport";
import PlayersCounterInput from "../Inputs/playersCounter";
import MatchPrivacyToggleInput from "../Inputs/matchPrivacyToggle";
import { formatDate } from "../../../utils/date";
import MatchSchedulerInput from "../Inputs/matchScheduler";
import SearchLocationInput from "../Inputs/searchLocation";
import { QueryObserverResult } from "@tanstack/react-query";
import { useSession } from "../../../context/authProvider";

export default function MatchForm({ match, onRefetch, onGoBack }: { match: Match, onRefetch?: () => void, onGoBack?: () => void }) {
  const [openId, setOpenId] = useState<null | string>(null);
  const { showSnackBar } = useGlobalUI();
  const { currentUser } = useSession()
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
  console.log(currentUser)
  async function createMatch() {
    try {
      const res = await matchService.create({
        name: "Prueba3",
        date: matchDetailsRef.current.matchDate,
        location: matchDetailsRef.current.location?._id,
        playersLimit: matchDetailsRef.current.playerLimit,
        sportMode: matchDetailsRef.current.selectedSportMode?._id,
        open: matchDetailsRef.current.privacyOption,
        userId: currentUser._id
      });
      // const createdMatchId = res.data._id;
      // <-- MARCADO: si onMatchCreated está definido, lo llamamos
      // if (onMatchCreated) {
      //     onMatchCreated(createdMatchId);
      // }
      // closeModal();
      onGoBack()
      showSnackBar("success", "Partido creado con exito")
    } catch (e) {
      console.error("Error al crear el partido:", e);
      showSnackBar("error", "Ocurrio un error")
    }
  }

  const editMatch = async () => {
    if (!match) return
    try {
      const res = await matchService.update(match._id, {
        name: "Prueba3",
        date: matchDetailsRef.current.matchDate,
        location: matchDetailsRef.current.location?._id,
        playersLimit: matchDetailsRef.current.playerLimit,
        sportMode: matchDetailsRef.current.selectedSportMode?._id,
        open: matchDetailsRef.current.privacyOption,
      });
      // if (res) 
      // refetch();scale
      // closeModal();
      console.log("Partido editado:", res);
      onRefetch()
      showSnackBar("success", "Partido editado con exito")
    } catch (e) {
      scale
      console.error("Error al editar el partido:", e);
      showSnackBar("error", "Ocurrio un error")
    }
  };
  scale
  const handleAction = () => {
    if (!match) {
      createMatch();
    } else {
      scale
      editMatch();
    }
  };
  scale
  return (
    <Div flex={1}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Div
          flex={1}
          style={{ gap: verticalScale(16) }}
          bg={customTheme.colors.grayBackground}
          p={customTheme.spacing.medium}
        >
          <Accordion
            id="Deportes"
            openId={openId}
            setOpenId={setOpenId}
            title="Deporte"
            rightText={
              matchDetailsRef.current.selectedSportMode
                ? matchDetailsRef.current.selectedSportMode.name
                : "A definir"
            }
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
            rightText={
              matchDetailsRef.current.privacyOption ? "Publico" : "Privado"
            }
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
            rightText={
              matchDetailsRef.current.matchDate
                ? formatDate(matchDetailsRef.current.matchDate)
                : "A definir"
            }
            size={802}
          >
            <MatchSchedulerInput matchDetailsRef={matchDetailsRef} />
          </Accordion>
          <Accordion
            id="Busqueda"
            openId={openId}
            setOpenId={setOpenId}
            title="¿Donde juegan?"
            rightText={
              matchDetailsRef.current.location
                ? matchDetailsRef.current.location.name
                : "A definir"
            }
            size={300}
          >
            <SearchLocationInput matchDetailsRef={matchDetailsRef} />
          </Accordion>
        </Div>
      </ScrollView>
      <Div
        justifyContent="center"
        bg={customTheme.colors.background}
        h={verticalScale(80)}
        p={customTheme.spacing.medium}
        borderTopColor="rgb(223, 223, 220)"
        borderTopWidth={1}
      >
        <TouchableOpacity onPress={handleAction}>
          <Div
            h={verticalScale(45)}
            justifyContent="center"
            alignItems="center"
            bg={customTheme.colors.secondaryBackground}
            flexDir="row"
          >
            {/* <Image
              source={require("../../../assets/+.png")}
              resizeMode="contain"
              w={scale(15)}
              h={scale(15)}
              mr={customTheme.spacing.small}
            /> */}
            <Text
              textAlign="center"
              color={customTheme.colors.background}
              fontSize={customTheme.fontSize.medium}
              fontFamily="NotoSans-BoldItalic"
            >
              {!match ? "Crear" : "Editar"}
            </Text>
          </Div>
        </TouchableOpacity>
      </Div>
    </Div>
  )

}