import React, { useEffect, useState } from "react";
import { Button, Div, Image, Modal, Text } from "react-native-magnus";
import { customTheme } from "../../utils/theme";
import Autocomplete from "react-native-autocomplete-input";
import { scale } from "react-native-size-matters";
import { User } from "../../types/user.type";
import userService from "../../service/user.service";
import useFetch from "../../hooks/useGet";
import { QUERY_KEYS } from "../../types/query.types";

interface InviteModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function InviteModal({ open, setOpen }: InviteModalProps) {
  const [query, setQuery] = useState("");
  const [selectedPlayer, setSelectedPlayers] = useState<User[]>([]);

  const handlePlayersSelected = (player: User) => {
    if (!selectedPlayer.includes(player)) {
      setSelectedPlayers([...selectedPlayer, player]);
      setQuery("");
    }
  };

  const { data: playersData } = useFetch(userService.getAll, [
    QUERY_KEYS.USERS,
  ]);
  if (!playersData) return null;

  const filteredPlayers = playersData.results.filter((p: any) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleRemovePlayer = (id: string) => {
    setSelectedPlayers((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <Modal isVisible={open} onBackButtonPress={() => setOpen(false)}>
      <Div
        flexDir="row"
        p={customTheme.spacing.small}
        justifyContent="center"
        alignItems="center"
      >
        <Button bg="white" onPress={() => setOpen(false)}>
          <Text color="black" fontSize={customTheme.fontSize.medium}>
            X
          </Text>
        </Button>
        <Div alignItems="center" w="93%">
          <Text fontSize={customTheme.fontSize.medium}>Elegir jugador</Text>
        </Div>
      </Div>

      <Div position="relative">
        <Autocomplete
          data={filteredPlayers}
          value={query}
          onChangeText={setQuery}
          placeholder="Busca un jugador..."
          containerStyle={{
            padding: scale(10),
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            zIndex: 1,
          }}
          style={{
            height: 50,
            borderWidth: 0,
            borderRadius: 2,
            fontSize: scale(15),
          }}
          hideResults={query === ""}
          flatListProps={{
            keyExtractor: (item: any) => item._id,
            keyboardShouldPersistTaps: "always",
            style: {
              borderWidth: 0,
              
            },
            renderItem: ({ item }) => (
              <Div
                ml={customTheme.spacing.small}
                flexDir="row"
                alignItems="center"
              >
                <Image
                  source={require("../../assets/beardman.png")}
                  resizeMode="contain"
                  w={28}
                  h={28}
                />
                <Text
                  style={{
                    padding: 5,
                    borderWidth: 0,
                    marginLeft: scale(5),
                  }}
                  fontFamily="NotoSans-Variable"
                  fontSize={customTheme.fontSize.medium}
                  onPress={() => handlePlayersSelected(item)}
                >
                  {item.name}
                </Text>
              </Div>
            ),
          }}
          listContainerStyle={{
            borderTopWidth: 0,
            borderWidth: 1,
            borderColor: "#cfc8c8",
            height:scale(37),
            marginTop:scale(5)
          }}
        />

        <Div mt={60} p={customTheme.spacing.medium}>
          <Text textAlign="center" fontSize={customTheme.fontSize.medium}>
            Jugadores seleccionados:
          </Text>
          {selectedPlayer.map((player, index) => (
            <Div
              key={index}
              flexDir="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Div flexDir="row">
                <Image
                 source={require("../../assets/icon.png")} 
                 resizeMode="contain"
                 w={scale(28)}
                 h={scale(28)}/>
              <Text
                fontFamily="NotoSans-Variable"
                fontSize={customTheme.fontSize.medium}
                ml={scale(5)}
              >
                {player.name}
              </Text></Div>
              <Button bg="white" color="black" onPress={() => handleRemovePlayer(player._id)} >
                X
              </Button>
            </Div>
          ))}
        </Div>
      </Div>
    </Modal>
  );
}