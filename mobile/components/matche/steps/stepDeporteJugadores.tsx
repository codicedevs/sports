import React, { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Div, Input, Text, Button, Icon, Select } from "react-native-magnus";
import sportmodeService from "../../../service/sportmode.service";

// 📝 **Esquema de validación con Yup**
const schema = yup.object().shape({
  deporte: yup.string().required("El tipo de deporte es obligatorio"),
  jugadores: yup
    .number()
    .required("La cantidad de jugadores es obligatoria")
    .transform((value) => (isNaN(value) ? 0 : value))
    .nullable()
    .min(1, "Debe haber al menos un jugador")
    .max(22, "No puede haber más de 22 jugadores"),
});

const StepDeporteJugadores = ({
  initialData,
  onNext,
}: {
  initialData?: { deporte: string; jugadores: number };
  onNext: (data: { deporte: string; jugadores: number }) => void;
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

  const [sportMode, setSportMode] = useState<{ _id: string; name: string }[]>([]);
  const selectRef = useRef(null); // Referencia para abrir el Select

  // 📥 **Traer deportes desde el servicio**
  const bringSports = async () => {
    try {
      const res = await sportmodeService.getAll();
      setSportMode(res);
    } catch (error) {
      console.error("Error al traer los deportes:", error);
    }
  };

  useEffect(() => {
    bringSports();
  }, []);

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
            <>
              <Button
                block
                borderWidth={1}
                bg="white"
                color="gray900"
                borderColor={errors.deporte ? "red500" : "gray300"}
                onPress={() => {
                  if (selectRef.current) {
                    selectRef.current.open();
                  }
                }}
                suffix={<Icon name="chevron-down" color="gray500" ml="md" />}
              >
                {value
                  ? sportMode.find((item) => item._id === value)?.name || "Selecciona un deporte"
                  : "Selecciona un deporte"}
              </Button>

              {/* Select de deportes */}
              <Select
                ref={selectRef}
                title="Selecciona un deporte"
                value={value}
                onSelect={(selectedValue) => {
                  onChange(selectedValue);
                }}
                mt="md"
                pb="2xl"
                roundedTop="xl"
                data={sportMode.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
                renderItem={(item) => (
                  <Select.Option value={item.value} py="md" px="xl">
                    <Text>{item.label}</Text>
                  </Select.Option>
                )}
              />
            </>
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
          Cantidad de Jugadores
        </Text>
        <Controller
          name="jugadores"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Ej: 5, 11, 22"
              keyboardType="numeric"
              value={value !== null ? value.toString() : ""}
              onChangeText={(text) => onChange(text ? Number(text) : null)}
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

      {/* Botón Siguiente */}
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
