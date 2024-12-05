import { Div } from "react-native-magnus";
import Match from "../../types/match.type";
import openMap from "react-native-open-maps";
import { scale } from "react-native-size-matters";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Map from "./map";
import MatchDetails from "./matchDescription";
import MatchButtons from "./matchButtons";
import { useState } from "react";

const MatchInfo = ({ match }: { match: Match }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [latitude, longitude] = match.location.location.coordinates; // Extraer latitude y longitude del objeto coordinates

  //Función para abrir Google Maps
  const openInMaps = () => {
    openMap({
      latitude,
      longitude,
      query: match.location.address,
      provider: "google", // Asegura que se abra en Google Maps si está disponible
    });
  };

  return (
    <KeyboardAwareScrollView
      enableAutomaticScroll
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <Div flex={1} justifyContent="space-evenly">
        {/* Mapa de Google Maps con función para abrir Google Maps al tocar */}
        <Div mb="lg" h={scale(240)} w="100%">
          <Map
            latitude={latitude}
            longitude={longitude}
            address={match.location.address}
            onOpenMap={openInMaps}
          />
        </Div>
        {/* Información del Partido */}
        <MatchDetails match={match} />
      </Div>
      <MatchButtons
        match={match}
        modalVisible={modalVisible}
        deleteModalVisible={deleteModalVisible}
        setModalVisible={setModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
      />
    </KeyboardAwareScrollView>
  );
};

export default MatchInfo;
