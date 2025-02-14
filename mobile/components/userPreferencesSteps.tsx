import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { Button, Select } from 'react-native-magnus';
import { UserPreferences } from '../types/preferences.type';
import DateTimePicker from '@react-native-community/datetimepicker';
import sportService from '../service/sport.service';
import { Picker } from '@react-native-picker/picker';
import zonesService from '../service/zones.service';
import userService from '../service/user.service';
import sportmodeService from '../service/sportmode.service';

interface StepSportProps {
  userInfo: UserPreferences;
  setUserInfo: (info: Partial<UserPreferences>) => void;
  onNext: (data: any) => void;
}

// Componente StepSport
export const StepSport: React.FC<StepSportProps> = ({ userInfo, setUserInfo, onNext }) => {
  const [localSport, setLocalSport] = useState(userInfo.sport || '');
  const [localSportMode, setLocalSportMode] = useState(userInfo.sportMode || '');
  const [sports, setSports] = useState([]);
  const [sportModes, setSportModes] = useState([]);
  const sportSelectRef = useRef<any>(null);
  const sportModeSelectRef = useRef<any>(null);

  const handleSportChange = (value: string) => {
    setLocalSport(value);
    setLocalSportMode('');
  };

  const bringSports = async () => {
    try {
      const resMode = await sportmodeService.getAll();
      const res = await sportService.getAll();
      setSports(res.data);
      console.log(res.data)
      setSportModes(resMode.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    bringSports();
  }, []);

  const handleNext = () => {
    if (!localSport) {
      console.log('Por favor selecciona un deporte.');
      return;
    }
    if (!localSportMode) {
      console.log('Por favor selecciona un modo de deporte.');
      return;
    }
    onNext({ sport: localSport, sportMode: localSportMode });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Selecciona un Deporte</Text>
      <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 20 }}>
        <Picker selectedValue={localSport} onValueChange={(itemValue) => handleSportChange(itemValue)}>
          <Picker.Item label="Seleccionar Deporte" value="" />
          {sports.map((sport: any) => (
            <Picker.Item key={sport._id} label={sport.name} value={sport._id} />
          ))}
        </Picker>
      </View>

      {localSport && (
        <>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Selecciona un Modo de Deporte</Text>
          <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 20 }}>
            <Picker selectedValue={localSportMode} onValueChange={(itemValue) => setLocalSportMode(itemValue)}>
              <Picker.Item label="Seleccionar Modo" value="" />
              {sportModes
                .filter((mode: any) => mode.sport === localSport)
                .map((mode: any) => (
                  <Picker.Item key={mode._id} label={mode.name} value={mode._id} />
                ))}
            </Picker>
          </View>
        </>
      )}

      <Button mt="lg" onPress={handleNext}>
        Siguiente
      </Button>
    </View>
  );
};

// Componente StepAvailability
interface StepAvailabilityProps {
  userInfo: UserPreferences;
  setUserInfo: (info: Partial<UserPreferences>) => void;
  onNext: (data: any) => void;
}

// Opciones de días de la semana
const daysOfWeek = [
  { label: 'Lunes', value: 'monday' },
  { label: 'Martes', value: 'tuesday' },
  { label: 'Miércoles', value: 'wednesday' },
  { label: 'Jueves', value: 'thursday' },
  { label: 'Viernes', value: 'friday' },
  { label: 'Sábado', value: 'saturday' },
  { label: 'Domingo', value: 'sunday' },
];

