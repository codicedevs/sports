import React from "react";
import { Div, Text } from "react-native-magnus";
import MapView, { Marker } from "react-native-maps";
import { Place } from "../../../types/form.type";

interface MapLocationDisplayProps {
  place: Place | null;
  mapHeight?: number;
  style?: object;
}

export default function MapLocationDisplay({
  place,
  mapHeight = 300,
  style,
}: MapLocationDisplayProps) {
  if (!place || !place.location?.coordinates) {
    return (
      <Div>
        <Text>Lugar sin coordenadas</Text>
      </Div>
    );
  }

  const [lng, lat] = place.location.coordinates;

  return (
    <Div >
      <Div>
        <MapView
          style={[{ width:"100%" , height: mapHeight }, style]}
          initialRegion={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={{ latitude: lat, longitude: lng }} />
        </MapView>
      </Div>
    </Div>
  );
}
