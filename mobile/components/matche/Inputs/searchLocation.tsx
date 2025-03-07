import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Div, Text } from "react-native-magnus";
import { scale, verticalScale } from "react-native-size-matters";
import { customTheme } from "../../../utils/theme";
import SearchBar from "../Form/searchBar";
import useFetch from "../../../hooks/useGet";
import locationService from "../../../service/location.service";
import { QUERY_KEYS } from "../../../types/query.types";
import { Place } from "../../../types/form.type";
import MapLocationDisplay from "./mapInput";

interface SearchLocationInputProps {
  matchDetailsRef?: React.MutableRefObject<{ location: Place | null }>;
  location?: Place | null;
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
  // si se selecc una loc
  const [userHasSelected, setUserHasSelected] = useState(false);

  // Llamada  ubicaciones
  const { data: Locations } = useFetch(locationService.getAll, [
    QUERY_KEYS.LOCATIONS,
  ]);

  // Si en modo lectura y hay "location", la usamos como valor inicial
  useEffect(() => {
    if (readOnly && location) {
      setSelectedLocation(location);
    }
  }, [readOnly, location]);

  // Filtrado de ub
  useEffect(() => {
    if (!Locations) return;
    if (filter.trim() === "") {
      setFilteredLocations(Locations.data.results);
    } else {
      const results = Locations.data.results.filter((loc: Place) =>
        loc.name.toLowerCase().includes(filter.toLowerCase())
      );
      setFilteredLocations(results);
    }
  }, [filter, Locations]);

  if (!Locations) return null;

  function handleSelectLocation(loc: Place) {
    setSelectedLocation(loc);
    setUserHasSelected(true); // Se seleccionó un lugar de la lista
    if (matchDetailsRef) {
      matchDetailsRef.current.location = loc;
    }
  }

  // Verificamos si el lugar tiene coords
  const hasCoords =
    selectedLocation?.location?.coordinates &&
    selectedLocation.location.coordinates.length === 2;

  // MODO SOLO LECTURA
  if (readOnly) {
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

          {hasCoords && (
            <Div mt={customTheme.spacing.small}>
              <MapLocationDisplay
                place={selectedLocation}
                mapHeight={scale(250)}
              />
            </Div>
          )}
        </Div>
      </Div>
    );
  }

  // MODO EDICIÓN

  if (!userHasSelected) {
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
  } else {
    return (
      <Div p={customTheme.spacing.small}>
        <Div w="100%">
          <Div flexDir="row" alignItems="center" justifyContent="space-between">
            <Text fontFamily="NotoSans-Variable">Lugar</Text>
            {!hasCoords && (
              <Text fontFamily="NotoSans-BoldItalic">Sin coordenadas</Text>
            )}
            <Text fontFamily="NotoSans-BoldItalic">
              {selectedLocation?.name ?? "A definir"}
            </Text>
          </Div>

          {hasCoords && (
            <Div mt={customTheme.spacing.small}>
              <MapLocationDisplay
                place={selectedLocation}
                mapHeight={scale(270)}
              />
            </Div>
          )}
        </Div>
      </Div>
    );
  }
}
