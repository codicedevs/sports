import React, { useState } from "react";
import Match from "../../types/match.type";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppScreens, AppScreensParamList } from "../../navigation/screens";
import { useNavigation } from "@react-navigation/native";
import { customTheme } from "../../utils/theme";
import { useSession } from "../../context/authProvider";
import { Button, Div, Icon } from "react-native-magnus";
import { scale } from "react-native-size-matters";
import matchService from "../../service/match.service";
import { useMutate } from "../../hooks/useMutate";
import { useGlobalUI } from "../../context/globalUiContext";
import { ConfirmationModal } from "../modal/confirmationModal";

interface MatchButtonsProps {
  match: Match;
  modalVisible: boolean;
  deleteModalVisible: boolean;
  setModalVisible: (isVisible: boolean) => void;
  setDeleteModalVisible: (isVisible: boolean) => void;
}

type navigationProps = NativeStackNavigationProp<
  AppScreensParamList,
  AppScreens.EDIT_MATCH
>;

const MatchButtons: React.FC<MatchButtonsProps> = ({
  match,
  modalVisible,
  deleteModalVisible,
  setModalVisible,
  setDeleteModalVisible,
}) => {
  const navigation = useNavigation<navigationProps>();
  const { currentUser } = useSession();

  const { showSnackBar, showModal } = useGlobalUI();

  const handleEditMatch = () => {
    navigation.navigate(AppScreens.EDIT_MATCH, { matchId: match._id });
  };

  const removePlayerMutation = useMutate(
    async ({ matchId, userId }: { matchId: string; userId: string }) =>
      matchService.removeUserFromMatch(matchId, currentUser._id),
    (data) => {
      navigation.navigate(AppScreens.HOME_SCREEN);
      showSnackBar("success", `saliste del partido exitosamente`);
    },
    (error) => {
      console.error("Error al eliminar el usuario:", error);
    },
    true
  );
  const handleRemovePlayer = () => {
    removePlayerMutation({ matchId: match._id, userId: currentUser._id });
  };

  const deleteMatchMutation = useMutate(
    async (matchId: string) => matchService.deleteMatch(matchId),
    () => {
      navigation.goBack();
      showSnackBar("success", "Partido eliminado exitosamente.");
    },
    (error) => {
      console.error("Error al eliminar el partido:", error);
    }
  );

  const handleDeleteMatch = () => {
    deleteMatchMutation(match._id);
  };

  return (
    <Div flexDir="row" justifyContent="space-evenly" mt="lg">
      {/* Botón para editar partido */}
      {currentUser?._id === match.userId && (
        <Div alignItems="center">
          <Button
            //rounded="circle"
            h={scale(50)}
            w={scale(100)}
            onPress={handleEditMatch}
          >
            <Icon
              name="edit"
              fontFamily="Feather"
              color={customTheme.colors.text}
              fontSize="xl"
            />
          </Button>
        </Div>
      )}

      {/* Botón para salir del partido */}
      {match.users.some((user) => user._id === currentUser._id) && (
        <Div alignItems="center">
          <Button
            bg={customTheme.colors.accent}
            h={scale(50)}
            w={scale(100)}
            onPress={() => setModalVisible(true)}
          >
            <Icon
              name="exit-to-app"
              fontFamily="MaterialCommunityIcons"
              color={customTheme.colors.background}
              fontSize="xl"
            />
          </Button>
        </Div>
      )}
      {currentUser?._id === match.userId && (
        <Div alignItems="center" justifyContent="center">
          <Button
            color={customTheme.colors.background}
            bg="red600"
            //rounded="circle"
            h={scale(50)}
            w={scale(100)}
            onPress={() => setDeleteModalVisible(true)}
          >
            <Icon
              name="delete"
              fontFamily="MaterialIcons"
              color="white"
              fontSize="xl"
            />
          </Button>
        </Div>
      )}
      <ConfirmationModal
        title="confirmar salir partido"
        subTitle="¿Estás seguro de bajarte del partido?"
        isVisible={modalVisible}
        onConfirm={handleRemovePlayer}
        onCancel={() => setModalVisible(false)}
      />
      <ConfirmationModal
        title="Eliminar Partido"
        subTitle="¿Estás seguro de que quieres eliminar este partido?"
        isVisible={deleteModalVisible}
        onConfirm={handleDeleteMatch}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </Div>
  );
};

export default MatchButtons;
