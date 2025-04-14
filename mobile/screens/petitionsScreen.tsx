import React from "react";
import { Div, Text } from "react-native-magnus";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import petitionService from "../service/petition.service";
import { useSession } from "../context/authProvider";
import useFetch from "../hooks/useGet";
import Petition from "../types/petition.type";
import { QUERY_KEYS } from "../types/query.types";
import { customTheme } from "../utils/theme";
import MatchInvitation from "../components/cards/invitationCard";
import { ScrollView } from "react-native-gesture-handler";
import { scale, verticalScale } from "react-native-size-matters";
import { Image } from "react-native";

function PetitionScreen({
  navigation,
}: AppScreenProps<AppScreens.PETITIONS_SCREEN>) {
  const { currentUser } = useSession();

  const { data: petitions, refetch: refetchPetition } = useFetch<{
    results: Petition[];
  }>(
    () =>
      petitionService.getAll({
        populate: ["reference.id"],
        where: {
          status: ["pending"],
          receiver: [currentUser._id],
        },
      }),
    [QUERY_KEYS.PETITIONS, currentUser]
  );

  const handleActionCompleted = () => {
    refetchPetition();
  };

  return (
    <Div flex={1} mb={customTheme.spacing.medium} p={customTheme.spacing.small} bg="white">
      <Div p={customTheme.spacing.small}>
        <Text
          fontSize={customTheme.fontSize.large}
          fontFamily="NotoSans-BoldItalic"
        >
          Invitaciones
        </Text>
      </Div>
      <ScrollView>
        {petitions?.results?.length > 0 ? (
          petitions.results.map((p, index) => (
            <Div
              mb={customTheme.spacing.small}
              key={p.reference.id._id || index}
            >
              <MatchInvitation
                date={p.reference.id.date}
                time={p.reference.id.hour}
                title={p.reference.id.name}
                matchType={p.reference.type}
                petition={p}
                onActionCompleted={handleActionCompleted}
              />
            </Div>
          ))
        ) : (
          <Div h={scale(285)} justifyContent="flex-end" alignItems="center">
            <Image style={{ width: scale(79), height: verticalScale(75), alignSelf:"center" }} resizeMode="contain" source={require("../assets/search-no-result.png")} />
          <Text fontSize={customTheme.fontSize.medium} color={customTheme.colors.gray} textAlign='center'>No hay peticiones pendientes.</Text>
          </Div>
        )}
      </ScrollView>
    </Div>
  );
}

export default PetitionScreen;