export const StepAvailability: React.FC<StepAvailabilityProps> = ({
  userInfo,
  setUserInfo,
  onNext,
}) => {
  const [selectedDay, setSelectedDay] = useState(userInfo.availability?.[0]?.day || '');
  const [startHour, setStartHour] = useState(new Date());
  const [endHour, setEndHour] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  /**
   * Manejar selección de horas
   */
  const onChangeStartHour = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartHour(selectedDate);
    }
  };

  const onChangeEndHour = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndHour(selectedDate);
    }
  };

  /**
   * Validar y avanzar
   */
  const handleNext = () => {
    if (!selectedDay) {
      console.log('Por favor selecciona un día.');
      return;
    }
    if (!startHour || !endHour) {
      console.log('Por favor selecciona las horas de inicio y fin.');
      return;
    }
    onNext({
      availability: [
        {
          day: selectedDay,
          intervals: [
            {
              startHour: startHour.getHours(),
              endHour: endHour.getHours(),
            },
          ],
        },
      ],
    });
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Selección de Día */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Selecciona un Día</Text>
      <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 20 }}>
        <Picker
          selectedValue={selectedDay}
          onValueChange={(itemValue) => setSelectedDay(itemValue)}
        >
          <Picker.Item label="Seleccionar un día" value="" />
          {daysOfWeek.map((day) => (
            <Picker.Item key={day.value} label={day.label} value={day.value} />
          ))}
        </Picker>
      </View>

      {/* Hora de Inicio */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Hora de Inicio</Text>
      <Button
        mt="md"
        onPress={() => setShowStartPicker(true)}
        style={{
          backgroundColor: '#007AFF',
          borderRadius: 8,
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
      >
        {`${startHour.getHours()}:${startHour
          .getMinutes()
          .toString()
          .padStart(2, '0')}`}
      </Button>
      {showStartPicker && (
        <DateTimePicker
          value={startHour}
          mode="time"
          display="default"
          onChange={onChangeStartHour}
        />
      )}

      {/* Hora de Fin */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>
        Hora de Fin
      </Text>
      <Button
        mt="md"
        onPress={() => setShowEndPicker(true)}
        style={{
          backgroundColor: '#007AFF',
          borderRadius: 8,
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
      >
        {`${endHour.getHours()}:${endHour
          .getMinutes()
          .toString()
          .padStart(2, '0')}`}
      </Button>
      {showEndPicker && (
        <DateTimePicker
          value={endHour}
          mode="time"
          display="default"
          onChange={onChangeEndHour}
        />
      )}

      {/* Botón Siguiente */}
      <Button
        mt="lg"
        onPress={handleNext}
        style={{
          backgroundColor: '#28A745',
          borderRadius: 8,
          paddingVertical: 10,
          paddingHorizontal: 20,
          marginTop: 30,
        }}
      >
        Siguiente
      </Button>
    </View>
  );
};

interface StepZonesProps {
  userInfo: UserPreferences;
  setUserInfo: (info: Partial<UserPreferences>) => void;
  onNext: (data: any) => void;
}

export const StepZones: React.FC<StepZonesProps> = ({ userInfo, setUserInfo, onNext }) => {
  const [selectedZone, setSelectedZone] = useState(userInfo.preferredZones?.[0] || '');
  const [zones, setZones] = useState<
    { _id: string; name: string }[]
  >([]);

  /**
   * Obtener las zonas desde el servicio
   */
  const getZones = async () => {
    try {
      const res = await zonesService.getZones();
      setZones(res.data); // Se asume que res.data es un array con las zonas
    } catch (e) {
      console.log('Error al obtener las zonas:', e);
    }
  };

  useEffect(() => {
    getZones();
  }, []);

  const generatePreference = async () => {
    const profile = {
      sport: userInfo.sport,
      sportMode: userInfo.sportMode,
      availability: userInfo.availability,
      preferredZones: selectedZone
    }

    try {
      await userService.updatePreferences({profile})
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Validación antes de continuar
   */
  const handleNext = async () => {
    if (!selectedZone) {
      console.log('Por favor selecciona una zona.');
      return;
    }
    await generatePreference()
    onNext({ preferredZones: [selectedZone] });
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Título */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Selecciona una Zona
      </Text>

      {/* Picker para Selección de Zonas */}
      <View
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <Picker
          selectedValue={selectedZone}
          onValueChange={(itemValue) => setSelectedZone(itemValue)}
          mode="dropdown"
        >
          <Picker.Item label="Seleccionar Zona" value="" />
          {zones.map((zone) => (
            <Picker.Item key={zone._id} label={zone.name} value={zone._id} />
          ))}
        </Picker>
      </View>

      {/* Botón Siguiente */}
      <Button
        mt="lg"
        onPress={handleNext}
        style={{
          backgroundColor: '#28A745',
          borderRadius: 8,
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
      >
        Siguiente
      </Button>
    </View>
  );
};