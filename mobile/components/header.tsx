import React from "react";
import { Div, Text, Image } from "react-native-magnus";
import { customTheme } from "../utils/theme";
import { useSession } from "../context/authProvider";
import { scale, verticalScale } from "react-native-size-matters";

interface HeaderProps {
  text?: string;
}

export default function Header({ props }: HeaderProps) {
  return (
    <Div justifyContent="space-between" flexDir="row" w={"100%"}>
      <Div>
        <Text style={{ fontFamily: "RobotoCondensed-Regular", fontSize: 19 }}>
          Bienvenido
        </Text>
        <Text style={{ fontFamily: "RobotoCondensed-Bold", fontSize: 25 }}>
          Martin
        </Text>
      </Div>
      <Div>
        <Image
          style={{ width: 100, height: 100, marginTop: -25 }}
          source={require("@assets/logo.png")}
        />
      </Div>
    </Div>
  );
}
