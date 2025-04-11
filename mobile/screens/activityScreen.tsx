import React, { act } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { Div, Text } from 'react-native-magnus';
import Match from '../types/match.type';
import useFetch from '../hooks/useGet';
import activityService from '../service/activity.service';
import { QUERY_KEYS } from '../types/query.types';
import { Activity } from '../types/activity.type';

const formatDateTime = (isoString: string) => {
  const dateObj = new Date(isoString);

  const formattedDate = dateObj.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = dateObj.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { date: formattedDate, time: formattedTime };
};

export const ActivityScreen = ({ match }: { match: Match }) => {

  const { data: activity, isFetching } = useFetch<Activity[]>(() => activityService.bringMatchActivity(match._id), [QUERY_KEYS.ACTIVITY])

  const renderItem = ({ item, index }: { item: Activity, index: number }) => {
    const { date, time } = formatDateTime(item.date);

    return (
      <Div row alignItems="center">
        {/* Columna Izquierda - Fecha */}
        <Div flex={1} alignItems="flex-end" pr={10}>
          <Text fontWeight="bold">{date} | {time}</Text>
        </Div>

        {/* Columna del Medio - Línea de tiempo */}
        <Div alignItems="center">
          {index !== 0 && <Div style={{ flexGrow: 1 }} bg="gray300" w={2} h={30} />}
          <Div bg="gray300" w={10} h={10} rounded="circle" />
          {index !== activity.results.length - 1 && <Div bg="gray300" w={2} h={30} />}
        </Div>

        {/* Columna Derecha - Descripción */}
        <Div flex={1} pl={10}>
          <Text color="gray600">{item.description}</Text>
        </Div>
      </Div>
    )
  };
  if (isFetching) return (
    <Div alignItems='center' justifyContent='center' h={"100%"}>
      <ActivityIndicator size={'large'} color={'black'} />
    </Div>
  )
  return (
    <Div p={20}>
      <FlatList
        data={activity.results}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </Div>
  );
};
