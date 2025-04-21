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
  const { data: statusList } = useFetch(() => matchService.getPlayerInvitations(match._id), [QUERY_KEYS.PLAYERS_STATUS, match])
  const [hasInitialized, setHasInitialized] = useState(false);
  const totalPlayers = match.playersLimit;
  const teamPlayers = totalPlayers / 2;

  const handlePlayerPress = (playerId, circleNumber, team) => {
    setSelectedPlayerId(playerId);
    setSelectedCircleNumber(circleNumber);
    setSelectedTeam(team);
    setOpen(true);
  };

  const addToFormation = async (player: any) => {
    await matchService.addPlayerToFormation(match._id, player._id, {
      team: selectedTeam,
      position: selectedCircleNumber
    })
  }

  //************************************************* */
  const buildFormationsFromAssignments = (
    assignments: Record<string, { persona: any, circleNumber: number }>
  ) => {
    const newFormations = {
      team1: [] as { position: number, userId: string }[],
      team2: [] as { position: number, userId: string }[],
    };

    Object.entries(assignments).forEach(([_, { persona, circleNumber }]) => {
      if (!persona || !persona._id || !circleNumber) return;

      const isTeam1 = match.formations?.team1.some((p) => p.userId === persona._id);
      const isTeam2 = match.formations?.team2.some((p) => p.userId === persona._id);

      if (isTeam1) {
        newFormations.team1.push({ position: circleNumber, userId: persona._id });
      } else if (isTeam2) {
        newFormations.team2.push({ position: circleNumber, userId: persona._id });
      } else {
        console.warn("Persona no encontrada en formaciones:", persona);
      }
    });

    return newFormations;
  };

  //************************************************* */
  const removeFromFormation = async (player: any) => {
    await matchService.removePlayerFromFormation(match._id, player._id)
  }
  const handlePersonaSelect = (persona) => {
    setPlayersAssignments(prev => {
      const newAssignments = { ...prev };

      Object.keys(newAssignments).forEach(key => {
        if (
          newAssignments[key].persona &&
          newAssignments[key].persona._id === persona._id
        ) {
          removeFromFormation(persona);
          delete newAssignments[key];
        }
      });

      addToFormation(persona);
      newAssignments[selectedPlayerId] = { persona, circleNumber: selectedCircleNumber };

      return newAssignments;
    });

    setOpen(false);
    setSelectedPlayerId(null);
    setSelectedCircleNumber(null);
  };

  useEffect(() => {
    // 1) Salir si ya inicializamos
    if (hasInitialized) return;
  
    // 2) Salir si todavía no tenemos las formaciones o la lista de jugadores
    if (
      !match?.formations ||
      !Array.isArray(match.formations.team1) ||
      !Array.isArray(match.formations.team2) ||
      !statusList?.accepted ||
      statusList.accepted.length === 0
    ) {
      return;
    }
  
    // 3) Preparamos los valores que usa TeamField
    const totalPlayers = match.playersLimit;
    const teamPlayers = totalPlayers / 2;
    const maxPerRow = teamPlayers === 5 ? 2 : 4;
    // (TeamField usa circleNumber empezando en 2)
    
    const initialAssignments: Record<string, { persona: any; circleNumber: number }> = {};
  
    // ——— Top = team2 ——————————————————————————————————————————
    match.formations.team2.forEach(({ userId, position }) => {
      // calcular índice 0-based de circleNumber→posición en grid
      const idx = position - 2;                    
      const row = Math.floor(idx / maxPerRow);    
      const col = idx % maxPerRow;                
      const key = `top-${row}-${col}`;            
  
      const persona = statusList.accepted.find(p => p._id === userId);
      if (persona) {
        initialAssignments[key] = {
          persona,
          circleNumber: position
        };
      }
    });
  
    // ——— Bottom = team1 ————————————————————————————————————————
    match.formations.team1.forEach(({ userId, position }) => {
      const idx = position - 2;
      const row = Math.floor(idx / maxPerRow);
      const col = idx % maxPerRow;
      const key = `bottom-${row}-${col}`;
  
      const persona = statusList.accepted.find(p => p._id === userId);
      if (persona) {
        initialAssignments[key] = {
          persona,
          circleNumber: position
        };
      }
    });
  
    setPlayersAssignments(initialAssignments);
    setHasInitialized(true);
  }, [
    hasInitialized,
    match.formations,
    statusList?.accepted,
    match.playersLimit
  ]);
  

  console.log(playersAssignments,'123123s')


  const filteredPersonas = React.useMemo(() => {
    return statusList?.accepted.filter((personaObj) =>
      personaObj.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, statusList?.accepted]);

  const iniciales = (playerId) => {
    const entry = playersAssignments[playerId];
    return entry && entry.persona && entry.persona.name
      ? entry.persona.name.split(" ").map(word => word[0]).join("")
      : isAdmin ? "+" : "";
  };

  if (!statusList?.accepted || !match.formations) return
  
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
              onAutoAssign={(newAssignments) => {
                setPlayersAssignments((prev) => {
                  const updated = { ...prev };

                  const newPlayerIds = Object.values(newAssignments).map((a: any) => a.persona._id);

                  for (const key in updated) {
                    if (newPlayerIds.includes(updated[key].persona._id)) {
                      delete updated[key];
                    }
                  }

                  return { ...updated, ...newAssignments };
                });
              }}
              teamData={buildFormationsFromAssignments(playersAssignments).team2}
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
              onAutoAssign={(newAssignments) => {
                setPlayersAssignments((prev) => {
                  const updated = { ...prev };

                  // Sacar jugadores que ya están en los nuevos assignments
                  const newPlayerIds = Object.values(newAssignments).map((a: any) => a.persona._id);

                  for (const key in updated) {
                    if (newPlayerIds.includes(updated[key].persona._id)) {
                      delete updated[key];
                    }
                  }

                  // Agregar los nuevos assignments
                  return { ...updated, ...newAssignments };
                });
              }}
              teamData={buildFormationsFromAssignments(playersAssignments).team1}
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