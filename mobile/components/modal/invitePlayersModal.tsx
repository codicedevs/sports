import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import {
  Div,
  Modal,
  Text,
  Button,
  Icon,
  Input,
  Tag,
} from "react-native-magnus";
import { User } from "../../types/user.type";
import petitionService from "../../service/petition.service";
import userService from "../../service/user.service";
import useFetch from "../../hooks/useGet";
import { useQueryClient } from "@tanstack/react-query";
import { customTheme } from "../../utils/theme";
import { scale } from "react-native-size-matters";
import { useGlobalUI } from "../../context/globalUiContext";

interface PlayersModalProps {
  visible: boolean;
  onClose: () => void;
  matchId: string; // Pasar el id del partido
  emitterId: string;
}

const InvitePlayersModal: React.FC<PlayersModalProps> = ({
  visible,
  onClose,
  matchId,
  emitterId,
}) => {
  const [name, setName] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<User[]>([]);
  const { data: availablePlayers, error: playerError } = useFetch<User[]>({
    fn: () => userService.getUsersByName(name),
    key: ["available-players", name],
    triggerLoader: false,
    options: { enabled: name.length > 1 },
  });
  const { showSnackBar, showModal } = useGlobalUI();
  const queryClient = useQueryClient();

  const handleSelectPlayer = (player: User) => {
    // Verificar si el jugador ya está en la lista de seleccionados
    const isAlreadySelected = selectedPlayers.some(
      (selectedPlayer) => selectedPlayer._id === player._id
    );

    if (!isAlreadySelected) {
      // Si no está seleccionado, lo agregamos a la lista
      setSelectedPlayers((prevPlayers) => [...prevPlayers, player]);
    }
  };

  const handleDeselectPlayer = (player: User) => {
    setSelectedPlayers((prevPlayers) =>
      prevPlayers.filter((p) => p._id !== player._id)
    );
  };

  const handleSendInvitations = async () => {
    try {
      const petitions = selectedPlayers.map((player) => ({
        emitter: emitterId,
        receiver: player._id,
        match: matchId,
      }));

      // Enviar las peticiones una por una
      for (const petition of petitions) {
        await petitionService.create(petition);
      }
      showSnackBar("success", "Invitaciones enviadas exitosamente.");
      showModal("success", "Invitaciones enviadas exitosamente.");
      // Después de enviar todas las invitaciones, cierra el modal y limpia los jugadores seleccionados
      onClose();
      setSelectedPlayers([]);
    } catch (error) {
      console.error("Error al enviar las invitaciones:", error);
      showSnackBar("error", "Error al enviar las invitaciones.");
    }
  };

  const renderAvailablePlayer = ({ item }: { item: User }) => {
    const playerIsSelected = selectedPlayers?.find((u) => u._id === item._id);
    return (
      <TouchableOpacity
        onPress={() => handleSelectPlayer(item)}
        style={{
          borderWidth: 1,
          borderColor: playerIsSelected ? "green" : "gray300",
          borderRadius: 8,
          padding: 10,
          marginBottom: 10,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Div flexDir="row" justifyContent="space-between" alignItems="center">
          <Div>
            <Text fontSize="lg" fontWeight="bold">
              {item.name}
            </Text>
            <Text fontSize="lg" color="gray600">
              {item.email}
            </Text>
          </Div>
          {playerIsSelected && (
            <Icon name="checkcircle" color="green" fontSize="lg" />
          )}
        </Div>
      </TouchableOpacity>
    );
  };

  const renderSelectedPlayers = () => {
    return (
      <Div mb="lg" mt="lg" flexWrap="wrap" flexDir="row">
        {selectedPlayers.map((player) => (
          <Tag
            key={player._id}
            w={scale(100)}
            bg={customTheme.colors.accent}
            mr="md"
            mb="md"
            color="white"
            rounded="circle"
            p="xl"
            suffix={
              <TouchableOpacity onPress={() => handleDeselectPlayer(player)}>
                <Icon name="closecircleo" fontSize="lg" color="white" ml="lg" />
              </TouchableOpacity>
            }
          >
            {player.name}
          </Tag>
        ))}
      </Div>
    );
  };

  useEffect(() => {
    if (name.length > 2) {
      queryClient.invalidateQueries({ queryKey: ["available-players"] });
    }
  }, [name]);

  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <Div w="80%" bg="white" p="lg" rounded="lg" alignSelf="center">
        <Text fontSize="xl" fontWeight="bold" mb="lg">
          Invitar Jugadores
        </Text>
        <Text mb="lg" fontSize="lg">
          Selecciona los jugadores que deseas invitar al partido.
        </Text>

        <Input
          placeholder="Buscar Jugadores"
          onChangeText={setName}
          suffix={<Icon name="search1" fontSize="xl" />}
        />

        {playerError ? (
          <Text color="red500">
            Error al cargar jugadores: {playerError.message}
          </Text>
        ) : (
          <FlatList
            data={availablePlayers}
            renderItem={renderAvailablePlayer}
            keyExtractor={(item) => item._id}
          />
        )}

        {selectedPlayers && selectedPlayers.length > 0 && (
          <>
            <Text fontSize="lg" fontWeight="bold" mb="md" mt="xl">
              Jugadores seleccionados:
            </Text>
            {renderSelectedPlayers()}
          </>
        )}

        <Button
          mb="xl"
          mt="xl"
          bg={customTheme.colors.accent}
          color={customTheme.colors.background}
          block
          rounded="circle"
          onPress={handleSendInvitations}
        >
          Enviar Invitaciones
        </Button>

        <Button mt="lg" onPress={onClose} bg={customTheme.colors.accent}>
          Cerrar
        </Button>
      </Div>
    </Modal>
  );
};

export default InvitePlayersModal;
