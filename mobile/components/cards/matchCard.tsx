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
      bg="black"
      shadow={"2xl"}
      shadowColor="gray"
      overflow="hidden"
    >
      {/* Parte izquierda */}
      <Div
        flex={2}
        justifyContent="center"
        alignItems="center"
        roundedLeft={"lg"}
        bg="red"
        p={10}
      >
        <Text fontSize={"4xl"} color="white" fontWeight="bold">
          2
        </Text>
        <Text fontSize={"md"} color="white" fontWeight="bold">
          MONDAY
        </Text>
        <Text fontSize={"sm"} color="white">
          10:00 PM
        </Text>
      </Div>

      {/* Parte derecha */}
      <Div flex={7} justifyContent="space-between" p={scale(10)}>
        
        <Div style={{ flex: 1, position: "relative" }}>
          <ImageBackground
            source={require("../../assets/escudo6.png")}
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
          
          <Div style={{ flex: 1, zIndex: 1, justifyContent: "space-between" }}>
            <Div>
              <Text fontSize={"lg"} color="white" fontWeight="bold">
                NOMBRE PARTIDO
              </Text>
            </Div>

            <Div flexDir="row" justifyContent="space-between" alignItems="center">
              <Text fontSize={"3xl"} color="white" fontWeight="bold">
                Detalles
              </Text>
              <Div
                w={30}
                h={30}
                rounded="circle"
                bg="green500"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={"md"} color="white" fontWeight="bold">
                  ?
                </Text>
              </Div>
              <Text fontSize={"3xl"} color="white" fontWeight="bold">
                Detalles
              </Text>
            </Div>
          </Div>
        </Div>

        <Div bg="black">
          <Text fontSize={"sm"} color="white">
            Abasto Fútbol 5
          </Text>
        </Div>
      </Div>
    </Div>
  );
};

export default MatchCard;
