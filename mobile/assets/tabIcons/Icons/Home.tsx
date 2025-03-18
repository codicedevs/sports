import React from "react";
import Svg, { Path } from "react-native-svg";

const HomeIcon = ({ width = 24, height = 28, fill = "#FEFFFA" }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 28" fill="none">
      <Path
        d="M14.3562 27.1507V18.8329H9.64384V27.1507L0 27.1288V10.8439L12 0.849365L24 10.8439V27.1288L14.3562 27.1507ZM7.63836 16.8274H16.3507V25.1453H21.9945V11.7754L12 3.44663L1.99452 11.7754V25.1233H7.63836V16.8274Z"
        fill={fill}
      />
    </Svg>
  );
};

export default HomeIcon;
