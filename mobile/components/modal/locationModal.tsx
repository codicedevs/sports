// src/components/LocationModal.tsx
import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { Div, Modal, Text, Button } from "react-native-magnus";
import Location from "../../types/location.type";
import locationService from "../../service/location.service";
import useFetch from "../../hooks/useGet";
import { customTheme } from "../../utils/theme";

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  selectedLocation: Location | null;
  onSelect: (location: Location) => void;
}

const LocationModal: React.FC<LocationModalProps> = ({
  visible,
  onClose,
  selectedLocation,
  onSelect,
}) => {
  // Llamada para obtener las ubicaciones disponibles usando useFetch
  const { data: availableLocations, error: locationError } = useFetch<
    Location[]
  >({
    fn: locationService.getAll,
    key: ["available-locations"],
  });

  const renderAvailableLocation = ({ item }: { item: Location }) => (
    <TouchableOpacity
      onPress={() => {
        onSelect(item);
        onClose();
      }}
      style={{
        borderWidth: 1,
        borderColor: selectedLocation?._id === item._id ? "green" : "gray300",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Text fontSize="md" fontWeight="bold">
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <Div w="80%" bg="white" p="lg" rounded="lg" alignSelf="center">
        <Text fontSize="xl" fontWeight="bold" mb="lg">
          Seleccionar Ubicación
        </Text>
        {locationError ? (
          <Text color="red500">
            Error al cargar ubicaciones: {locationError.message}
          </Text>
        ) : (
          <FlatList
            data={availableLocations}
            renderItem={renderAvailableLocation}
            keyExtractor={(item) => item._id}
          />
        )}
        <Button mt="lg" onPress={onClose} bg={customTheme.colors.accent}>
          Cerrar
        </Button>
      </Div>
    </Modal>
  );
};

export default LocationModal;
