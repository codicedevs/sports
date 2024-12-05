import React, { useEffect, useState } from "react";
import {
  Div,
  Input,
  Button,
  Text,
  Tag,
  Icon,
  ScrollDiv,
} from "react-native-magnus";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { TouchableOpacity } from "react-native";
import LocationModal from "./modal/locationModal";
import PlayersModal from "./modal/playerModal";
import { useMutation } from "@tanstack/react-query";
import { useGlobalUI } from "../context/globalUiContext";
import matchService from "../service/match.service";
import { CreateMatchDto } from "../types/match.type";
import { User } from "../types/user.type";
import { Location } from "../types/location.type";
import { customTheme } from "../utils/theme";
import { useSession } from "../context/authProvider"; // Se añade la sesión del usuario
import { CreateMatchImageStyle } from "./styled/styled";
import { scale, verticalScale } from "react-native-size-matters";
import Header from "./header";
import useFetch from "../hooks/useGet";

interface MatchSchema {
  invitedUsers?: (string | undefined)[] | undefined;
  name: string;
  date: string;
  time: string;
  location: string;
  playersLimit: number;
}

// Schema de validación
const schema = yup.object().shape({
  name: yup
    .string()
    .required("El nombre es obligatorio")
    .min(4, "El nombre debe tener al menos 4 caracteres"),

  date: yup
    .string()
    .required("La fecha es obligatoria")
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "La fecha debe estar en el formato YYYY-MM-DD"
    ),
  time: yup.string().required("La hora es obligatoria"),
  location: yup.string().required("La ubicación es obligatoria"),
  playersLimit: yup
    .number()
    .required("El límite de jugadores es obligatorio")
    .positive("Debe ser un número positivo")
    .integer("Debe ser un número entero"),
});

interface MatchFormProps {
  onMatchCreated: () => void;
  matchId?: string; // ID del partido a editar
}

