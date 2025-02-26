import React, { useState } from "react";
import { Div } from "react-native-magnus";

const FPlayer = ({ size, style }) => {
  return (
    <Div
      w={size}
      h={size}
      rounded="circle"
      borderWidth={1}
      bg="white"
      {...style}
    />
  );
};

const TeamField = ({ playersCount }) => {
  const nonGoalkeeperPlayers = playersCount / 2 - 1;
  const [layout, setLayout] = useState(null);

  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  let players = [];
  if (layout) {
    // Número de jugadores por fila (suponemos que es par)
    const playersPerRow = nonGoalkeeperPlayers / 2;
    
    const factor = 0.8; // Factor para definir el tamaño relativo del círculo respecto al spacing
    let circleSize, spacing;
    if (playersPerRow > 1) {
      circleSize = (factor * layout.width) / ((playersPerRow - 1) + factor);
      spacing = (layout.width - circleSize) / (playersPerRow - 1);
    } else {
      // En caso de tener un solo jugador en la fila, lo centramos
      circleSize = layout.width * 0.5;
      spacing = 0;
    }
    
    const rowYPositions = [
      layout.height * 0.35 - circleSize / 2,
      layout.height * 0.65 - circleSize / 2,
    ];

    // Recorremos cada fila y cada jugador dentro de la fila
    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < playersPerRow; i++) {
        // El centro horizontal del jugador i será:
        const centerX = circleSize / 2 + i * spacing;
        // Para posicionar el elemento, restamos la mitad del circleSize
        const left = centerX - circleSize / 2;
        players.push(
          <FPlayer
            key={`${row}-${i}`}
            size={circleSize}
            style={{
              position: "absolute",
              left,
              top: rowYPositions[row],
            }}
          />
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

const Field = () => {
  // Puedes cambiar este valor a 18, 22, etc.
  const totalPlayers = 22;

  return (
    <Div p={20} bg="red" h="100%">
      <Div id="first-half" borderWidth={1} flex={1}>
        {/* Arquero en posición fija, por ejemplo, en la parte superior */}
        <Div h="15%" alignItems="center" justifyContent="center">
          <FPlayer size={50} />
        </Div>
        {/* Jugadores de campo distribuidos en dos filas */}
        <TeamField playersCount={totalPlayers} />
      </Div>
      <Div id="second-half" borderWidth={1} flex={1}>
        {/* Aquí podrías aplicar la misma lógica para el otro equipo */}
      </Div>
    </Div>
  );
};

export default Field;
