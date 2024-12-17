import React from "react";
import { Div, Button, Input, Text } from "react-native-magnus";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Esquema de validación con Yup (solo ubicación, opcional)
const schema = yup.object().shape({
  location: yup.string().optional(), // Campo opcional
});

const StepLocation = ({
  initialData,
  onNext,
  onBack,
}: {
  initialData?: { location?: string };
  onNext: (data: { location?: string }) => void;
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

  const onSubmit = (data: any) => {
    onNext(data); // Llamar a la función onNext con los datos
  };

  return (
    <Div p="lg">
      <Text fontSize="xl" mb="lg" fontWeight="bold">
        Información de Ubicación
      </Text>

      {/* Campo de Ubicación */}
      <Div mb="lg">
        <Text mb="sm" fontSize="lg">
          Ubicación (Opcional)
        </Text>
        <Controller
          name="location"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Ej: Dirección, cancha, etc."
              value={value}
              onChangeText={onChange}
              borderColor={errors.location ? "red500" : "gray400"}
            />
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
          bg="gray400"
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
          Siguiente
        </Button>
      </Div>
    </Div>
  );
};

export default StepLocation;
