import React, { useRef } from 'react';
import { View, Text } from 'react-native';
import { Button, Div, Input, Select } from 'react-native-magnus';
import { Availability, UserPreferences } from '../types/preferences.type';

interface StepSportProps {
  userInfo: UserPreferences;
  setUserInfo: (info: Partial<UserPreferences>) => void;
}

const SPORT_MODES: Record<string, string[]> = {
  football: ['Friendly', 'Competitive', 'Training'],
  basketball: ['Street', 'Competitive', 'Training'],
  tennis: ['Single', 'Double', 'Training'],
};

export const StepSport: React.FC<StepSportProps> = ({ userInfo, setUserInfo }) => {
  const sportSelectRef = useRef<any>(null);

  return (
    <View>
      <Text>Selecciona un Deporte</Text>
      <Button
        onPress={() => sportSelectRef.current?.open()}
        mt="md"
      >
        {userInfo.sport || 'Seleccionar Deporte'}
      </Button>

      <Select
        ref={sportSelectRef}
        onSelect={(value) => setUserInfo({ sport: value })}
        value={userInfo.sport}
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
    </View>
  );
};

interface StepAvailabilityProps {
  userInfo: UserPreferences;
  setUserInfo: (info: Partial<UserPreferences>) => void;
}

const DAYS_OF_WEEK = [
  { label: 'Lunes', value: 'Monday' },
  { label: 'Martes', value: 'Tuesday' },
  { label: 'Miércoles', value: 'Wednesday' },
  { label: 'Jueves', value: 'Thursday' },
  { label: 'Viernes', value: 'Friday' },
  { label: 'Sábado', value: 'Saturday' },
  { label: 'Domingo', value: 'Sunday' },
];

export const StepAvailability: React.FC<StepAvailabilityProps> = ({ userInfo, setUserInfo }) => {
  const handleDayChange = (day: string) => {
    if (DAYS_OF_WEEK.some((d) => d.value === day)) {
      const newAvailability: Availability = { day: day as Availability['day'], intervals: [] };
      setUserInfo({ availability: [newAvailability] });
    }
  };

  const handleTimeChange = (field: 'startHour' | 'endHour', value: string) => {
    const hour = parseInt(value, 10);
    if (!isNaN(hour)) {
      setUserInfo((prev) => {
        const updatedAvailability = prev.availability?.[0] || { day: 'Monday', intervals: [] };
        
        if (!updatedAvailability.intervals[0]) {
          updatedAvailability.intervals[0] = { startHour: 0, endHour: 0 };
        }

        updatedAvailability.intervals[0][field] = hour;
        return { ...prev, availability: [updatedAvailability] };
      });
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Selecciona un Día
      </Text>
      <Select
        title="Selecciona un Día"
        value={userInfo.availability?.[0]?.day}
        onSelect={(value) => handleDayChange(value)}
        data={DAYS_OF_WEEK}
        mt="md"
        rounded="md"
        renderItem={(item) => (
          <Select.Option value={item.value}>{item.label}</Select.Option>
        )}
      />

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>
        Hora de Inicio
      </Text>
      <Input
        keyboardType="numeric"
        placeholder="Hora de inicio (0-24)"
        value={userInfo.availability?.[0]?.intervals?.[0]?.startHour?.toString() || ''}
        onChangeText={(text) => handleTimeChange('startHour', text)}
        mt="md"
        rounded="md"
      />

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>
        Hora de Fin
      </Text>
      <Input
        keyboardType="numeric"
        placeholder="Hora de fin (0-24)"
        value={userInfo.availability?.[0]?.intervals?.[0]?.endHour?.toString() || ''}
        onChangeText={(text) => handleTimeChange('endHour', text)}
        mt="md"
        rounded="md"
      />
    </View>
  );
};


interface StepZonesProps {
  userInfo: UserPreferences;
  setUserInfo: (info: Partial<UserPreferences>) => void;
}

const ZONES = [
  { label: 'Zona Norte', value: 'north' },
  { label: 'Zona Sur', value: 'south' },
  { label: 'Zona Este', value: 'east' },
  { label: 'Zona Oeste', value: 'west' },
];

export const StepZones: React.FC<StepZonesProps> = ({ userInfo, setUserInfo }) => {
  const handleZoneChange = (zone: string) => {
    const updatedZones = userInfo.preferredZones || [];
    if (!updatedZones.includes(zone)) {
      updatedZones.push(zone);
    }
    setUserInfo({ preferredZones: updatedZones });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Selecciona Zonas Deseadas
      </Text>
      <Select
        title="Selecciona una Zona"
        value={userInfo.preferredZones?.[0]}
        onSelect={(value) => handleZoneChange(value)}
        data={ZONES}
        mt="md"
        rounded="md"
        renderItem={(item) => (
          <Select.Option value={item.value}>{item.label}</Select.Option>
        )}
      />
    </View>
  );
};
