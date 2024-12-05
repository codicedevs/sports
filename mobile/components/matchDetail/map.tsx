import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { Div } from "react-native-magnus";
import { scale } from "react-native-size-matters";
import { ConfirmationModal } from "../modal/confirmationModal";

interface MapProps {
  latitude: number;
  longitude: number;
  address: string;
  onOpenMap: () => void;
}

const Map = ({ latitude, longitude, address, onOpenMap }: MapProps) => {
  const [showModalMap, setShowModalMap] = useState(false);

  return (
    <Div mb="lg" h={scale(240)} w="100%">
      <MapView
        style={{ height: "100%", width: "100%" }}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={() => setShowModalMap(true)}
      >
        {/* Marcador en la ubicación del partido */}
        <Marker
          coordinate={{
            latitude,
            longitude,
          }}
          title="Ubicación del Partido"
          description={address}
          onPress={onOpenMap}
        />
      </MapView>

      <ConfirmationModal
          title="Abrir google maps"
          subTitle="Esta acción te vinculará a un enlace externo ¿Estas seguro?"
          isVisible={showModalMap}
          onConfirm={onOpenMap}
          onCancel={() => setShowModalMap(false)}
        />
    </Div>
  );
};

export default Map;