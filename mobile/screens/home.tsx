import React, { useState } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div, Text } from "react-native-magnus";
import MatchInvitation from "../components/invitationCard";
import { scale } from "react-native-size-matters";
import { Image } from "react-native-magnus";
import players from "../assets/players.png";
import flecha from "../assets/flecha.png";
import reloj from "../assets/reloj.png";
import { customTheme } from "../utils/theme";
import UpcomingMatchCard from "../components/cards/UpcomingMatchesCard";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {

  return (
    <Div>
      {/* <Div style={{ padding: 10, marginTop: 30 }}>
        <MatchInvitation
          title="Ramiro te ha invitado a un partido"
          matchType="Futbol 5"
          date="Vi 25/01"
          time="19:00hs"
        />
      </Div> */}
      {/* <Div
        style={{
          padding: 10,
          marginTop: 20,
          width: "100%",
        }}
      >
        <Image
          style={{ width: "100%" }}
          source={require("../assets/fotoCardTorneo.png")}
        />
        <Div bg="black" w="100%" h={scale(30)} flexDir="row" justifyContent="space-between" alignItems="center">
          <Div flexDir="row" alignItems="center">
            <Text
              color="white"
              fontFamily="NotoSans-BoldItalic"
              fontSize={customTheme.fontSize.medium}
            >
              21/02
            </Text>
            <Text color="white">Sumá a tu equipo!</Text>
          </Div>
          <Div>
            <Image source={require("../assets/flechaCardTorneo.png")}></Image>
          </Div>
        </Div>
      </Div> */}
      {/* <Div
        h={"auto"}
        w={scale(150)}
        rounded="md"
        borderWidth={1}
        borderColor="black"
        pt={customTheme.spacing.small}
        pb={customTheme.spacing.small}
        alignItems="center"
      >
        <Div flexDir="row" alignItems="center" h={"auto"} mt={scale(5)}>
          <Image source={reloj} h={scale(17)} w={scale(17)} mr={5} resizeMode="contain" mb={scale(3)} />
          <Text w={128} h={"auto"} fontSize={17}>
            Vi 30/12 00:00
          </Text>
        </Div>

        <Text
          fontSize={20}
          p={10}
          mt={scale(5)}
          fontFamily="NotoSans-BoldItalic"
        >
          SUPER CLUB FUTBOL 5</Text>
        <Div
          w={128}
          h={"auto"}
          flexDir="row"
          alignItems="center"
          justifyContent="space-between"
          mt={scale(10)}
          mb={scale(6)}
        >
          <Div bg="#D9FA53" flexDir="row" h={"auto"} >
            <Image source={players} h={20} w={20} bg="#D9FA53" resizeMode="contain" />
            <Text ml={5} fontSize={customTheme.fontSize.medium} >6/10</Text>
          </Div>
          <Image source={flecha} h={22} w={22} resizeMode="contain" position="absolute" right={scale(-8)} />
        </Div>
      </Div> */}
      <UpcomingMatchCard fecha={"Vi 30/12 00:00"} cupo={"6/10"} titulo={"SUPER CLUB FUTBOL 5"} />
    </Div>
  );
};
export default HomeScreen;