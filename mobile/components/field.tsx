import React, { useState } from "react";
import { Div } from "react-native-magnus";
import { scale } from "react-native-size-matters";

const MAX_CIRCLE_SIZE = scale(50);

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
      const playersInRow = row < numRows - 1 ? maxPerRow : fieldPlayers - row * maxPerRow;
      const rowWidth = playersInRow * circleSize + (playersInRow - 1) * spacing;
      const leftOffset = (layout.width - rowWidth) / 2;
      const top = row * rowHeight + (rowHeight - circleSize) / 2;

      for (let i = 0; i < playersInRow; i++) {
        const left = leftOffset + i * (circleSize + spacing);
        players.push(
          <FPlayer
            key={`row-${row}-col-${i}`}
            size={circleSize}
            style={{ position: "absolute", left, top }}
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
        {/* Posición fija del arquero */}
        <Div h="15%" alignItems="center" justifyContent="center">
          <FPlayer size={scale(50)} />
        </Div>
        <TeamField playersCount={teamPlayers} />
      </Div>
      <Div id="second-half" borderWidth={1} flex={1}>
      </Div>
    </Div>
  );
};

export default Field;
