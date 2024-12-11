import React from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Div, Input, Text, Button, Icon } from "react-native-magnus";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TouchableOpacity } from "react-native";
import dayjs from "dayjs";

// Esquema de validación con Yup
const schema = yup.object().shape({
  dia: yup.string().required("El día es obligatorio"),
  horario: yup.string().required("El horario es obligatorio"),
});

const StepDiaHorario = ({
  initialData,
  onNext,
}: {
  initialData?: { dia: string; horario: string };
  onNext: (data: { dia: string; horario: string }) => void;
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      dia: initialData?.dia || dayjs().format("YYYY-MM-DD"), // Día inicial por defecto
      horario: initialData?.horario || dayjs().format("HH:mm"), // Horario inicial por defecto
    },
    resolver: yupResolver(schema),
  });

  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
      setValue("dia", formattedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const formattedTime = dayjs(selectedTime).format("HH:mm");
      setValue("horario", formattedTime);
    }
  };

  const onSubmit = (data: any) => {
    onNext(data);
  };

  return (
    <Div p="lg">
      <Text fontSize="xl" mb="lg" fontWeight="bold">
        Selecciona Día y Horario
      </Text>

      {/* Campo Día */}
      <Div mb="lg">
        <Text mb="sm" fontSize="lg">
          Día
        </Text>
        <Controller
          name="dia"
          control={control}
          render={({ field: { value } }) => (
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Input
                value={value}
                editable={false} // Deshabilitar edición directa
                placeholder="Selecciona el día"
                borderColor={errors.dia ? "red500" : "gray400"}
              />
            </TouchableOpacity>
          )}
        />
        {showDatePicker && (
          <DateTimePicker
            value={dayjs().toDate()}
            mode="date"
            onChange={onDateChange}
          />
        )}
        {errors.dia && (
          <Text color="red500" fontSize="sm">
            {errors.dia.message}
          </Text>
        )}
      </Div>

      {/* Campo Horario */}
      <Div mb="lg">
        <Text mb="sm" fontSize="lg">
          Horario
        </Text>
        <Controller
          name="horario"
          control={control}
          render={({ field: { value } }) => (
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Input
                value={value}
                editable={false} // Deshabilitar edición directa
                placeholder="Selecciona el horario"
                borderColor={errors.horario ? "red500" : "gray400"}
              />
            </TouchableOpacity>
          )}
        />
        {showTimePicker && (
          <DateTimePicker
            value={dayjs().toDate()}
            mode="time"
            onChange={onTimeChange}
          />
        )}
        {errors.horario && (
          <Text color="red500" fontSize="sm">
            {errors.horario.message}
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
        suffix={<Icon name="arrowright" color="white" ml="md" />}
      >
        Siguiente
      </Button>
    </Div>
  );
};

export default StepDiaHorario;



//usar react forma // yup