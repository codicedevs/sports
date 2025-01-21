import React, { useEffect, useState } from "react";
import { Div, Button, Text } from "react-native-magnus";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import locationService from "../../../service/location.service";
import { Picker } from "@react-native-picker/picker";

// ✅ Esquema de validación con Yup
const schema = yup.object().shape({
  location: yup.string().required("La ubicación es obligatoria"),
});

const StepLocation = ({
  initialData,
  onNext,
  onBack,
}: {
  initialData: { location: string };
  onNext: (data: { location: string }) => void;
  onBack: () => void;
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: initialData?.location || "", // Valor inicial opcional
    },
    resolver: yupResolver(schema),
  });

  const [locations, setLocations] = useState<{ _id: string; name: string }[]>(
    []
  );

  const onSubmit = (data: any) => {
    onNext(data); // Llamar a la función onNext con los datos
  };

  const bringLocation = async () => {
    try {
      const res = await locationService.getAll();
      setLocations(res);
    } catch (e) {
      console.error("Error al traer ubicaciones:", e);
    }
  };

  useEffect(() => {
    bringLocation();
  }, []);

  return (
    <Div p="lg">
      <Text fontSize="xl" mb="lg" fontWeight="bold">
        Información de Ubicación
      </Text>

      {/* Campo de Ubicación (Picker) */}
      <Div mb="lg">
        <Text mb="sm" fontSize="lg">
          Ubicación
        </Text>
        <Controller
          name="location"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Div
              borderWidth={1}
              borderColor={errors.location ? "red500" : "gray400"}
              rounded="md"
              overflow="hidden"
            >
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={{ height: 50 }}
              >
                <Picker.Item
                  label="Selecciona una ubicación..."
                  value=""
                  enabled={false}
                />
                {locations.map((loc) => (
                  <Picker.Item
                    key={loc._id}
                    label={loc.name}
                    value={loc._id}
                  />
                ))}
              </Picker>
            </Div>
          )}
        />
        {errors.location && (
          <Text color="red500" fontSize="sm">
            {errors.location.message}
          </Text>
        )}
      </Div>

      {/* Botones de Navegación */}
      <Div row justifyContent="space-between">
        <Button
          rounded="circle"
          bg="blue500"
          color="white"
          onPress={onBack} // Botón para regresar
        >
          Atrás
        </Button>
        <Button
          rounded="circle"
          bg="blue500"
          color="white"
          onPress={handleSubmit(onSubmit)} // Botón para avanzar
        >
          Confirmar
        </Button>
      </Div>
    </Div>
  );
};

export default StepLocation;