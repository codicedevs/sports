import React, { useState } from "react";
import { Div } from "react-native-magnus";
import { scale } from "react-native-size-matters";

const FPlayer = ({ size, style }) => (
  <Div
    w={size}
    h={size}
    rounded="circle"
    borderWidth={1}
    bg="white"
    {...style}
  />
);

const TeamField = ({ playersCount }) => {
  // playersCount es la cantidad de jugadores por equipo (incluye arquero).
  // Los field players son los jugadores de campo: quitamos 1 arquero.
  const fieldPlayers = playersCount - 1; // Ej: 9 - 1 = 8 jugadores de campo.
  const maxPerRow = playersCount === 5? 2 : 4; // máximo 4 círculos por fila.
  const numRows = Math.ceil(fieldPlayers / maxPerRow);

  const [layout, setLayout] = useState(null);

  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  let players = [];
  if (layout) {
    // Usamos el 90% del ancho para definir "celdas" (4 celdas por fila) y dejar márgenes laterales.
    const availableWidth = layout.width * 0.9;
    const cellWidth = availableWidth / maxPerRow;
    // Cada círculo ocupará el 80% de la celda para dejar un espacio interno
    const circleSize = cellWidth * 0.8;
    // El espacio "interno" (entre círculos) es la diferencia.
    const spacing = cellWidth * 0.2;

    // Dividimos verticalmente el contenedor según la cantidad de filas.
    const rowHeight = layout.height / numRows;

    // Recorremos cada fila.
    for (let row = 0; row < numRows; row++) {
      // Determinamos cuántos jugadores hay en esta fila.
      const playersInRow = row < numRows - 1 ? maxPerRow : fieldPlayers - row * maxPerRow;
      // Calculamos el ancho total ocupado por la fila: (número de círculos * circleSize) + (espacios entre ellos)
      const rowWidth = playersInRow * circleSize + (playersInRow - 1) * spacing;
      // Para centrar la fila en el contenedor se calcula un offset.
      const leftOffset = (layout.width - rowWidth) / 2;
      // Posición vertical: centramos cada fila en su celda.
      const top = row * rowHeight + (rowHeight - circleSize) / 2;

      // Para cada jugador en la fila se calcula la posición horizontal.
      for (let i = 0; i < playersInRow; i++) {
        const left = leftOffset + i * (circleSize + spacing);
        players.push(
          <FPlayer
            key={`row-${row}-col-${i}`}
            size={circleSize}
            style={{
              position: "absolute",
              left,
              top,
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
  const totalPlayers = 10;
  const teamPlayers = totalPlayers / 2;

  return (
    <Div p={20} bg="red" h="100%">
      <Div id="first-half" borderWidth={1} flex={1}>
        {/* Posición fija del arquero (por ejemplo, en la parte superior) */}
        <Div h="15%" alignItems="center" justifyContent="center">
          <FPlayer size={scale(50)} />
        </Div>
        {/* Distribución de los field players en filas de máximo 4 */}
        <TeamField playersCount={teamPlayers} />
      </Div>
      <Div id="second-half" borderWidth={1} flex={1}>
        {/* Puedes aplicar la misma lógica para el otro equipo */}
      </Div>
    </Div>
  );
};

export default Field;
