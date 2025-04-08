import React, { useState } from "react";
import { Button, Div, Image, Modal, Text } from "react-native-magnus";
import { customTheme } from "../../utils/theme";
import Autocomplete from "react-native-autocomplete-input";
import { scale, verticalScale } from "react-native-size-matters";
import { User } from "../../types/user.type";
import userService from "../../service/user.service";
import petitionService from "../../service/petition.service";
import useFetch from "../../hooks/useGet";
import { QUERY_KEYS } from "../../types/query.types";
import { useSession } from "../../context/authProvider";
import { useGlobalUI } from "../../context/globalUiContext";

interface InviteModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  matchId: string;
}

export default function InviteModal({
  open,
  setOpen,
  matchId,
}: InviteModalProps) {
  const { showSnackBar } = useGlobalUI();
  const [query, setQuery] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<User[]>([]);
  const { currentUser } = useSession();
  const handlePlayersSelected = (player: User) => {
    if (!selectedPlayers.some((p) => p._id === player._id)) {
      setSelectedPlayers([...selectedPlayers, player]);
      setQuery("");
    }
  };

  const { data: playersData } = useFetch(userService.getAll, [
    QUERY_KEYS.USERS,
  ]);
  if (!playersData) return null;

  const filteredPlayers = playersData.results.filter((p: User) =>
    p.name.toLowerCase().includes(query.toLowerCase()) && !selectedPlayers.some((sp:User)=>sp._id === p._id )
  );

  const handleRemovePlayer = (id: string) => {
    setSelectedPlayers((prev) => prev.filter((p) => p._id !== id));
  };

  async function handleSendInvitations() {
 
    try {
      for (const players of selectedPlayers) {
        const petitionload = {
          emitter: currentUser._id,
          receiver: players._id,
          reference: {
            type: "Match",
            id: matchId,
          },
        };
        await petitionService.create(petitionload);
      }
      console.log("Invitaciones enviadas");
      showSnackBar("success", "Invitaación enviada!");

      setSelectedPlayers([]);
      setOpen(false);
    } catch (error) {
      console.error("Error al enviar las invitaciones:", error);
    }
  }

  return (
    <Modal isVisible={open} onBackButtonPress={() => setOpen(false)}>
      <Div
        flexDir="row"
        p={customTheme.spacing.small}
        justifyContent="center"
        alignItems="center"
      >
        {" "}
        <Div p={customTheme.spacing.small} w="93%">
          <Text
            fontSize={customTheme.fontSize.title}
            fontFamily="NotoSans-ExtraBoldItalic"
          >
            Elegir jugador
          </Text>
        </Div>
        <Button bg="white" onPress={() => setOpen(false)}>
          <Text color="black" fontSize={customTheme.fontSize.title}>
            X
          </Text>
        </Button>
      </Div>

      {/* autocomplete */}
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
            keyExtractor: (item: User) => item._id,
            keyboardShouldPersistTaps: "always",
            style: { borderWidth: 0 },
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
                  style={{ padding: 5, borderWidth: 0, marginLeft: scale(5) }}
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
            height: verticalScale(150),
            backgroundColor: "white",
          }}
        />

        {/* jug selecc.*/}
        <Div mt={60} p={customTheme.spacing.medium}>
          {selectedPlayers.length > 0 && (
            <Text
              textAlign="center"
              fontSize={customTheme.fontSize.medium}
              fontFamily="NotoSans-ExtraBoldItalic"
            >
              Jugadores seleccionados:
            </Text>
          )}
          {selectedPlayers.map((player, index) => (
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
                  h={scale(28)}
                />
                <Text
                  fontFamily="NotoSans-Variable"
                  fontSize={customTheme.fontSize.medium}
                  ml={scale(5)}
                >
                  {player.name}
                </Text>
              </Div>
              <Button
                bg="white"
                color="black"
                onPress={() => handleRemovePlayer(player._id)}
              >
                X
              </Button>
            </Div>
          ))}
        </Div>
      </Div>

      <Div
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        bg="white"
        borderTopWidth={1}
        borderTopColor="rgb(223, 223, 220)"
        p={customTheme.spacing.medium}
        alignItems="center"
        justifyContent="center"
      >
        {/* Botón “Elegir” */}

        {selectedPlayers.length > 0 && (
          <Button
            bg={customTheme.colors.secondaryBackground}
            onPress={handleSendInvitations}
            w="100%"
            h={scale(45)}
            rounded="md"
          >
            <Text
              color="white"
              textAlign="center"
              fontSize={customTheme.fontSize.medium}
              fontFamily="NotoSans-BoldItalic"
            >
              Enviar invitación
            </Text>
          </Button>
        )}
      </Div>
    </Modal>
  );
}
