import React, { useState } from "react";
import { Div } from "react-native-magnus";
import { scale, verticalScale } from "react-native-size-matters";

// Componente para representar un jugador
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
  // Calculamos los jugadores sin arquero por equipo (suponiendo que playersCount es par)
  // Ejemplo: en un equipo de 10, el arquero se posiciona fijo y los otros 4 se distribuyen en dos filas (2-2).
  const nonGoalkeeperPlayers = playersCount / 2 - 1;
  const [layout, setLayout] = useState(null);

  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  let players = [];
  if (layout) {
    // Dividimos en 2 filas
    const playersPerRow = nonGoalkeeperPlayers / 2;
    // Calculamos el espaciado horizontal para cada fila
    const horizontalSpacing = layout.width / (playersPerRow + 1);
    // El tamaño del círculo se define proporcionalmente (ajusta el factor según lo necesites)
    const circleSize = horizontalSpacing * 0.8;
    // Definimos posiciones verticales para cada fila (puedes modificar estos porcentajes)
    const rowYPositions = [
      layout.height * 0.35 - circleSize / 2,
      layout.height * 0.65 - circleSize / 2,
    ];

    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < playersPerRow; i++) {
        const left = horizontalSpacing * (i + 1) - circleSize / 2;
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
  // Ejemplo: total de jugadores por equipo (puede ser 10, 14, 18, 22, etc.)
  const totalPlayers = 16;

  return (
    <Div p={20} bg="red" h="100%">
      <Div id="first-half" borderWidth={1} flex={1}>
        {/* Arquero en posición fija (por ejemplo, en la parte superior) */}
        <Div h="15%" alignItems="center" justifyContent="center">
          <FPlayer size={scale(50)} />
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
