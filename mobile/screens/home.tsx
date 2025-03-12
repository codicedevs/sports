import React, { useContext } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div } from "react-native-magnus";
import MatchPreferencesModal from "../components/modal/matchPreferences";
import { ModalContext } from "../context/modalProvider";
import MatchModalHandler from "../components/modal/matchModalHandler";
import useFetch from "../hooks/useGet";
import matchService from "../service/match.service";
import { QUERY_KEYS } from "../types/query.types";
import { TouchableOpacity } from "react-native";
import MatchCard from "../components/matchesCards";
import Match from "../types/match.type";
import { MatchDetails } from "../types/form.type";
import RestrictiveModal from "../components/modal/restrictiveModal";
import { useSession } from "../context/authProvider";


const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const { open, setOpen } = useContext(ModalContext);

  const { data: matches } = useFetch(matchService.getAll, [QUERY_KEYS.MATCHES]);
  const { showModal } = useSession();

 
  return (
    <Div>
      <Button onPress={showModal}>Abrir</Button>
    <Div>


      {matches?.results.map((m: Match) => (
        <MatchCard day={m.dayOfWeek} date={m.date} time={m.hour} location={m.location} players={m.users} maxPlayers={m.playersLimit}   />
      ))}
    </Div>
    </Div>
  );
};

export default HomeScreen;
