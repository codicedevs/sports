import { useCallback, useEffect, useRef, useState } from "react";
import { useGlobalUI } from "../../../context/globalUiContext";
import { MatchDetails } from "../../../types/form.type";
import Match from "../../../types/match.type";
import matchService from "../../../service/match.service";
import { Div, Text } from "react-native-magnus";
import { ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { verticalScale } from "react-native-size-matters";
import { customTheme } from "../../../utils/theme";
import { Accordion } from "../../collapsibleView";
import SportInput from "../Inputs/sport";
import PlayersCounterInput from "../Inputs/playersCounter";
import MatchPrivacyToggleInput from "../Inputs/matchPrivacyToggle";
import { formatDate } from "../../../utils/date";
import MatchSchedulerInput from "../Inputs/matchScheduler";
import SearchLocationInput from "../Inputs/searchLocation";
import { useSession } from "../../../context/authProvider";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppScreens } from "../../../navigation/screens";
import useFetch from "../../../hooks/useGet";
import sportService from "../../../service/sport.service";
import sportmodeService from "../../../service/sportmode.service";
import { QUERY_KEYS } from "../../../types/query.types";
import locationService from "../../../service/location.service";

export default function MatchForm({ match, onRefetch, onGoBack }: { match: Match, onRefetch?: () => void, onGoBack?: () => void }) {
  const [openId, setOpenId] = useState<null | string>(null);
  const { showSnackBar } = useGlobalUI();
  const { currentUser } = useSession()
  const [loading, setLoading] = useState(false)
  const matchDetailsRef = useRef<MatchDetails>({
    selectedSport: null,
    selectedSportMode: null,
    playerLimit: 0,
    privacyOption: false,
    matchDate: undefined,
    location: null,
  });
  const [formKey, setFormKey] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    if (match) {
      fetchMatch();
    }
  }, [match]);

    const { data: sports, isFetching: isFetchingSport } = useFetch(sportService.getAll, [QUERY_KEYS.SPORTS]);
    const { data: allSportModes, isFetching: isFetchingSportModes } = useFetch(sportmodeService.getAll, [QUERY_KEYS.SPORT_MODES]);
   const { data: Locations, isFetching: isFetchingLocations } = useFetch(locationService.getAll, [
      QUERY_KEYS.LOCATIONS,
    ]);

  async function fetchMatch() {
    try {
      matchDetailsRef.current.selectedSport = match.sport || null;
      matchDetailsRef.current.selectedSportMode = match.sportMode || null;
      matchDetailsRef.current.playerLimit = match.playersLimit || 0;
      matchDetailsRef.current.privacyOption = match.open || false;
      matchDetailsRef.current.matchDate = match.date ? match.date.toISOString() : undefined;
      matchDetailsRef.current.location = match.location || null;
    } catch (e) {
      console.error("Error al fetchMatch:", e);
      console.log(e);
    }
  }

  async function createMatch() {
    setLoading(true)
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
      // if (onGoBack) {
      //   onGoBack();
      // }
      navigation.navigate(AppScreens.MATCH_DETAIL, { id: res._id })
      
      if (onGoBack) {
        onGoBack();
      }
      setLoading(false)
      showSnackBar("success", "Partido creado con exito")
    } catch (e) {
      console.error("Error al crear el partido:", e);
      showSnackBar("error", "Ocurrio un error")
    } finally {
      setLoading(false)
    }
  }

  const editMatch = async () => {
    if (!match) return
    setLoading(true)
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
      if (onRefetch) {
        onRefetch()
      }
      setLoading(false)
      showSnackBar("success", "Partido editado con exito")
    } catch (e) {
      console.error("Error al editar el partido:", e);
      showSnackBar("error", "Ocurrio un error")
    } finally {
      setLoading(false)
    }
  };

  const handleAction = () => {
    if (!match) {
      createMatch();
    } else {
      editMatch();
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!match) {
        matchDetailsRef.current = {
          selectedSport: null,
          selectedSportMode: null,
          playerLimit: 0,
          privacyOption: false,
          matchDate: undefined,
          location: null,
        };
        // Incrementa el key para forzar una re-renderización del formulario
        setFormKey(prevKey => prevKey + 1);
      }
    }, [match])
  );

  if (isFetchingSport || isFetchingSportModes || isFetchingLocations) return (<Div flex={1} alignItems="center" justifyContent="center" bg="white"><ActivityIndicator size={"large"} /></Div>)

  return (
    <Div flex={1} key={formKey}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Div
          flex={1}
          style={{ gap: verticalScale(16) }}
          bg={"white"}
          p={customTheme.spacing.medium}
        >
          <Accordion 
            id="Deportes"
            openId={openId}
            setOpenId={setOpenId}
            title="Deporte"
            rightText={
              match?.sportMode?.name
                ? match.sportMode.name
                : matchDetailsRef.current.selectedSportMode?.name
                  ? matchDetailsRef.current.selectedSportMode.name
                  : "A definir"
            }
            size={342}
          >
            <SportInput matchDetailsRef={matchDetailsRef} sports={sports} allSportModes={allSportModes} />
          </Accordion>
          <Accordion
            id="PlayerInput"
            openId={openId}
            setOpenId={setOpenId}
            title="Cupo"
            rightText={
              match?.playersLimit
                ? match.playersLimit.toString()
                : matchDetailsRef.current.playerLimit
                  ? matchDetailsRef.current.playerLimit.toString()
                  : "Agrega participantes"
            }
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
              match
                ? match.open
                  ? "Publico"
                  : "Privado"
                : matchDetailsRef.current.privacyOption
                  ? "Publico"
                  : "Privado"
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
              match && match.date
                ? formatDate(match.date)
                : matchDetailsRef.current.matchDate
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
              match && match.location
                ? match.location.name
                : matchDetailsRef.current.location
                  ? matchDetailsRef.current.location.name
                  : "A definir"
            }
            size={300}
          >
            <SearchLocationInput matchDetailsRef={matchDetailsRef} Locations={Locations} />
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
        <TouchableOpacity onPress={handleAction} disabled={loading}>
          <Div
            h={verticalScale(45)}
            justifyContent="center"
            alignItems="center"
            bg={customTheme.colors.secondaryBackground}
            flexDir="row"
          >
            {
              loading ?
                <ActivityIndicator size={"large"} />
                :
                <Text
                  textAlign="center"
                  color={customTheme.colors.background}
                  fontSize={customTheme.fontSize.medium}
                  fontFamily="NotoSans-BoldItalic"
                >
                  {!match ? "Crear" : "Guardar cambios"}
                </Text>
            }
          </Div>
        </TouchableOpacity>
      </Div>
    </Div>
  )

}