import React from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import MatchFormComponent from "../components/matchForm";

const EditMatchScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Obtenemos el matchId desde los parámetros que se pasaron al navegar
  const { matchId } = route.params as { matchId: string };

  // Función que se llamará cuando el partido sea editado
  const handleMatchUpdated = () => {
    // Navegamos hacia atrás o a donde quieras después de actualizar
    navigation.goBack();
  };

  return (
    // Reutilizamos el componente de formulario y le pasamos el matchId
    <MatchFormComponent
      matchId={matchId} // Pasamos el matchId para que el formulario cargue los datos del partido a editar
      onMatchCreated={handleMatchUpdated}
    />
  );
};

export default EditMatchScreen;
