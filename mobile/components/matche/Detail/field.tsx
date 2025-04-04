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


// match id 66e482584509915a15968bd7

const personas = [
  { _id: "66e482584509915a15968bd7", name: "Diego" },
  { _id: "671a838fa244aadecccd9904", name: "diego11" },
  { _id: "671a84b9ba1c16df2574f220", name: "diego12" },
  { _id: "671a84bfba1c16df2574f222", name: "diego14" },
  { _id: "679b940c3dc4af55650b6049", name: "diego orefici" },
  { _id: "66f7055a26fc7aa2eabb94ef", name: "diego+1" },
  { _id: "66f7056226fc7aa2eabb94f1", name: "diego+2" },
  { _id: "66f7057126fc7aa2eabb94f7", name: "diego+5" },
  { _id: "679ba8a55768ea11f86cdf9e", name: "Administrator Administrador" },
  { _id: "66f7056726fc7aa2eabb94f3", name: "diego+3" },
  { _id: "671a8395a244aadecccd9906", name: "diego10" },
  { _id: "671a839ba244aadecccd9908", name: "diego9" },
  { _id: "66f7056c26fc7aa2eabb94f5", name: "diego+4" },
  { _id: "66f7057526fc7aa2eabb94f9", name: "diego+6" }
];

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
  onPlayerPress: (playerId: string, circleNumber: number) => void;
  playersAssignments: Record<string, any>;
  teamData?: { posicion: number, user: string }[];
  onAutoAssign?: (assignments: Record<string, { persona: any, circleNumber: number }>) => void;
  isAdmin: boolean
}

const TeamField = ({
  playersCount,
  mirror = false,
  onPlayerPress,
  playersAssignments,
  teamData,
  onAutoAssign,
  isAdmin
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
            onPress={() => onPlayerPress(playerId, currentCircleNumber)}
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
              assignments[playerId] = { persona: teamPlayer.userId, circleNumber: circleNum };
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
  const { data: statusList } = useFetch(() => matchService.getPlayerInvitations(match._id), [QUERY_KEYS.PLAYERS_STATUS, match])
 
  if(!statusList) return

  const totalPlayers = match.playersLimit;
  const teamPlayers = totalPlayers / 2;
  useEffect(() => {
    setPlayersAssignments(prev => ({
      ...prev,
      "Top-GK": { circleNumber: 1 },
      "Bottom-GK": { circleNumber: 1 }
    }));
  }, []);

  const handlePlayerPress = (playerId, circleNumber) => {
    setSelectedPlayerId(playerId);
    setSelectedCircleNumber(circleNumber);
    setOpen(true);
  };

  const addToFormation = async (player: any) => {
    const team = (selectedPlayerId.split('-')[0] === "top" ? 1 : 2)
    await matchService.addPlayerToFormation(match._id, player._id, {
      team: team,
      position: selectedCircleNumber
    })
  }

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

  const filteredPersonas = React.useMemo(() => {
    return statusList.accepted.filter((personaObj) =>
      personaObj.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const iniciales = (playerId) => {
    const entry = playersAssignments[playerId];
    return entry && entry.persona && entry.persona.name
      ? entry.persona.name.split(" ").map(word => word[0]).join("")
      : isAdmin ? "+" : "";
  };

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
                {filteredPersonas.map((persona) => (
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
              <TouchableOpacity disabled={!isAdmin} id="Top-GK" onPress={() => handlePlayerPress("Top-GK", 1)}>
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
            />
            <Div h="15%" alignItems="center" justifyContent="center">
              <TouchableOpacity disabled={!isAdmin} id="Bottom-GK" onPress={() => handlePlayerPress("Bottom-GK", 1)}>
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
