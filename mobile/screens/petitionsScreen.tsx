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

  return (
    <Div mb={customTheme.spacing.medium} p={customTheme.spacing.small}>
       <ScrollView>
      {petitions?.results?.length > 0 ? (
        petitions.results.map((p, index) => (
          <Div mb={customTheme.spacing.small}> <MatchInvitation
            key={p.reference.id._id || index}
            date={p.reference.id.date}
            time={p.reference.id.hour}
            title={p.reference.id.name}
            matchType={p.reference.type}
            petition={p}
          /></Div>
        ))
      ) : (
        <Text>No hay peticiones pendientes.</Text>
      )}</ScrollView>
    </Div>
  );
}

export default PetitionScreen;
