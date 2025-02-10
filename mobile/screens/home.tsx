import React, { useState } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div, Text } from "react-native-magnus";
import { scale } from "react-native-size-matters";
import MatchInvitation from "../components/invitationCard";
import { Image, Modal, ScrollView, View } from "react-native";
import { customTheme } from "../utils/theme";
import TournamentCard from "../components/tournamentCard";

import { ImageBackground } from "react-native";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Div>
      {" "}
      /{/*carta superior de invitacion =)*/}
      <Div style={{ padding: customTheme.spacing.small, marginTop: scale(26) }}>
        <MatchInvitation
          title="Ramiro te ha invitado a un partido"
          matchType="Futbol 5"
          date="Vi 25/01"
          time="19:00hs"
        />
      </Div>{" "}
      {/* carta del trneo =$*/}
      <TournamentCard
        title="TORNEO VERANO FUTBOL ONCE"
        date="21/02"
        imageSource={require("../assets/fotoCardTorneo.png")}
      />
      {/* contenedor gral */}
      <Div alignItems="center" p={customTheme.spacing.small} mt={scale(15)}>
        {/* contenedor carta*/}
        <Div
          borderWidth={scale(1)}
          rounded={customTheme.borderRadius.medium}
          w={"100%"}
          h={scale(150)}
          flexDir="row"
        >
          {/* cont amarillo */}
          <Div
            bg={customTheme.colors.primary}
            flex={2}
            justifyContent="center"
            rounded={customTheme.borderRadius.medium}
          >
            <Div justifyContent="space-evenly" alignItems="center">
              <Text
                fontFamily="Notosans-Regular"
                fontSize={customTheme.fontSize.medium}
              >
                Miercoles
              </Text>
              <Text
                textAlign="center"
                fontFamily="NotoSans-ExtraBold"
                fontSize={customTheme.fontSize.xxxl}
              >
                9
              </Text>
              <Div flexDir="row" alignItems="center">
                <Image
                  source={require("../assets/iconTime.png")}
                  style={{
                    width: scale(15),
                    height: scale(15),
                    resizeMode: "contain",
                    tintColor: "black",
                  }}
                />
                <Text
                  fontFamily="Notosans-Regular"
                  fontSize={customTheme.fontSize.medium}
                  ml={customTheme.spacing.small}
                >
                  22:00 hs
                </Text>
              </Div>
            </Div>
            <Div />
          </Div>
          {/* cont bco */}
          <View
            style={{
              flex: 3,
              alignItems: "center",
              borderStyle: "dashed",

              borderLeftWidth: scale(1.2),
            }}
          >
            <Div>
              <Text
                fontSize={customTheme.fontSize.title}
                p={customTheme.spacing.small}
              >
                LA CNACHITA{"\n"}DIRECCION 1222
              </Text>
            </Div>
            <Div
              h="47%"
              w="100%"
              justifyContent="flex-end"
              p={customTheme.spacing.medium}
            >
              <Div
                flexDir="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Div flexDir="row">
                  <Image
                    source={require("../assets/IconPelota.png")}
                    style={{
                      width: scale(15),
                      height: scale(15),
                      resizeMode: "contain",
                      tintColor: "black",
                    }}
                  />
                  <Text
                    fontFamily="Notosans-Regular"
                    fontSize={customTheme.fontSize.medium}
                    ml={scale(3)}
                    mr={customTheme.spacing.medium}
                  >
                    5
                  </Text>
                  <Image
                    source={require("../assets/iconUser.png")}
                    style={{
                      width: scale(15),
                      height: scale(15),
                      resizeMode: "contain",
                      tintColor: "black",
                    }}
                  />
                  <Text
                    fontFamily="Notosans-Regular"
                    fontSize={customTheme.fontSize.medium}
                    ml={scale(3)}
                  >
                    5/10
                  </Text>
                </Div>
                <Div>
                  <Image
                    source={require("../assets/iconNext.png")}
                    style={{
                      width: scale(15),
                      height: scale(15),
                      resizeMode: "contain",
                      tintColor: "black",
                    }}
                  ></Image>
                </Div>
              </Div>
            </Div>
          </View>
        </Div>
      </Div>
    </Div>
  );
};

export default HomeScreen;
