import React, { useContext } from "react";
import { AppScreenProps, AppScreens } from "../navigation/screens";
import { Button, Div } from "react-native-magnus";
import MatchPreferencesModal from "../components/modal/matchPreferences";
import { ModalContext } from "../context/modalProvider";
import MatchModalHandler from "../components/modal/matchModalHandler";

const match = {
  "_id": "676d8fc473a26a0de5f38bd1",
  "name": "Nuevo match en Chacadosgol",
  "date": "2026-07-15T17:48:00.000Z",
  "dayOfWeek": 3,
  "hour": 14,
  "location": {
      "location": {
          "type": "Point",
          "coordinates": [
              -32.96262764365664,
              -60.62611040288317
          ]
      },
      "_id": "676d8f8f73a26a0de5f38bcd",
      "name": "Loyal Nueva",
      "address": "Zeballos 100",
      "matches": [
          "676d8fc473a26a0de5f38bd1",
          "676d903e73a26a0de5f38bde",
          "67a259e62a2f34d677a365a9",
          "67a259ec2a2f34d677a365b1",
          "67a259f72a2f34d677a365ba",
          "67a259fd2a2f34d677a365c3",
          "67c08a59a3812c32323efcbb",
          "67c08a7aa3812c32323efcc4",
          "67c08a86a3812c32323efccd",
          "67c08a9ba3812c32323efcd6",
          "67c08be061dd27b324340a7e",
          "67c08c1d61dd27b324340a89",
          "67c08dac61dd27b324340a9c"
      ],
      "__v": 13
  },
  "playersLimit": 10,
  "userId": "66e482584509915a15968bd7",
  "users": [
      {
          "_id": "66e482584509915a15968bd7",
          "name": "Diego",
          "email": "orefici.diego@gmail.com",
          "password": "$2a$08$o0DTmqgnmnr15V.yQ3h8GubntRrlLI2MuQuPyptrDBew79yWqYHxC",
          "friends": [],
          "roles": [
              "user"
          ],
          "matches": [
              "676989e3a25ffa7bee7dd6cb",
              "67698a46a25ffa7bee7dd6d6",
              "67698a76a25ffa7bee7dd6e0",
              "676d8e860018e59f40c14291",
              "676d8e8f0018e59f40c14299",
              "676d8e990018e59f40c142a1",
              "676d8f0b73a26a0de5f38b96",
              "676d8f0d73a26a0de5f38b9f",
              "676d8f1373a26a0de5f38ba8",
              "676d8f1b73a26a0de5f38bb1",
              "676d8f3d73a26a0de5f38bba",
              "676d8f3f73a26a0de5f38bc3",
              "676d8fc473a26a0de5f38bd1",
              "676d903e73a26a0de5f38bde",
              "67c876abeb647cc591249371",
              "67c87724eb647cc591249380",
              "67c9b956522a1ac0123270b2",
              "67c9b9d79d3def5e949d58e0",
              "67c9b9f49d3def5e949d58e4",
              "67c9ba5b9d3def5e949d58ec",
              "67c9bac5cb4a2b3865879fee",
              "67c9bbd9b4818d5a9cb22560"
          ],
          "__v": 22,
          "pushToken": "ExponentPushToken[m8DueZAoL95kxdFT0UwzO4]",
          "groups": []
      },
      {
          "_id": "679b940c3dc4af55650b6049",
          "name": "diego orefici",
          "email": "orefici.diego.wise@gmail.com",
          "friends": [],
          "roles": [
              "user"
          ],
          "matches": [],
          "groups": [],
          "__v": 0
      },
      {
          "_id": "679ba8a55768ea11f86cdf9e",
          "name": "Administrator Administrador",
          "email": "administrator@codice.dev",
          "friends": [],
          "roles": [
              "user"
          ],
          "matches": [],
          "groups": [],
          "__v": 0
      }
  ],
  "sportMode": "67698a40a25ffa7bee7dd6d2",
  "open": true,
  "__v": 2,
 "formations": {
        "team1": [
            {
                "position": 5,
                "userId": {
                    "_id": "679b940c3dc4af55650b6049",
                    "name": "diego orefici",
                    "email": "orefici.diego.wise@gmail.com",
                    "friends": [],
                    "roles": [
                        "user"
                    ],
                    "matches": [],
                    "groups": [],
                    "__v": 0
                }
            },
            {
                "position": 2,
                "userId": {
                    "groups": [],
                    "_id": "671a838fa244aadecccd9904",
                    "name": "diego11",
                    "email": "orefici.diego+11@gmail.com",
                    "password": "$2a$08$RtOCiPm/e0z9BxkpWkYgDue4aKJdxCPPymqn5BIv4YNkl/q81ltsS",
                    "friends": [],
                    "roles": [
                        "user"
                    ],
                    "matches": [],
                    "__v": 0
                }
            },
            {
                "position": 3,
                "userId": {
                    "groups": [],
                    "_id": "671a84b9ba1c16df2574f220",
                    "name": "diego12",
                    "email": "orefici.diego+12@gmail.com",
                    "password": "$2a$08$TttXEqfsodjgdEKA47w.A.skUZ3gZw6A4zMiVxdmADztDyY1XyBAW",
                    "friends": [],
                    "roles": [
                        "user"
                    ],
                    "matches": [],
                    "__v": 0
                }
            },
            {
                "position": 4,
                "userId": {
                    "groups": [],
                    "_id": "671a84bfba1c16df2574f222",
                    "name": "diego14",
                    "email": "orefici.diego+14@gmail.com",
                    "password": "$2a$08$PWHnSbsyYvxodTpuI3ZBxu8SBofzWBzBzBnpqCaTWDO6zNBcylw9a",
                    "friends": [],
                    "roles": [
                        "user"
                    ],
                    "matches": [],
                    "__v": 0
                }
            }
        ],
        "team2": [
            {
                "position": 1,
                "userId": {
                    "_id": "66e482584509915a15968bd7",
                    "name": "Diego",
                    "email": "orefici.diego@gmail.com",
                    "password": "$2a$08$o0DTmqgnmnr15V.yQ3h8GubntRrlLI2MuQuPyptrDBew79yWqYHxC",
                    "friends": [],
                    "roles": [
                        "user"
                    ],
                    "matches": [
                        "676989e3a25ffa7bee7dd6cb",
                        "67698a46a25ffa7bee7dd6d6",
                        "67698a76a25ffa7bee7dd6e0",
                        "676d8e860018e59f40c14291",
                        "676d8e8f0018e59f40c14299",
                        "676d8e990018e59f40c142a1",
                        "676d8f0b73a26a0de5f38b96",
                        "676d8f0d73a26a0de5f38b9f",
                        "676d8f1373a26a0de5f38ba8",
                        "676d8f1b73a26a0de5f38bb1",
                        "676d8f3d73a26a0de5f38bba",
                        "676d8f3f73a26a0de5f38bc3",
                        "676d8fc473a26a0de5f38bd1",
                        "676d903e73a26a0de5f38bde",
                        "67c876abeb647cc591249371",
                        "67c87724eb647cc591249380",
                        "67c9b956522a1ac0123270b2",
                        "67c9b9d79d3def5e949d58e0",
                        "67c9b9f49d3def5e949d58e4",
                        "67c9ba5b9d3def5e949d58ec",
                        "67c9bac5cb4a2b3865879fee",
                        "67c9bbd9b4818d5a9cb22560"
                    ],
                    "__v": 22,
                    "pushToken": "ExponentPushToken[m8DueZAoL95kxdFT0UwzO4]",
                    "groups": []
                }
            },
            {
                "position": 4,
                "userId": {
                    "_id": "66f7055a26fc7aa2eabb94ef",
                    "name": "diego+1",
                    "email": "orefici.diego+1@gmail.com",
                    "password": "$2a$08$nRMMts1FCaJnZEpNVsKmYOt24hBCKsQcs1BUhWqoySiWNX8uQ0I/W",
                    "friends": [],
                    "roles": [
                        "user"
                    ],
                    "matches": [
                        "676d7ddcba672837f4983212",
                        "676d7dddba672837f498321b",
                        "67c08a59a3812c32323efcbb",
                        "67c08a7aa3812c32323efcc4",
                        "67c08a86a3812c32323efccd",
                        "67c08a9ba3812c32323efcd6",
                        "67c08be061dd27b324340a7e",
                        "67c08c1d61dd27b324340a89",
                        "67c08dac61dd27b324340a9c"
                    ],
                    "__v": 9,
                    "groups": [],
                    "profile": {
                        "preferredZones": [],
                        "preferredSports": [],
                        "preferredSportModes": [
                            "67c873ffeb647cc591249358"
                        ],
                        "availability": []
                    }
                }
            },
            {
                "position": 5,
                "userId": {
                    "groups": [],
                    "_id": "66f7056226fc7aa2eabb94f1",
                    "name": "diego+2",
                    "email": "orefici.diego+2@gmail.com",
                    "password": "$2a$08$IeedVp5.m1Kfk1nQxGhdEutbQNxJ9vVGGRMgiunD0ToRVDih2J0/2",
                    "friends": [],
                    "roles": [
                        "user"
                    ],
                    "matches": [
                        "66f70aee1d3b62c081370f89"
                    ],
                    "__v": 1
                }
            },
            {
                "position": 2,
                "userId": {
                    "_id": "66f7057126fc7aa2eabb94f7",
                    "name": "diego+5",
                    "email": "orefici.diego+5@gmail.com",
                    "password": "$2a$08$JlU37uYDM4QJGN1HGkRJIeJLfOVLQ0kezyFYnQ.QUs.bC0yzduOmW",
                    "friends": [],
                    "roles": [
                        "user"
                    ],
                    "matches": [
                        "67a259e62a2f34d677a365a9",
                        "67a259ec2a2f34d677a365b1",
                        "67a259f72a2f34d677a365ba",
                        "67a259fd2a2f34d677a365c3"
                    ],
                    "__v": 4,
                    "groups": []
                }
            },
            {
                "position": 3,
                "userId": {
                    "_id": "679ba8a55768ea11f86cdf9e",
                    "name": "Administrator Administrador",
                    "email": "administrator@codice.dev",
                    "friends": [],
                    "roles": [
                        "user"
                    ],
                    "matches": [],
                    "groups": [],
                    "__v": 0
                }
            }
        ]
    }
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

// el que envia 66e482584509915a15968bd7

//
