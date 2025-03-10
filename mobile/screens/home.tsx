import React, { useContext } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div } from "react-native-magnus";
import MatchModalHandler from "../components/modal/matchModalHandler";
import MatchPreferencesModal from "../components/modal/matchPreferences";
import { ModalContext } from "../context/modalProvider";
import Field from "../components/field";
import { useSession } from "../context/authProvider";

const match = {
  "_id": "67003e15c94369186bbdfb32",
  "name": "Partido 1",
  "playersLimit": 10,
  "userId": {
    "friends": [],
    "roles": [
      "user"
    ],
    "matches": [],
    "groups": [],
    "_id": "67c1f5c4810de319ef318ade"
  },
  "users": [
    {
      "friends": [],
      "roles": [
        "user"
      ],
      "matches": [],
      "groups": [],
      "_id": "67c1f5c4810de319ef318adf"
    },
    {
      "friends": [],
      "roles": [
        "user"
      ],
      "matches": [],
      "groups": [],
      "_id": "67c1f5c4810de319ef318ae0"
    },
    {
      "friends": [],
      "roles": [
        "user"
      ],
      "matches": [],
      "groups": [],
      "_id": "67c1f5c4810de319ef318ae1"
    }
  ],
  "__v": 2
}

const HomeScreen: React.FC<AppScreenProps<AppScreens.HOME_SCREEN>> = ({
  navigation,
}) => {
  const { open, setOpen } = useContext(ModalContext);

  const handleMatchCreated = (createdMatchId: string) => {
   
    navigation.navigate(AppScreens.MATCH_DETAIL, { id: createdMatchId });
  };

  return (
    <Div flexDir="row" justifyContent="center">
      <Button  onPress={() => setOpen(true)}>
        Abrir
      </Button>
      <MatchModalHandler
        open={open}
        setOpen={setOpen}
        onMatchCreated={handleMatchCreated}
      />
    </Div>

  );
};

export default HomeScreen;
