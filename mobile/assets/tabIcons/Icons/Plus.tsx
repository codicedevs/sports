import React from "react";
import Svg, { Path } from "react-native-svg";

const PlusIcon = ({ width = 20, height = 20, fill = "#FEFFFA" }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path
        d="M20 8.75H11.25V0H8.75V8.75H0V11.25H8.75V20H11.25V11.25H20V8.75Z"
        fill={fill}
      />
    </Svg>
  );
};

export default PlusIcon;
