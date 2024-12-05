import { FlatList } from "react-native";
import { Button, Div, Icon, Text } from "react-native-magnus";
import Match from "../../types/match.type";
import { scale } from "react-native-size-matters";
import { customTheme } from "../../utils/theme";
import { useSession } from "../../context/authProvider";
import { useState } from "react";
import InvitePlayersModal from "../modal/invitePlayersModal";
import { ConfirmationModal } from "../modal/confirmationModal";
import { useMutate } from "../../hooks/useMutate";
import matchService from "../../service/match.service";

interface MatchPlayersProps {
  players: Match["users"];
  match: Match; // Incluir la información del partido para obtener el userId del creador
}

const MatchPlayers: React.FC<MatchPlayersProps> = ({ players, match }) => {
  const { currentUser } = useSession();
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<string | null>(null);
  const [playerNameToDelete, setPlayerNameToDelete] = useState<string | null>(
    null
  );
  const [playersList, setPlayersList] = useState(players);

  // Función para abrir el modal de confirmación y establecer el jugador a eliminar
  const handleDeletePress = (playerId: string, playerName: string) => {
    setPlayerToDelete(playerId); // Establece el jugador a eliminar
    setPlayerNameToDelete(playerName); // Establece el nombre del jugador a eliminar
    setConfirmationVisible(true); // Muestra el modal de confirmación
  };

  // Función para cancelar la eliminación
  const cancelDelete = () => {
    setConfirmationVisible(false);
    setPlayerToDelete(null); // Limpiar el estado del jugador a eliminar
    setPlayerNameToDelete(null); // Limpiar el estado del nombre del jugador a eliminar
  };

  // useMutate para la eliminación de un usuario
  const removePlayerMutation = useMutate(
    async ({ matchId, userId }: { matchId: string; userId: string }) =>
      matchService.removeUserFromMatch(matchId, userId),
    (data) => {
      // Éxito: Actualizar la lista de jugadores en la UI
      setPlayersList((prevPlayers) =>
        prevPlayers.filter((player) => player._id !== data.userId)
      );
      console.log(
        `Usuario con ID ${data.userId} eliminado exitosamente del partido.`
      );
    },
    (error) => {
      console.error("Error al eliminar el usuario:", error);
    },
    true
  );

  const handleRemovePlayer = async (userId: string) => {
    try {
      await removePlayerMutation({ matchId: match._id, userId }); // Ejecuta la mutación pasando los IDs
    } catch (error) {
      console.error("Error en la eliminación:", error);
    }
  };

  // Función para confirmar la eliminación del jugador
  const confirmDelete = async () => {
    if (playerToDelete) {
      await handleRemovePlayer(playerToDelete); // Ejecuta la eliminación
      setConfirmationVisible(false); // Cierra el modal de confirmación
      setPlayerToDelete(null); // Limpia el estado del jugador a eliminar
      setPlayerNameToDelete(null); // Limpia el estado del nombre del jugador
    }
  };

  return (
    <Div>
      <Div row h={scale(60)} alignItems="center">
        <Text color="white" mb={scale(20)} mt={scale(10)} fontSize="lg">
          Jugadores Confirmados
        </Text>
        <Icon
          mb={scale(20)}
          mt={scale(10)}
          name="checkcircleo"
          ml="lg"
          color={customTheme.colors.tertiary}
          fontSize="lg"
        />
      </Div>

      <FlatList
        data={players}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Div>
            <Div
              rounded="lg"
              borderWidth={scale(1)}
              borderColor={customTheme.colors.accent}
              h={scale(60)}
              w={"100%"}
              bg={customTheme.colors.secondary}
              mb={scale(10)}
              row
              alignItems="center"
              justifyContent="space-between"
            >
              <Div row>
                <Div
                  ml={scale(15)}
                  rounded="circle"
                  h={scale(40)}
                  w={scale(40)}
                  mr={scale(20)}
                  bg="white"
                  borderColor={customTheme.colors.tertiary}
                  borderWidth={scale(1)}
                ></Div>
                <Text color="white" fontSize="lg">
                  {item.name}
                </Text>
              </Div>

              {/* Mostrar botón de "Eliminar" solo si el usuario actual es el creador del partido */}
              {currentUser?._id === match.userId && (
                <Button
                  alignSelf="auto"
                  mr={scale(5)}
                  bg={customTheme.colors.secondary}
                  onPress={() => handleDeletePress(item._id, item.name)}
                >
                  Eliminar
                </Button>
              )}
            </Div>
          </Div>
        )}
      />

      {/* Mostrar botón de "Invitar Jugadores" solo si el usuario actual es el creador del partido */}
      {currentUser?._id === match.userId && (
        <Div alignItems="center" mt="lg">
          {/* Botón para abrir el modal de selección de jugadores */}
          <Button
            mb="xl"
            bg={customTheme.colors.accent}
            color={customTheme.colors.background}
            block
            rounded="circle"
            onPress={() => setModalVisible(true)}
          >
            Invitar Jugadores
          </Button>
        </Div>
      )}

      {/* Modal para seleccionar jugadores */}
      <InvitePlayersModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        matchId={match._id} // Pasar el id del partido al modal
        emitterId={match.userId}
      />

      {/* Modal de confirmación de eliminación */}
      <ConfirmationModal
        isVisible={confirmationVisible}
        onConfirm={confirmDelete} // Llamar la función de confirmación
        onCancel={cancelDelete} // Llamar la función de cancelación
        title="Confirmar eliminación"
        subTitle={`¿Estás seguro de eliminar a ${playerNameToDelete} del partido?`}
        confirmText="Eliminar"
      />
    </Div>
  );
};

export default MatchPlayers;
