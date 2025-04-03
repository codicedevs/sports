import React, { useCallback, useState, useEffect } from 'react';
import { Div, Icon, Overlay, Text } from 'react-native-magnus';
import { customTheme } from '../utils/theme';
import useFetch from '../hooks/useGet';
import matchService from '../service/match.service';
import { QUERY_KEYS } from '../types/query.types';
import { ActivityIndicator, FlatList, Image, ScrollView, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import zonesService from '../service/zones.service';
import sportmodeService from '../service/sportmode.service';
import SportModeButton from '../components/matche/Form/sportModeButton';
import MatchesCards from '../components/cards/matchesCards';
import MatchesCardSK from '../components/cards/matchesCardSK';

const schedules = [
  { id: 1, time: '00:00', value: { startHour: '08:00', endHour: '14:00' } },
  { id: 2, time: '08:00', value: { startHour: '08:00', endHour: '09:00' } },
  { id: 3, time: '09:00', value: { startHour: '09:00', endHour: '10:00' } },
  { id: 4, time: '10:00', value: { startHour: '10:00', endHour: '11:00' } },
  { id: 5, time: '11:00', value: { startHour: '11:00', endHour: '12:00' } },
  { id: 6, time: '12:00', value: { startHour: '12:00', endHour: '13:00' } },
  { id: 7, time: '13:00', value: { startHour: '13:00', endHour: '14:00' } }
]

const Filters = ({ filter, setFilter, toggleFilterModal, zonas, allSportModes, schedules }) => {
  const toggleZoneSelection = (zone) => {
    setFilter((prev) => ({
      ...prev,
      zones: prev.zones.some((z) => z._id === zone._id)
        ? prev.zones.filter((z) => z._id !== zone._id)
        : [...prev.zones, zone],
    }));
  };

  const handleSelectMode = (mode) => {
    setFilter((prev) => ({
      ...prev,
      sportModes: prev.sportModes.some((m) => m._id === mode._id)
        ? prev.sportModes.filter((m) => m._id !== mode._id)
        : [...prev.sportModes, mode],
    }));
  };

  const handleSelectHour = (schedule) => {
    setFilter((prev) => ({
      ...prev,
      hours: prev.hours.some((h) => h.id === schedule.id)
        ? prev.hours.filter((h) => h.id !== schedule.id)
        : [...prev.hours, schedule],
    }));
  };

  return (
    <>
      <Overlay onBackdropPress={() => toggleFilterModal('mode')} visible={filter.modeFilterModal} py="lg" w={'90%'}>
        <TouchableOpacity onPress={() => toggleFilterModal('mode')}>
          <Image style={{ width: scale(25), height: scale(25), alignSelf: 'flex-end' }} source={require("@assets/closeIcon.png")} />
        </TouchableOpacity>
        <Text textAlign='center' mb={customTheme.spacing.medium} fontSize={customTheme.fontSize.large} >Modalidad</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {allSportModes.results.map((item, index) => (
            <Div mr={customTheme.spacing.small} key={item._id}>
              <SportModeButton
                mode={item}
                index={index}
                onPress={handleSelectMode}
                selected={filter.sportModes.some((m) => m._id === item._id)}
                length={allSportModes.results.length}
              />
            </Div>
          ))}
        </ScrollView>
      </Overlay>
      <Overlay onBackdropPress={() => toggleFilterModal('hour')} visible={filter.hourFilterModal} p="lg">
        <TouchableOpacity onPress={() => toggleFilterModal('hour')}>
          <Image style={{ width: scale(25), height: scale(25), alignSelf: 'flex-end' }} source={require("@assets/closeIcon.png")} />
        </TouchableOpacity>
        <Text textAlign='center' p={customTheme.spacing.small} mb={customTheme.spacing.medium} fontSize={customTheme.fontSize.large}>Horarios</Text>
        {schedules.map((schedule) => (
          <TouchableOpacity key={schedule.id} onPress={() => handleSelectHour(schedule)}>
            <Div
              h={verticalScale(48)}
              bg={filter.hours.some((h) => h.id === schedule.id) ? customTheme.colors.secondaryBackground : 'white'}
              justifyContent="center"
              borderWidth={1}
            >
              <Text
                color={filter.hours.some((h) => h.id === schedule.id) ? 'white' : customTheme.colors.secondaryBackground}
                textAlign="center"
              >
                {schedule.time === '00:00' ? 'A definir' : schedule.time}
              </Text>
            </Div>
          </TouchableOpacity>
        ))}
      </Overlay>
      <Overlay onBackdropPress={() => toggleFilterModal('zone')} visible={filter.zoneFilterModal} p="lg">
        <TouchableOpacity onPress={() => toggleFilterModal('zone')}>
          <Image style={{ width: scale(25), height: scale(25), alignSelf: 'flex-end' }} source={require("@assets/closeIcon.png")} />
        </TouchableOpacity>
        <Text textAlign='center' p={customTheme.spacing.small} mb={customTheme.spacing.medium} fontSize={customTheme.fontSize.large}>Zonas</Text>
        {zonas.data.results.map((zona) => (
          <TouchableOpacity key={zona._id} onPress={() => toggleZoneSelection(zona)}>
            <Div
              h={verticalScale(48)}
              bg={filter.zones.some((z) => z._id === zona._id) ? 'black' : 'white'}
              justifyContent="center"
              borderWidth={1}
            >
              <Text color={filter.zones.some((z) => z._id === zona._id) ? 'white' : 'black'} textAlign="center">
                {zona.name}
              </Text>
            </Div>
          </TouchableOpacity>
        ))}
      </Overlay>
      <Div w={'100%'} flexDir='row' borderWidth={1} borderColor={customTheme.colors.gray} rounded={customTheme.borderRadius.medium}>
        <Div
          flex={1}
          borderRightWidth={2}
          borderColor={customTheme.colors.gray}
          bg={filter.hours.length > 0 ? customTheme.colors.lightGray : "white"}
          py={customTheme.spacing.small}
          style={{ borderTopLeftRadius: customTheme.borderRadius.medium, borderBottomLeftRadius: customTheme.borderRadius.medium }}
        >
          <TouchableOpacity onPress={() => toggleFilterModal('hour')}>
            <Text textAlign='center' fontFamily="NotoSans-ExtraBold">Horario</Text>
            <Div justifyContent='center' flexDir='row'>
              <Text>{filter.hours.length > 0 ? filter.hours[0].time : "Todas"}</Text>
              {
                filter.hours.length > 1 &&
                <Div ml={customTheme.spacing.small} px={customTheme.spacing.xxs} borderWidth={1} rounded={customTheme.borderRadius.circle}>
                  <Text textAlign='center'>+1</Text>
                </Div>
              }
            </Div>
          </TouchableOpacity>
        </Div>
        <Div
          flex={1}
          borderRightWidth={2}
          borderColor={customTheme.colors.gray}
          bg={filter.sportModes.length > 0 ? customTheme.colors.lightGray : "white"}
          py={customTheme.spacing.small}
        >
          <TouchableOpacity onPress={() => toggleFilterModal('mode')}>
            <Text textAlign='center' fontFamily="NotoSans-ExtraBold">Modalidad</Text>
            <Div justifyContent='center' flexDir='row'>
              <Text>{filter.sportModes.length > 0 ? filter.sportModes[0].label : "Todas"}</Text>
              {
                filter.sportModes.length > 1 &&
                <Div ml={customTheme.spacing.small} px={customTheme.spacing.xxs} borderWidth={1} rounded={customTheme.borderRadius.circle}>
                  <Text textAlign='center'>+1</Text>
                </Div>
              }
            </Div>
          </TouchableOpacity>
        </Div>
        <Div
          flex={1}
          bg={filter.zones.length > 0 ? customTheme.colors.lightGray : "white"}
          py={customTheme.spacing.small}
          style={{ borderTopRightRadius: customTheme.borderRadius.medium, borderBottomRightRadius: customTheme.borderRadius.medium }}
        >
          <TouchableOpacity onPress={() => toggleFilterModal('zone')}>
            <Text textAlign='center' fontFamily="NotoSans-ExtraBold">Zona</Text>
            <Div justifyContent='center' flexDir='row'>
              <Text>{filter.zones.length > 0 ? filter.zones[0].name : "Todas"}</Text>
              {
                filter.zones.length > 1 &&
                <Div ml={customTheme.spacing.small} px={customTheme.spacing.xxs} borderWidth={1} rounded={customTheme.borderRadius.circle}>
                  <Text textAlign='center'>+1</Text>
                </Div>
              }
            </Div>
          </TouchableOpacity>
        </Div>
      </Div>
      {
        !(filter.sportModes.length === 0 && filter.zones.length === 0 && filter.hours.length === 0) &&
        <TouchableOpacity onPress={() => setFilter({
          sportModes: [],
          zones: [],
          hours: [],
          modeFilterModal: false,
          hourFilterModal: false,
          zoneFilterModal: false,
        })}
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Icon alignSelf='center' fontFamily='AntDesign' name='reload1' color='black' />
          <Text mt={customTheme.spacing.small} ml={customTheme.spacing.small}>Reiniciar filtro</Text>
        </TouchableOpacity>
      }
    </>
  );
};

const MatchesList = ({ matches, fetchMore, hasMore }) => {
  const renderItem = ({ item }) => (
    <MatchesCards
    key={item._id}
    matchId={item._id}
    dayOfWeek={item.dayOfWeek}
    date={item.date} 
    time={item.hour} 
    location={item.location} 
    players={item.users}
    maxPlayers={item.playersLimit}
    sportMode={item.sportMode}
    />
  );

  const keyExtractor = (item) => item._id.toString();

  const renderFooter = () => (hasMore ? <ActivityIndicator size="large" /> : null);
  console.log(matches.length)
  if (matches.length < 1) {
    return (
      <Div h={'80%'} justifyContent='center'>
        <Icon color={customTheme.colors.gray} fontFamily='AntDesign' name='search1' fontSize={customTheme.fontSize.Fourxl} />
        <Text mt={customTheme.spacing.medium} fontSize={customTheme.fontSize.medium} textAlign='center'>No se encontraron partidos{'\n'}con este filtro</Text>
      </Div>
    )
  }
  return (
    <FlatList
      data={matches}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={fetchMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      contentContainerStyle={{ paddingBottom: verticalScale(100), paddingTop: verticalScale(20), gap: verticalScale(20) }}
    />
  );
};

// Main Screen
const MatchesScreen = () => {
  const [filter, setFilter] = useState({
    sportModes: [],
    zones: [],
    hours: [],
    modeFilterModal: false,
    hourFilterModal: false,
    zoneFilterModal: false,
  });
  const [limit, setLimit] = useState(10);
  const [matches, setMatches] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { data: zonas } = useFetch(zonesService.getZones, [QUERY_KEYS.ZONES]);
  const { data: allSportModes } = useFetch(sportmodeService.getAll, [QUERY_KEYS.SPORT_MODES]);

  const buildMongoFilter = useCallback(() => {
    const mongoFilter = { where: {}, page: 1, limit };
    if (filter.sportModes.length > 0) mongoFilter.where['sportMode._id'] = { $in: filter.sportModes.map((m) => m._id) };
    if (filter.zones.length > 0) mongoFilter.where['location._id'] = { $in: filter.zones.map((z) => z._id) };
    if (filter.hours.length > 0) mongoFilter.where.hour = { $in: filter.hours.map((h) => parseInt(h.time.split(':')[0], 10)) };
    return mongoFilter;
  }, [filter, limit]);

  const fetchMatches = async () => {
    try {
      setIsLoading(true)
      const mongoFilter = buildMongoFilter();
      const res = await matchService.getAll(mongoFilter);
      return res;
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchMatches().then((data) => {
      setMatches(data.results);
      setHasMore(data.results.length === limit);
    });
  }, [filter.sportModes, filter.zones, filter.hours, limit]);

  const fetchMore = () => {
    if (hasMore) setLimit((prev) => prev + 10);
  };

  const toggleFilterModal = useCallback((filterType) => {
    setFilter((prev) => ({
      ...prev,
      modeFilterModal: filterType === 'mode' ? !prev.modeFilterModal : false,
      hourFilterModal: filterType === 'hour' ? !prev.hourFilterModal : false,
      zoneFilterModal: filterType === 'zone' ? !prev.zoneFilterModal : false,
    }));
  }, []);

  if (!zonas || !allSportModes) return (
    <Div flex={1} alignItems='center' justifyContent='center'>
      <ActivityIndicator size="large" />
    </Div>
  );

  return (
    <Div bg='white' p={customTheme.spacing.medium} h={'100%'}>
      <Filters
        filter={filter}
        setFilter={setFilter}
        toggleFilterModal={toggleFilterModal}
        zonas={zonas}
        allSportModes={allSportModes}
        schedules={schedules}
      />
      {
        isLoading ?
          <Div my={customTheme.spacing.medium} style={{ gap: verticalScale(20) }} >
            <MatchesCardSK />
            <MatchesCardSK />
          </Div>
          :
          <MatchesList matches={matches} fetchMore={fetchMore} hasMore={hasMore} />
      }
    </Div>
  );
};

export default MatchesScreen;