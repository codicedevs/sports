import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground } from "react-native";
import { Div, Text } from "react-native-magnus";
import { scale, verticalScale } from "react-native-size-matters";

const MatchCard = () => {
  return (
    <Div
      h={verticalScale(140)}
      w={"95%"}
      flexDir="row"
      rounded={"lg"}
      bg="grey"
      shadow={"2xl"}
      shadowColor="gray"
      overflow="hidden"
      ml={10}
    >
      {/* Parte izquierda */}

      <ImageBackground
        source={require("../../assets/cesped1.jpg")}
        style={{
          flex: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
        imageStyle={{
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          opacity: 0.9,
        }}
      >
          <LinearGradient
    colors={["rgba(169, 169, 160, 0)", "rgba(169, 169, 169, 0.7)"]} 
    style={{
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
    }}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
  />
        <Div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)", // Negro semitransparente
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}
        />
        <Text fontSize={35} color="white" fontFamily="RobotoCondensed-Bold">
          2
        </Text>
        <Text
          fontSize={"md"}
          color="white"
          fontFamily="RobotoCondensed-Regular"
        >
          MONDAY
        </Text>
        <Text
          fontSize={"sm"}
          color="white"
          fontFamily="RobotoCondensed-Regular"
        >
          10:00 PM
        </Text>
      </ImageBackground>

      {/* Parte derecha */}
      <Div flex={7} justifyContent="space-between">
        <LinearGradient
          colors={[
            "rgba(20, 20, 20, 8)", // Gris oscuro arriba
            "rgba(30, 30, 30, 0.7)", // Gris centro
            "rgba(20, 20, 20, 0.5)",
          ]}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%", // Cubre toda la tarjeta
            top: 0,
          }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <Div style={{ flex: 1, position: "relative" }}>
          <ImageBackground
            source={require("../../assets/Escudorosariocentral.png")}
            style={{
              position: "absolute",
              top: 0,
              right: -90,
              width: "100%",
              height: "110%",
            }}
            imageStyle={{
              opacity: 0.2,
            }}
          />

          <Div
            style={{ flex: 1, zIndex: 1, justifyContent: "space-between" }}
            p="lg"
          >
            <Div>
              <Text
                fontSize={25}
                color="white"
                fontFamily="RobotoCondensed-Bold"
              >
                NOMBRE PARTIDO
              </Text>
            </Div>

            <Div
              flexDir="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text
                fontSize={"3xl"}
                color="white"
                fontFamily="RobotoCondensed-Regular"
              >
                Detalles
              </Text>
              <Div
                w={30}
                h={30}
                rounded="circle"
                bg="black"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={"md"} color="white" fontWeight="bold">
                  ?
                </Text>
              </Div>
              <Text
                fontSize={"3xl"}
                color="white"
                fontFamily="RobotoCondensed-Regular"
              >
                Detalles
              </Text>
            </Div>
          </Div>
        </Div>

        <Div bg="black" p="lg">
          <Text
            color="white"
            fontFamily="RobotoCondensed-Regular"
            textTransform="uppercase"
            fontSize={12}
          >
            Abasto Fútbol 5
          </Text>
        </Div>
      </Div>
    </Div>
  );
};

export default MatchCard;
