import React, { useRef, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { Button, Div, Input, Select } from 'react-native-magnus';
import { Availability, UserPreferences } from '../types/preferences.type';
import DateTimePicker from '@react-native-community/datetimepicker';

interface StepSportProps {
  userInfo: UserPreferences;
  setUserInfo: (info: Partial<UserPreferences>) => void;
  onNext: (data: any) => void;
}

const SPORT_MODES: Record<string, { label: string; value: string }[]> = {
  football: [
    { label: 'Friendly', value: 'friendly' },
    { label: 'Competitive', value: 'competitive' },
    { label: 'Training', value: 'training' },
  ],
  basketball: [
    { label: 'Street', value: 'street' },
    { label: 'Competitive', value: 'competitive' },
    { label: 'Training', value: 'training' },
  ],
  tennis: [
    { label: 'Single', value: 'single' },
    { label: 'Double', value: 'double' },
    { label: 'Training', value: 'training' },
  ],
};

export const StepSport: React.FC<StepSportProps> = ({
  userInfo,
  setUserInfo,
  onNext,
}) => {
  const [localSport, setLocalSport] = useState(userInfo.sport || '');
  const [localSportMode, setLocalSportMode] = useState(userInfo.sportMode || '');
  const sportSelectRef = useRef<any>(null);
  const sportModeSelectRef = useRef<any>(null);

  const handleSportChange = (value: string) => {
    setLocalSport(value);
    setLocalSportMode(''); // Reiniciar SportMode al cambiar Sport
  };

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
      {/* Selección de Deporte */}
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Selecciona un Deporte</Text>
      <Button onPress={() => sportSelectRef.current?.open()} mt="md">
        {localSport || 'Seleccionar Deporte'}
      </Button>

      <Select
        ref={sportSelectRef}
        onSelect={(value) => handleSportChange(value)}
        value={localSport}
        title="Selecciona un Deporte"
        data={[
          { label: 'Football', value: 'football' },
          { label: 'Basketball', value: 'basketball' },
          { label: 'Tennis', value: 'tennis' },
        ]}
        renderItem={(item) => (
          <Select.Option value={item.value} py="md" px="xl">
            <Text>{item.label}</Text>
          </Select.Option>
        )}
      />

      {/* Selección de SportMode (aparece solo si hay Sport seleccionado) */}
      {localSport && (
        <>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>
            Selecciona un Modo de Deporte
          </Text>
          <Button onPress={() => sportModeSelectRef.current?.open()} mt="md">
            {localSportMode || 'Seleccionar Modo'}
          </Button>

          <Select
            ref={sportModeSelectRef}
            onSelect={(value) => setLocalSportMode(value)}
            value={localSportMode}
            title="Selecciona un Modo"
            data={SPORT_MODES[localSport] || []}
            renderItem={(item) => (
              <Select.Option value={item.value} py="md" px="xl">
                <Text>{item.label}</Text>
              </Select.Option>
            )}
          />
        </>
      )}

      {/* Botón Siguiente */}
      <Button mt="lg" onPress={handleNext}>
        Siguiente
      </Button>
    </View>
  );
};

interface StepAvailabilityProps {
  userInfo: UserPreferences;
  setUserInfo: (info: Partial<UserPreferences>) => void;
  onNext: (data: any) => void;
}

export const StepAvailability: React.FC<StepAvailabilityProps> = ({
  userInfo,
  setUserInfo,
  onNext,
}) => {
  const [day, setDay] = useState(userInfo.availability?.[0]?.day || '');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startHour, setStartHour] = useState(new Date());
  const [endHour, setEndHour] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleNext = () => {
    if (!day && !selectedDate) {
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
          day: day || selectedDate.toISOString().split('T')[0], // Prioriza día del select si existe
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

    /**
   * Actualizar hora de inicio
   */
    const onChangeStartHour = (event: any, selectedDate?: Date) => {
      setShowStartPicker(false);
      if (selectedDate) {
        setStartHour(selectedDate);
      }
    };
  
    /**
     * Actualizar hora de fin
     */
    const onChangeEndHour = (event: any, selectedDate?: Date) => {
      setShowEndPicker(false);
      if (selectedDate) {
        setEndHour(selectedDate);
      }
    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
      setShowDatePicker(false);
      if (selectedDate) {
        setSelectedDate(selectedDate);
      }
    };

    return (
      <View style={{ padding: 20 }}>
        {/* Selección de Día */}
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Selecciona un Día</Text>
        <Button onPress={() => setShowDatePicker(true)} mt="md">
        {selectedDate.toLocaleDateString() || 'Seleccionar Fecha'}
      </Button>
      {showDatePicker && (
        <DateTimePicker
        minimumDate={new Date()}
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
        />
      )}
  
        {/* Hora de Inicio */}
        <Text style={{ fontSize: 18, marginTop: 20 }}>Hora de Inicio</Text>
        <Button mt="md" onPress={() => setShowStartPicker(true)}>
          {`${startHour.getHours()}:${startHour.getMinutes().toString().padStart(2, '0')}`}
        </Button>
        {showStartPicker && (
          <DateTimePicker
            value={startHour}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeStartHour}
          />
        )}
  
        {/* Hora de Fin */}
        <Text style={{ fontSize: 18, marginTop: 20 }}>Hora de Fin</Text>
        <Button mt="md" onPress={() => setShowEndPicker(true)}>
          {`${endHour.getHours()}:${endHour.getMinutes().toString().padStart(2, '0')}`}
        </Button>
        {showEndPicker && (
          <DateTimePicker
            value={endHour}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeEndHour}
          />
        )}
  
        {/* Botón Siguiente */}
        <Button mt="lg" onPress={handleNext}>
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

const ZONES = [
  { label: 'Zona Norte', value: 'north' },
  { label: 'Zona Sur', value: 'south' },
  { label: 'Zona Este', value: 'east' },
  { label: 'Zona Oeste', value: 'west' },
];

export const StepZones: React.FC<StepZonesProps> = ({
  userInfo,
  setUserInfo,
  onNext,
}) => {
  const [selectedZone, setSelectedZone] = useState(userInfo.preferredZones?.[0] || '');
  const zoneSelectRef = useRef<any>(null);

  const handleNext = () => {
    if (!selectedZone) {
      console.log('Por favor selecciona una zona.');
      return;
    }
    console.log(userInfo)
    console.log(selectedZone)
    // onNext({ preferredZones: [selectedZone] });
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Selección de Zona */}
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Selecciona una Zona</Text>
      <Button onPress={() => zoneSelectRef.current?.open()} mt="md">
        {selectedZone || 'Seleccionar Zona'}
      </Button>

      <Select
        ref={zoneSelectRef}
        onSelect={(value) => setSelectedZone(value)}
        value={selectedZone}
        title="Selecciona una Zona"
        data={ZONES}
        renderItem={(item) => (
          <Select.Option value={item.value} py="md" px="xl">
            <Text>{item.label}</Text>
          </Select.Option>
        )}
      />

      {/* Botón Finalizar */}
      <Button mt="lg" onPress={handleNext}>
        Finalizar
      </Button>
    </View>
  );
};

