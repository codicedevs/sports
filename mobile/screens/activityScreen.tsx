import React from 'react';
import { FlatList } from 'react-native';
import { Div, Text } from 'react-native-magnus';

export const ActivityScreen = () => {
  const timelineData = [
    { date: '09/03/25', time: '12:05', description: 'Primera reserva' },
    { date: '10/03/25', time: '12:05', description: 'Cambio horario' },
    { date: '10/03/25', time: '12:05', description: 'Etc, etc' },
  ];

  const renderItem = ({ item, index }) => (
    <Div row alignItems="center">
      {/* Columna Izquierda - Fecha */}
      <Div flex={1} alignItems="flex-end" pr={10}>
        <Text fontWeight="bold">{item.date} | {item.time}</Text>
      </Div>

      {/* Columna del Medio - Línea de tiempo */}
      <Div alignItems="center">
        {index !== 0 && <Div bg="gray300" w={2} h={30} />}
        <Div bg="gray300" w={10} h={10} rounded="circle" />
        {index !== timelineData.length - 1 && <Div bg="gray300" w={2} h={30} />}
      </Div>

      {/* Columna Derecha - Descripción */}
      <Div flex={1} pl={10}>
        <Text color="gray600">{item.description}</Text>
      </Div>
    </Div>
  );

  return (
    <Div p={20}>
      <FlatList 
        data={timelineData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </Div>
  );
};
