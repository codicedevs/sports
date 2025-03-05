import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Div, Text } from "react-native-magnus";
import { scale, verticalScale } from "react-native-size-matters";
import { customTheme } from "../../../utils/theme";
import SearchBar from "../Form/searchBar";
import useFetch from "../../../hooks/useGet";
import locationService from "../../../service/location.service";
import { QUERY_KEYS } from "../../../types/query.types";
import { Place } from "../../../types/form.type";
import MapView from "react-native-maps";
import MapLocationDisplay from "./mapInput";

interface SearchLocationInputProps {
  // Para el modo editable (modal)
  matchDetailsRef?: React.MutableRefObject<{
    location: Place | null;
  }>;

  // Para modo lectura: pasar la ubicación directamente
  location?: Place | null;

  // Si es true => sólo lectura, sin búsqueda ni scroll
  readOnly?: boolean;
}

export default function SearchLocationInput({
  matchDetailsRef,
  location,
  readOnly = false,
}: SearchLocationInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<Place[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Place | null>(
    matchDetailsRef?.current.location ?? null
  );

  const { data: Locations } = useFetch(locationService.getAll, [
    QUERY_KEYS.LOCATIONS,
  ]);

  console.log("55555", Locations);

  // Si estamos en modo lectura y se pasa "location", la usamos como seleccionada
  useEffect(() => {
    if (readOnly && location) {
      setSelectedLocation(location);
    }
  }, [readOnly, location]);

  // Filtrar ubicaciones al cambiar el texto de búsqueda
  useEffect(() => {
    if (!Locations) return;
    if (filter.trim() === "") {
      setFilteredLocations([]);
    } else {
      const results = Locations.data.results.filter((loc: Place) =>
        loc.name.toLowerCase().includes(filter.toLowerCase())
      );
      console.log("1111111111111", results);
      setFilteredLocations(results);
    }
  }, [filter, Locations]);

  if (!Locations) return null;

  function handleSelectLocation(loc: Place) {
    setSelectedLocation(loc);
    if (matchDetailsRef) {
      matchDetailsRef.current.location = loc;
    }
  }

  // MODO SOLO LECTURA
  if (readOnly) {
    const hasCoords = !!(
      selectedLocation && selectedLocation.location?.coordinates
    );

    return (
      <Div p={customTheme.spacing.small}>
        <Div
          borderWidth={1}
          rounded="md"
          p={customTheme.spacing.small}
          w="100%"
        >
          <Div flexDir="row" alignItems="center" justifyContent="space-between">
            <Text fontFamily="NotoSans-Variable">Lugar</Text>

            {!hasCoords && (
              <Text fontFamily="NotoSans-BoldItalic">Sin coordenadas</Text>
            )}

            <Text fontFamily="NotoSans-BoldItalic">
              {selectedLocation?.name ?? "A definir"}
            </Text>
          </Div>

          {/* Si hay coordenadas... */}
          {hasCoords && (
            <Div mt={customTheme.spacing.small}>
              <MapLocationDisplay place={selectedLocation} mapHeight={200} />
            </Div>
          )}
        </Div>
      </Div>
    );
  }

  // MODO EDICIÓN
  return (
    <Div
      flex={1}
      px={customTheme.spacing.medium}
      pt={customTheme.spacing.medium}
    >
      <Text mb={customTheme.spacing.medium}>¿Dónde juegan?</Text>
      <SearchBar
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setFilter={setFilter}
      />
      <ScrollView
        nestedScrollEnabled
        contentContainerStyle={{
          paddingVertical: customTheme.spacing.medium,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        {(filteredLocations.length > 0
          ? filteredLocations
          : Locations.data.results
        ).map((loc: Place, index: number) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSelectLocation(loc)}
          >
            <Div
              h={verticalScale(48)}
              mb={
                index !== Locations.data.results.length - 1
                  ? customTheme.spacing.small
                  : 0
              }
              bg={
                selectedLocation?._id === loc._id
                  ? customTheme.colors.secondaryBackground
                  : "white"
              }
              justifyContent="center"
              borderWidth={1}
            >
              <Text
                textAlign="center"
                color={
                  selectedLocation?._id === loc._id
                    ? "white"
                    : customTheme.colors.secondaryBackground
                }
              >
                {loc.name}
              </Text>
            </Div>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Div>
  );
}
