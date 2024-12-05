import React from "react";
import { Div, Text, Image } from "react-native-magnus";
import { customTheme } from "../utils/theme";
import { useSession } from "../context/authProvider";
import { scale, verticalScale } from "react-native-size-matters";

interface HeaderProps {
  text?: string;
}

const Header: React.FC<HeaderProps> = ({ text }) => {
  const { currentUser } = useSession();
  return (
    <Div
      flexDir="row"
      alignItems="center"
      justifyContent="space-between"
      px="xl"
      py="md"
      position="absolute"
      top={scale(25)}
      left={scale(-10)}
    >
      <Image
        borderColor={customTheme.colors.tertiary}
        borderWidth={2}
        rounded="circle"
        source={require("../assets/favicon.png")}
        h={verticalScale(40)}
        w={scale(40)}
        resizeMode="contain"
        right={scale(10)}
      />
      <Text
        fontSize={customTheme.fontSize.small}
        color={customTheme.colors.background}
      >
        {text ? text : `Bienvenido ${currentUser?.name}`}{" "}
      </Text>
    </Div>
  );
};

export default Header;
