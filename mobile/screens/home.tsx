import React, { useContext } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div, Text } from "react-native-magnus";
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
import { ScrollView } from "react-native-gesture-handler";
import { AuthContext } from "../context/authProvider";
import { customTheme } from "../utils/theme";
import TrianglesWithImages from "../components/triangleButtons";
import UpcomingMatchCard from "../components/UpcomingMatchesCard";

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const { data: matches } = useFetch(matchService.getAll, [QUERY_KEYS.MATCHES]);
  const { showModal } = useSession();

  return (
    <Div>
      <ScrollView>
        <Button onPress={showModal}>Abrir</Button>
        <Div>
          <Text
            fontSize={customTheme.fontSize.medium}
            fontFamily="NotoSans-Italic"
            ml={customTheme.spacing.small}
          >
            Próximos partidos
          </Text>
          <ScrollView horizontal>
            {matches?.results.map((u) => (
              <UpcomingMatchCard
              key={u._id}
              date={u.date}
              hour={u.hour}
              players={u.users}
              maxPlayers={u.playersLimit}
              titulo={u.name}
              />
            ))}
          </ScrollView>
        </Div>

        <Div>
          <Text
            ml={customTheme.spacing.small}
            fontSize={customTheme.fontSize.medium}
            fontFamily="NotoSans-Italic"
          >
            Mis partidos
          </Text>

          {matches?.results.map((m) => (
            <MatchCard
              key={m._id}
              matchId={m._id}
              dayOfWeek={m.dayOfWeek}
              date={m.date} // string, ej: "2026-07-15T17:48:00.000Z"
              time={m.hour} // number, ej: 22
              location={m.location} // { name, address }
              players={m.users}
              maxPlayers={m.playersLimit}
              sportMode={m.sportMode}
            />
          ))}
        </Div>
      </ScrollView>
    </Div>
  );
};

export default HomeScreen;
