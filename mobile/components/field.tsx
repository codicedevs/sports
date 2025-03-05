import React, { useState } from "react";
import { Div, Overlay, Text } from "react-native-magnus";
import { scale, verticalScale } from "react-native-size-matters";
import Match from "../types/match.type";
import { ScrollView, TouchableOpacity } from "react-native";
import { customTheme } from "../utils/theme";

const personas = [
  "Santiago Rodríguez", "Valentina Gómez", "Mateo Fernández", "Lucía Pérez",
  "Sebastián Ramírez", "Camila Torres", "Benjamín Morales", "Martina Jiménez",
  "Joaquín Herrera", "Sofía Castro", "Tomás Vargas", "Isabella Méndez",
  "Lucas Rojas", "Emilia Aguirre", "Gabriel Ortega", "Renata Silva",
  "Felipe Navarro", "Agustina Soto", "Bruno Carrasco", "Josefina Paredes",
  "Facundo Ibáñez", "Victoria Duarte"
];

const MAX_CIRCLE_SIZE = scale(50);

const FPlayer = ({ size, style, initials }) => (
  <Div
    w={size}
    h={size}
    rounded="circle"
    borderWidth={1}
    bg="white"
    alignItems="center"
    justifyContent="center"
    {...style}
  >
    {initials && <Text fontSize={scale(16)}>{initials}</Text>}
  </Div>
);

const TeamField = ({ playersCount, mirror = false, onPlayerPress, playersAssignments }) => {
  const fieldPlayers = playersCount - 1;
  const maxPerRow = playersCount === 5 ? 2 : 4;
  const numRows = Math.ceil(fieldPlayers / maxPerRow);
  const [layout, setLayout] = useState(null);
  
  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  let players = [];
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
        const persona = playersAssignments[playerId];
        const initials = persona ? persona.split(" ").map(word => word[0]).join("") : null;

        players.push(
          <TouchableOpacity key={playerId} onPress={() => onPlayerPress(playerId)}>
            <FPlayer
              size={circleSize}
              style={{ position: "absolute", left, top }}
              initials={initials}
            />
          </TouchableOpacity>
        );
      }
    }
  }

  return (
    <Div flex={1} bg="green" onLayout={handleLayout} position="relative">
      {players}
    </Div>
  );
};

const Field = ({ match }: { match: Match }) => {
  const [open, setOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [playersAssignments, setPlayersAssignments] = useState({});

  const totalPlayers = match.playersLimit;
  const teamPlayers = totalPlayers / 2;

  const handlePlayerPress = (playerId) => {
    setSelectedPlayerId(playerId);
    setOpen(true);
  };

  const handlePersonaSelect = (persona) => {
    setPlayersAssignments(prev => ({ ...prev, [selectedPlayerId]: persona }));
    setOpen(false);
    setSelectedPlayerId(null);
  };

  return (
    <>
      <Overlay visible={open}>
        <Div h={verticalScale(500)}>
          <ScrollView>
            {personas.map((persona) => (
              <TouchableOpacity key={persona} onPress={() => handlePersonaSelect(persona)}>
                <Div p={customTheme.spacing.medium}>
                  <Text>{persona}</Text>
                </Div>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Div>
      </Overlay>
      <Div p={20} bg="green" h="100%">
        <Div id="first-half" borderWidth={1} flex={1}>
          <Div h="15%" alignItems="center" justifyContent="center">
            <FPlayer size={scale(50)} />
          </Div>
          <TeamField 
            playersCount={teamPlayers} 
            mirror={false} 
            onPlayerPress={handlePlayerPress} 
            playersAssignments={playersAssignments} 
          />
        </Div>
        <Div id="second-half" borderWidth={1} flex={1}>
          <TeamField 
            playersCount={teamPlayers} 
            mirror={true} 
            onPlayerPress={handlePlayerPress} 
            playersAssignments={playersAssignments} 
          />
          <Div h="15%" alignItems="center" justifyContent="center">
            <FPlayer size={scale(50)} />
          </Div>
        </Div>
      </Div>
    </>
  );
};

export default Field;
