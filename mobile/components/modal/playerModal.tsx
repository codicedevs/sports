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
import userService from "../../service/user.service";
import useFetch from "../../hooks/useGet";
import { useQueryClient } from "@tanstack/react-query";
import { customTheme } from "../../utils/theme";
import { scale } from "react-native-size-matters";
import { useSession } from "../../context/authProvider";

interface PlayersModalProps {
  visible: boolean;
  onClose: () => void;
  selectedPlayers: User[];
  onSelect: (player: User) => void;
  onDeselect: (player: User) => void;
}

const PlayersModal: React.FC<PlayersModalProps> = ({
  visible,
  onClose,
  selectedPlayers,
  onSelect,
  onDeselect,
}) => {
  const [name, setName] = useState("");
  const { currentUser } = useSession();
  // Llamada para obtener los usuarios disponibles usando useFetch
  const { data: availablePlayers, error: playerError } = useFetch<User[]>({
    fn: () => userService.getUsersByName(name),
    key: ["available-players", name],
    triggerLoader: false,
    options: { enabled: name.length > 1 },
  });
  const queryClient = useQueryClient();

  const renderAvailablePlayer = ({ item }: { item: User }) => {
    const playerIsSelected =
      selectedPlayers && selectedPlayers.find((u) => u._id === item._id);
    return (
      <TouchableOpacity
        onPress={() => onSelect(item)}
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

  // Función para renderizar los tags de los jugadores seleccionados
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
              <TouchableOpacity onPress={() => onDeselect(player)}>
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
  const filteredPlayers = availablePlayers?.filter(
    (player) => player._id !== currentUser._id
  );

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
          Manda invitaciones de tu partido a los usuarios que se te cante el
          orto
        </Text>

        <Input
          placeholder="Buscar Jugadores"
          onChangeText={setName}
          suffix={<Icon name="search1" fontSize="xl" />}
        ></Input>
        {playerError ? (
          <Text color="red500">
            Error al cargar jugadores: {playerError.message}
          </Text>
        ) : (
          <FlatList
            data={filteredPlayers}
            renderItem={renderAvailablePlayer}
            keyExtractor={(item) => item._id}
          />
        )}
        <Button mt="lg" onPress={onClose} bg={customTheme.colors.accent}>
          Cerrar
        </Button>

        {/* Mostrar jugadores seleccionados como tags */}
        {selectedPlayers && selectedPlayers.length > 0 && (
          <>
            <Text fontSize="lg" fontWeight="bold" mb="md" mt="xl">
              Jugadores seleccionados:
            </Text>
            {renderSelectedPlayers()}
          </>
        )}
      </Div>
    </Modal>
  );
};

export default PlayersModal;
