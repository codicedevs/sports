import React, { useState } from "react";
import { Div, Text, Button } from "react-native-magnus";
import { scale } from "react-native-size-matters";
import { ActivityIndicator, Image } from "react-native";
import { customTheme } from "../../utils/theme";
import petitionService from "../../service/petition.service";
import Petition from "../../types/petition.type";
import { formatDate } from "../../utils/date";

interface MatchInvitationProps {
  title: string;
  matchType: string;
  date: string;
  time: string;
  petition: Petition;
  onActionCompleted: () => void; 
}

const MatchInvitation: React.FC<MatchInvitationProps> = ({
  title,
  matchType,
  date,
  time,
  petition,
  onActionCompleted,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const aceptar = async () => {
    setIsLoading(true)
    try {
      await petitionService.acceptPetition(petition._id);
      onActionCompleted(); 
    } catch (e) {
      console.log(e);
    } finally {
    setIsLoading(false)
    }
  };

  const declinar = async () => {
    setIsLoading(true)
    try {
      await petitionService.declinePetition(petition._id);
      onActionCompleted(); 
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false)
    }
  };
  
  return (
    <Div
      bg="black"
      w={"100%"}
      h={scale(150)}
      rounded={customTheme.borderRadius.small}
      p={customTheme.spacing.medium}
    >
      <Text
        color={customTheme.colors.primary}
        fontSize={customTheme.fontSize.medium}
        fontFamily="NotoSans-Variable"
      >
        {title}
      </Text>

      <Div flexDir="row" alignItems="center">
        <Div flexDir="row" alignItems="center">
          <Image
            source={require("../../assets/IconPelota.png")}
            style={{ width: 18, height: 18, resizeMode: "contain" }}
          />
          <Text
            color="white"
            fontSize={customTheme.fontSize.medium}
            ml={customTheme.spacing.small}
            mr={customTheme.spacing.medium}
          >
            {matchType}
          </Text>
        </Div>

        <Image
          source={require("../../assets/iconTime.png")}
          style={{ width: 18, height: 18, resizeMode: "contain" }}
        />
        <Text
          color="white"
          ml={customTheme.spacing.small}
          fontSize={customTheme.fontSize.medium}
        >
          {
          date?
          formatDate(date)
          :
          "A definir"
          }
        </Text>

        {/* <Div>
          <Text
            color="white"
            fontSize={customTheme.fontSize.medium}
            ml={customTheme.fontSize.medium}
          >
            {time}
          </Text>
        </Div> */}
      </Div>

      <Div flexDir="row" mt={customTheme.fontSize.medium} style={{ gap: 20 }}>
        <Button
          flex={1}
          bg="black"
          borderColor="white"
          borderWidth={1}
          onPress={declinar}
          disabled={isLoading}
        >
          {
            isLoading?
            <ActivityIndicator size={"small"} color={'white'} />
            :
            <Text
            color="white"
            fontFamily="NotoSans-BoldItalic"
            fontSize={customTheme.fontSize.medium}
            >
            Rechazar
          </Text>
          }
        </Button>
        <Button flex={1} bg={customTheme.colors.primary} onPress={aceptar} disabled={isLoading}>
          {
            isLoading?
          <ActivityIndicator size={"small"} color={"black"} />
          :
          <Text
            fontFamily="NotoSans-BoldItalic"
            fontSize={customTheme.fontSize.medium}
          >
            Aceptar
          </Text>
          }
        </Button>
      </Div>
    </Div>
  );
};

export default MatchInvitation;