const MatchFormComponent: React.FC<MatchFormProps> = ({
  onMatchCreated,
  matchId,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { currentUser } = useSession(); // Obtener usuario actual para usar el userId
  const { showSnackBar, showModal } = useGlobalUI();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [playersModalVisible, setPlayersModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const arrayKey = matchId ? ["match", matchId] : ["match"];

  // Fetch partido data if editing, usando useFetch
  const { data: matchData, isLoading } = useFetch({
    fn: () => matchService.findOne(matchId!), // Función de fetch
    key: arrayKey, // Key para el cache
    triggerLoader: true, // triggerLoader para mostrar loading
    options: {
      enabled: !!matchId, // Solo ejecutar si hay un matchId
    },
  });

  useEffect(() => {
    if (matchData) {
      // Poblar los valores del formulario si se está editando
      setValue("name", matchData.name);
      setValue("date", dayjs(matchData.date).format("YYYY-MM-DD"));
      setValue("time", dayjs(matchData.date).format("HH:mm"));
      setValue("playersLimit", matchData.playersLimit);
      setSelectedLocation(matchData.location);
      setValue("location", matchData.location._id);
      setSelectedUsers(matchData.invitedUsers);
    }
  }, [matchData, setValue]);

  const { mutateAsync } = useMutation({
    mutationFn: matchId ? updateMatch : createMatch,
    onSuccess: () => {
      showModal("success", matchId ? "Partido actualizado" : "Partido creado");
      onMatchCreated();
    },
    onError: (error: any) => {
      showSnackBar(
        "error",
        `No se pudo ${matchId ? "actualizar" : "crear"} el partido`
      );
    },
  });

  async function createMatch(data: MatchSchema) {
    const isoDate = dayjs(`${data.date}T${data.time}`).toISOString();
    const { time, ...newData } = data;
    const matchData: CreateMatchDto = {
      ...newData,
      userId: currentUser?._id, // Aquí se añade el userId del usuario actual
      invitedUsers: selectedUsers.map((user) => user._id),
      location: selectedLocation?._id!!,
      date: isoDate,
    };
    const response = await matchService.createMatch(matchData);
    return response;
  }

  async function updateMatch(data: MatchSchema) {
    const isoDate = dayjs(`${data.date}T${data.time}`).toISOString();
    const { time, ...newData } = data;
    const matchData: CreateMatchDto = {
      ...newData,
      userId: currentUser?._id,
      invitedUsers: selectedUsers?.map((user) => user?._id),
      location: selectedLocation?._id!,
      date: isoDate,
    };
    return await matchService.updateMatch(matchId!, matchData);
  }

  const onSubmit = (data: MatchSchema) => {
    console.log("on submit", data);
    mutateAsync(data);
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setValue("date", dayjs(selectedDate).format("YYYY-MM-DD"));
    }
  };

  const onTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
      setValue("time", dayjs(selectedTime).format("HH:mm"));
    }
  };

  const handlePlayerSelect = (player: User) => {
    if (selectedUsers.find((user) => user._id === player._id)) {
      setSelectedUsers(selectedUsers.filter((user) => user._id !== player._id));
    } else {
      setSelectedUsers([...selectedUsers, player]);
    }
  };

  const handleRemoveSelectedPlayer = (player: User) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== player._id));
  };

  return (
    <>
      <ScrollDiv>
        <Div
          p="lg"
          bg={customTheme.colors.primary}
          flex={1}
          justifyContent="center"
          alignItems="center"
        >
          <Header />

          <CreateMatchImageStyle
            source={require("../assets/jugadorCreateMatch.png")}
          />

          <Div
            h={verticalScale(115)}
            alignSelf="flex-start"
            p={customTheme.spacing.small}
            mt={scale(70)}
            mb={scale(30)}
          >
            <Text
              color={customTheme.colors.tertiary}
              fontSize="xxl"
              fontFamily={customTheme.fontFamily.bold}
            >
              {matchId ? "Actualizar" : "Crear"}
            </Text>
            <Text
              color={customTheme.colors.background}
              fontSize="xxl"
              fontFamily={customTheme.fontFamily.bold}
              mt={scale(-40)}
            >
              Partido
            </Text>
          </Div>

          <Div>
            <Div flexDir="row" alignItems="center" mb="md">
              <Icon
                name="sports-soccer"
                fontFamily="MaterialIcons"
                fontSize="lg"
                color={customTheme.colors.tertiary}
                mr="md"
              />
              <Text fontSize="lg" color={customTheme.colors.background}>
                Nombre del Partido
              </Text>
            </Div>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  mb="md"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Nombre del partido"
                  borderColor={errors.name ? "red" : "gray400"}
                />
              )}
            />
            {errors.name && (
              <Text color="red500" mb="sm">
                {errors.name.message}
              </Text>
            )}

            <Div flexDir="row" alignItems="center" mb="md">
              <Icon
                name="calendar"
                fontSize="lg"
                color={customTheme.colors.tertiary}
                mr="md"
              />
              <Text fontSize="lg" color={customTheme.colors.background}>
                Fecha del Partido
              </Text>
            </Div>
            <Controller
              control={control}
              name="date"
              render={({ field: { value } }) => (
                <>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <Input
                      mb="md"
                      value={value}
                      placeholder="Seleccionar Fecha"
                      editable={false} // No editable, se selecciona desde el picker
                      borderColor={errors.date ? "red" : "gray400"}
                    />
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date || new Date()}
                      mode="date"
                      onChange={onDateChange}
                    />
                  )}
                  {errors.date && (
                    <Text color="red500" mb="sm">
                      {errors.date.message}
                    </Text>
                  )}
                </>
              )}
            />
            <Div flexDir="row" alignItems="center" mb="md">
              <Icon
                name="clockcircleo"
                fontSize="lg"
                color={customTheme.colors.tertiary}
                mr="md"
              />
              <Text fontSize="lg" color={customTheme.colors.background}>
                Hora del Partido
              </Text>
            </Div>

            <Controller
              control={control}
              name="time"
              render={({ field: { value } }) => (
                <>
                  <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                    <Input
                      mb="md"
                      value={value}
                      placeholder="Seleccionar Hora"
                      editable={false} // No editable, se selecciona desde el picker
                      borderColor={errors.time ? "red" : "gray400"}
                    />
                  </TouchableOpacity>
                  {showTimePicker && (
                    <DateTimePicker
                      value={time || new Date()}
                      mode="time"
                      onChange={onTimeChange}
                    />
                  )}
                  {errors.time && (
                    <Text color="red500" mb="sm">
                      {errors.time.message}
                    </Text>
                  )}
                </>
              )}
            />
            <Div flexDir="row" alignItems="center" mb="md">
              <Icon
                name="users"
                fontFamily="Feather"
                fontSize="lg"
                color={customTheme.colors.tertiary}
                mr="md"
              />
              <Text fontSize="lg" color={customTheme.colors.background}>
                Límite de Jugadores
              </Text>
            </Div>
            <Controller
              control={control}
              name="playersLimit"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  mb="md"
                  onBlur={onBlur}
                  onChangeText={(text) =>
                    onChange(text ? parseInt(text, 10) : "")
                  }
                  value={value?.toString()}
                  placeholder="Límite de jugadores"
                  keyboardType="numeric"
                  borderColor={errors.playersLimit ? "red" : "gray400"}
                />
              )}
            />
            {errors.playersLimit && (
              <Text color="red500" mb="sm">
                {errors.playersLimit.message}
              </Text>
            )}
            <Div flexDir="row" alignItems="center" mb="md">
              <Icon
                name="location"
                fontFamily="Octicons"
                fontSize="lg"
                color={customTheme.colors.tertiary}
                mr="md"
              />
              <Text fontSize="lg" color={customTheme.colors.background}>
                Ubicación
              </Text>
            </Div>

            <Controller
              control={control}
              name="location"
              render={() => (
                <TouchableOpacity onPress={() => setLocationModalVisible(true)}>
                  <Input
                    value={selectedLocation?.name}
                    editable={false} // No editable, abrirá el modal
                    placeholder="Seleccionar ubicación"
                    borderColor={errors.location ? "red" : "gray400"}
                    mb="lg"
                  />
                </TouchableOpacity>
              )}
            />

            {errors.location && (
              <Text color="red500" mb="sm">
                {errors.location.message}
              </Text>
            )}

            {/* Botón para agregar jugadores */}
            <Button
              borderWidth={2}
              borderColor={customTheme.colors.tertiary}
              bg={customTheme.colors.primary}
              block
              rounded="circle"
              mt="md"
              suffix={
                <Icon
                  name="pluscircleo"
                  color="white"
                  fontFamily="AntDesign"
                  left={8}
                />
              }
              onPress={() => setPlayersModalVisible(true)}
            >
              Agregar jugadores
            </Button>

            {/* Campo para mostrar jugadores invitados */}
            <Text color={customTheme.colors.background} fontSize="lg" mb="md">
              Jugadores Invitados
            </Text>
            <Div mb="lg" flexDir="row" flexWrap="wrap">
              {selectedUsers && selectedUsers.length > 0 ? (
                selectedUsers.map((user) => (
                  <Tag
                    w={scale(100)}
                    bg={customTheme.colors.accent}
                    key={user._id}
                    mr="md"
                    mb="md"
                    color="white"
                    rounded="circle"
                    p="xl"
                    suffix={
                      <TouchableOpacity
                        onPress={() => handleRemoveSelectedPlayer(user)}
                      >
                        <Icon name="closecircleo" color="white" left={10} />
                      </TouchableOpacity>
                    }
                  >
                    {user.name}
                  </Tag>
                ))
              ) : (
                <Text color="gray500">No hay jugadores invitados</Text>
              )}
            </Div>
          </Div>

          <Button
            color={customTheme.colors.text}
            block
            rounded="circle"
            mt="lg"
            onPress={handleSubmit(onSubmit)}
          >
            {matchId ? "Actualizar Partido" : "Crear Partido"}
          </Button>
        </Div>
      </ScrollDiv>

      <LocationModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        selectedLocation={selectedLocation}
        onSelect={(location) => {
          setSelectedLocation(location);
          setValue("location", location._id);
        }}
      />
      <PlayersModal
        visible={playersModalVisible}
        onClose={() => setPlayersModalVisible(false)}
        selectedPlayers={selectedUsers}
        onSelect={handlePlayerSelect}
        onDeselect={handleRemoveSelectedPlayer}
      />
    </>
  );
};

export default MatchFormComponent;
