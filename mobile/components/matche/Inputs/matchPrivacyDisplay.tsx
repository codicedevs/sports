//hecho pa que no me rompa el matchPrivacyToggle.tsx
import React from "react";
import { Div, Text } from "react-native-magnus";
import { customTheme } from "../../../utils/theme";
import { verticalScale } from "react-native-size-matters";
import { TouchableOpacity } from "react-native";

type MatchPrivacyDisplayProps = {
  isPublic: boolean;
};

export default function MatchPrivacyDisplay({
  isPublic,
}: MatchPrivacyDisplayProps) {
  const isPrivate = !isPublic;

  return (
    <Div p={customTheme.spacing.small}>
      <Div h={verticalScale(40)} flexDir="row">
        <Div
          flex={1}
          h={verticalScale(40)}
          justifyContent="center"
          borderWidth={1}
          bg={isPrivate ? customTheme.colors.secondaryBackground : "white"}
        >
          <TouchableOpacity disabled>
            <Text color={isPrivate ? "white" : "black"} textAlign="center">
              Privado
            </Text>
          </TouchableOpacity>
        </Div>

        <Div
          flex={1}
          h={verticalScale(40)}
          justifyContent="center"
          borderWidth={1}
          bg={isPublic ? customTheme.colors.secondaryBackground : customTheme.colors.grayBackground}
        >
          <TouchableOpacity disabled>
            <Text color={isPublic ? "white" : "black"} textAlign="center">
              Público
            </Text>
          </TouchableOpacity>
        </Div>
      </Div>

      <Text fontFamily="NotoSans-Variable" textAlign="auto">
        Lorem ipsum odor amet, consectetuer adipiscing elit...
      </Text>
    </Div>
  );
}
