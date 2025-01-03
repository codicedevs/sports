import React from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Div, Input, Text, Button, Icon } from "react-native-magnus";

// Esquema de validación con Yup
const schema = yup.object().shape({
  deporte: yup.string().required("El tipo de deporte es obligatorio"),
  jugadores: yup
    .number()
    .required("La cantidad de jugadores es obligatoria") 
    .transform((value) => (isNaN(value) ? 0 : value)) // Transforma NaN a undefined
    .nullable()
    .min(1, "Debe haber al menos un jugador")
    .max(22, "No puede haber más de 22 jugadores"), // Opcional, pero validado si existe
});

const StepDeporteJugadores = ({
  initialData,
  onNext,
}: {
  initialData?: { deporte: string; jugadores: number  };
  onNext: (data: { deporte: string; jugadores: number  }) => void;
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      deporte: initialData?.deporte || "",
      jugadores: initialData?.jugadores !== undefined ? Number(initialData.jugadores) : 0,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    onNext(data);
  };

  return (
    <Div p="lg">
      <Text fontSize="xl" mb="lg" fontWeight="bold">
        Tipo de Deporte y Cantidad de Jugadores
      </Text>

      {/* Campo Tipo de Deporte */}
      <Div mb="lg">
        <Text mb="sm" fontSize="lg">
          Tipo de Deporte
        </Text>
        <Controller
          name="deporte"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Ej: Fútbol, Básquet, etc."
              value={value}
              onChangeText={onChange}
              borderColor={errors.deporte ? "red500" : "gray400"}
            />
          )}
        />
        {errors.deporte && (
          <Text color="red500" fontSize="sm">
            {errors.deporte.message}
          </Text>
        )}
      </Div>

      {/* Campo Cantidad de Jugadores */}
      <Div mb="lg">
        <Text mb="sm" fontSize="lg">
          Cantidad de Jugadores (Opcional)
        </Text>
        <Controller
          name="jugadores"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Ej: 5, 11, 22"
              keyboardType="numeric"
              value={value !== null ? value.toString() : ""}
              onChangeText={(text) => onChange(text ? Number(text) : null)} // Convierte a número o null
              borderColor={errors.jugadores ? "red500" : "gray400"}
            />
          )}
        />
        {errors.jugadores && (
          <Text color="red500" fontSize="sm">
            {errors.jugadores.message}
          </Text>
        )}
      </Div>

      
      <Button
        block
        mt="lg"
        rounded="circle"
        bg="blue500"
        color="white"
        onPress={handleSubmit(onSubmit)}
        suffix={<Icon name="check" color="white" ml="md" />}
      >
        Siguiente
      </Button>
    </Div>
  );
};

export default StepDeporteJugadores;