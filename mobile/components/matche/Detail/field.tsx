import React, { useEffect, useState } from "react";
import { Div, Input, Text } from "react-native-magnus";
import { scale, verticalScale } from "react-native-size-matters";
import { ImageBackground, ScrollView, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Match from "../../../types/match.type";
import matchService from "../../../service/match.service";
import { customTheme } from "../../../utils/theme";
import useFetch from "../../../hooks/useGet";
import { QUERY_KEYS } from "../../../types/query.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";

const MAX_CIRCLE_SIZE = scale(50);

interface FPlayerProps {
  size: number;
  style?: any;
  initials?: string;
}
const FPlayer = ({ size, style, initials }: FPlayerProps) => (
  <Div
    w={size}
    h={size}
    rounded="circle"
    bg="white"
    alignItems="center"
    justifyContent="center"
    {...style}
  >
    {initials && <Text fontSize={scale(16)}>{initials}</Text>}
  </Div>
);

interface TeamFieldProps {
  playersCount: number;
  mirror?: boolean;
  onPlayerPress: (playerId: string, circleNumber: number, team: number) => void;
  playersAssignments: Record<string, any>;
  teamData?: { position: number, userId: string }[];
  onAutoAssign?: (assignments: Record<string, { persona: any, circleNumber: number }>) => void;
  isAdmin: boolean;
  statusList: any;
  teamNumber: number
}

const TeamField = ({
  playersCount,
  mirror = false,
  onPlayerPress,
  playersAssignments,
  teamData,
  onAutoAssign,
  isAdmin,
  statusList,
  teamNumber
}: TeamFieldProps) => {
  const fieldPlayers = playersCount - 1;
  const maxPerRow = playersCount === 5 ? 2 : 4;
  const numRows = Math.ceil(fieldPlayers / maxPerRow);
  const [layout, setLayout] = useState(null);

  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  let players = [];
  let circleNumber = 2;

  if (layout) {
    const availableWidth = layout.width * 0.9;
    const cellWidth = availableWidth / maxPerRow;
    const computedCircleSize = cellWidth * 0.8;
    const circleSize = Math.min(computedCircleSize, MAX_CIRCLE_SIZE);
    const spacing = cellWidth * (playersCount === 5 ? 0.5 : 0.2);
    const rowHeight = layout.height / numRows;

    for (let row = 0; row < numRows; row++) {
      const effectiveRow = mirror ? (numRows - 1 - row) : row;
      const playersInRow = row < numRows - 1 ? maxPerRow : fieldPlayers - row * maxPerRow;
      const rowWidth = playersInRow * circleSize + (playersInRow - 1) * spacing;
      const leftOffset = (layout.width - rowWidth) / 2;
      const top = effectiveRow * rowHeight + (rowHeight - circleSize) / 2;

      for (let i = 0; i < playersInRow; i++) {
        const left = leftOffset + i * (circleSize + spacing);
        const playerId = `${mirror ? "bottom" : "top"}-${row}-${i}`;
        const assignedPersona = playersAssignments[playerId];
        const displayLabel = assignedPersona && assignedPersona.persona && assignedPersona.persona.name
          ? assignedPersona.persona.name.split(" ").map(word => word[0]).join("")
          : isAdmin ? "+" : "";;
        const currentCircleNumber = circleNumber;
        players.push(
          <TouchableOpacity
            disabled={!isAdmin}
            key={playerId}
            onPress={() => onPlayerPress(playerId, currentCircleNumber, teamNumber)}
          >
            <FPlayer
              size={circleSize}
              style={{ position: "absolute", left, top }}
              initials={displayLabel}
            />
          </TouchableOpacity>
        );
        circleNumber++;
      }
    }
  }


  useEffect(() => {
    if (layout && teamData && teamData.length > 0 && onAutoAssign) {
      let assignments = {};
      let circleNum = 2;
      for (let row = 0; row < numRows; row++) {
        const playersInRow = row < numRows - 1 ? maxPerRow : fieldPlayers - row * maxPerRow;
        for (let i = 0; i < playersInRow; i++) {
          const playerId = `${mirror ? "bottom" : "top"}-${row}-${i}`;
          if (!playersAssignments[playerId]) {
            const teamPlayer = teamData.find(p => p.position === circleNum);
            if (teamPlayer && teamPlayer.userId) {
              const fullPersona = statusList?.find(p => p._id === teamPlayer.userId);
              if (fullPersona) {
                assignments[playerId] = {
                  persona: fullPersona,
                  circleNumber: circleNum
                };
              }
            }
          }
          circleNum++;
        }
      }
      if (Object.keys(assignments).length > 0) {
        onAutoAssign(assignments);
      }
    }
  }, [layout, teamData, onAutoAssign, mirror, numRows, fieldPlayers, maxPerRow, playersAssignments]);

  return (
    <Div flex={1} onLayout={handleLayout} position="relative">
      {players}
    </Div>
  );
};

interface FieldProps {
  match: Match;
  isAdmin: boolean
}

const Field = ({ match, isAdmin }: FieldProps) => {
  const [open, setOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [selectedCircleNumber, setSelectedCircleNumber] = useState(null);
  const [playersAssignments, setPlayersAssignments] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<1 | 2 | null>(null);
  const { data: statusList } = useFetch(() => matchService.getPlayerInvitations(match._id), [QUERY_KEYS.PLAYERS_STATUS,match])
  const queryClient = useQueryClient();

  const totalPlayers = match.playersLimit;
  const teamPlayers = totalPlayers / 2;
  // useEffect(() => {
  //   setPlayersAssignments(prev => ({
  //     ...prev,
  //     "Top-GK": { circleNumber: 1 },
  //     "Bottom-GK": { circleNumber: 1 }
  //   }));
  // }, []);

  const handlePlayerPress = (playerId, circleNumber, team) => {
    setSelectedPlayerId(playerId);
    setSelectedCircleNumber(circleNumber);
    setSelectedTeam(team);
    setOpen(true);
  };

  const addToFormation = async (player: any) => {
    // const formationsToSend = buildFormationsFromAssignments(playersAssignments);
    // // console.log(player)
    // queryClient.setQueryData([QUERY_KEYS.MATCH], (old: Match) => ({
    //   ...old,
    //   data: {
    //     ...old.data,
    //     formations: formationsToSend,
    //   },
    // }))


    await matchService.addPlayerToFormation(match._id, player._id, {
      team: selectedTeam,
      position: selectedCircleNumber
    })

    await queryClient.invalidateQueries({queryKey:[QUERY_KEYS.MATCH]})
  }

  //************************************************* */
  const buildFormationsFromAssignments = (assignments: Record<string, { persona: any, circleNumber: number }>) => {
    const newFormations = {
      team1: [] as { position: number, userId: string }[],
      team2: [] as { position: number, userId: string }[],
    };

    Object.entries(assignments).forEach(([playerId, { persona, circleNumber }]) => {
      if (!persona || !persona._id || !circleNumber) return;

      const isTeam1 = playerId.toLowerCase().includes("top");
      const teamKey = isTeam1 ? "team1" : "team2";

      newFormations[teamKey].push({
        position: circleNumber,
        userId: persona._id,
      });
    });

    return newFormations;
  };

  //************************************************* */
  const removeFromFormation = async (player: any) => {
    await matchService.removePlayerFromFormation(match._id, player._id)
  }
  // console.log(match.formations)
  const handlePersonaSelect = (persona) => {
    setPlayersAssignments(prev => {
      const newAssignments = { ...prev };

      // Eliminar al jugador de donde ya esté asignado
      Object.keys(newAssignments).forEach(key => {
        if (
          newAssignments[key].persona &&
          newAssignments[key].persona._id === persona._id
        ) {
          // Llama a removeFromFormation si estaba asignado antes
          removeFromFormation(persona);
          delete newAssignments[key];
        }
      });

      // Agregar al jugador en la nueva posición
      addToFormation(persona);
      newAssignments[selectedPlayerId] = { persona, circleNumber: selectedCircleNumber };

      return newAssignments;
    });

    setOpen(false);
    setSelectedPlayerId(null);
    setSelectedCircleNumber(null);
  };

  const filteredPersonas = React.useMemo(() => {
    return statusList?.accepted.filter((personaObj) =>
      personaObj.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const iniciales = (playerId) => {
    const entry = playersAssignments[playerId];
    return entry && entry.persona && entry.persona.name
      ? entry.persona.name.split(" ").map(word => word[0]).join("")
      : isAdmin ? "+" : "";
  };

  if (!statusList) return

  return (
    <>
      {open && (
        <Div
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.5)"
          alignItems="center"
          justifyContent="center"
          zIndex={1000}
        >
          <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Div
              zIndex={2000}
              h={verticalScale(400)}
              bg="white"
              p={customTheme.spacing.medium}
              rounded="lg"
              shadow="md"
              w={scale(300)}
            >
              <TouchableOpacity onPress={() => setOpen(false)} style={{ paddingVertical: customTheme.spacing.small }}>
                <Text>Close</Text>
              </TouchableOpacity>
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                mb={customTheme.spacing.medium}
              />
              <ScrollView style={{ maxHeight: verticalScale(300) }}>
                {(filteredPersonas?.length > 0 ? filteredPersonas : []).map((persona) => (
                  <TouchableOpacity key={persona._id} onPress={() => handlePersonaSelect(persona)}>
                    <Div p={customTheme.spacing.medium}>
                      <Text>{persona.name}</Text>
                    </Div>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Div>
          </KeyboardAwareScrollView>
        </Div>
      )}
      <ImageBackground
        source={require('../../../assets/match/canchaF.jpg')}
        style={{ height: "100%" }}
      >
        <Div p={20} h="100%">
          <Div id="first-half" flex={1}>
            <Div h="15%" alignItems="center" justifyContent="center">
              <TouchableOpacity disabled={!isAdmin} id="Top-GK" onPress={() => handlePlayerPress("Top-GK", 1, 2)}>
                <FPlayer size={scale(50)} initials={iniciales("Top-GK")} />
              </TouchableOpacity>
            </Div>
            <TeamField
              playersCount={teamPlayers}
              mirror={false}
              onPlayerPress={handlePlayerPress}
              playersAssignments={playersAssignments}
              onAutoAssign={(assignments) =>
                setPlayersAssignments(prev => ({ ...prev, ...assignments }))
              }
              teamData={match.formations?.team2}
              isAdmin={isAdmin}
              statusList={statusList.accepted}
              teamNumber={2}
            />
          </Div>

          <Div id="second-half" flex={1}>
            <TeamField
              playersCount={teamPlayers}
              mirror={true}
              onPlayerPress={handlePlayerPress}
              playersAssignments={playersAssignments}
              onAutoAssign={(assignments) =>
                setPlayersAssignments(prev => ({ ...prev, ...assignments }))
              }
              teamData={match.formations?.team1}
              isAdmin={isAdmin}
              statusList={statusList.accepted}
              teamNumber={1}
            />
            <Div h="15%" alignItems="center" justifyContent="center">
              <TouchableOpacity disabled={!isAdmin} id="Bottom-GK" onPress={() => handlePlayerPress("Bottom-GK", 1, 1)}>
                <FPlayer size={scale(50)} initials={iniciales("Bottom-GK")} />
              </TouchableOpacity>
            </Div>
          </Div>
        </Div>
      </ImageBackground>
    </>
  );
};

export default Field;
