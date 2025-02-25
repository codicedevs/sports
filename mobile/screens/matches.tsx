import React, { useState } from 'react'
import { Div, Overlay, Text } from 'react-native-magnus'
import { customTheme } from '../utils/theme'
import useFetch from '../hooks/useGet'
import matchService from '../service/match.service'
import { QUERY_KEYS } from '../types/query.types'
import MatchCard from '../components/matchesCards'
import Match from '../types/match.type'
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import { scale, verticalScale } from 'react-native-size-matters'
import zonesService from '../service/zones.service'
import sportService from '../service/sport.service'
import sportmodeService from '../service/sportmode.service'
import SportModeButton from '../components/matche/Form/sportModeButton'
import { SportMode } from '../types/form.type'

const schedules = [
    { id: 1, time: '00:00', value: { startHour: '08:00', endHour: '14:00' } },
    { id: 2, time: '08:00', value: { startHour: '08:00', endHour: '09:00' } },
    { id: 3, time: '09:00', value: { startHour: '09:00', endHour: '10:00' } },
    { id: 4, time: '10:00', value: { startHour: '10:00', endHour: '11:00' } },
    { id: 5, time: '11:00', value: { startHour: '11:00', endHour: '12:00' } },
    { id: 6, time: '12:00', value: { startHour: '12:00', endHour: '13:00' } },
    { id: 7, time: '13:00', value: { startHour: '13:00', endHour: '14:00' } }
]

const MatchesScreen = () => {
    const [modeFilterModal, setModeFilterModal] = useState(false)
    const [hourFilterModal, setHourFilterModal] = useState(false)
    const [zoneFilterModal, setZoneFilterModal] = useState(false)
    const [filter, setFilter] = useState({
        sportModes: [] as SportMode[],
        zones: [] as any[],
        hours: [] as any[]
    })

    function buildMongoFilter(filters) {
        const mongoFilter = {
          where: {},
        };
      
        if (filters.sportModes && filters.sportModes.length > 0) {
          mongoFilter.where["sportMode._id"] = {
            $in: filters.sportModes.map((mode) => mode._id),
          };
        }
      
        if (filters.zones && filters.zones.length > 0) {
          mongoFilter.where["location._id"] = {
            $in: filters.zones.map((zone) => zone._id),
          };
        }
      
        if (filters.hours && filters.hours.length > 0) {
          const hoursList = filters.hours.map((h) => {
            const [hh] = h.time.split(":");
            return parseInt(hh, 10);
          });
          mongoFilter.where.hour = { $in: hoursList };
        }
      
        return mongoFilter;
      }

    const fetchMatches = async () => {
        const mongoFilter = buildMongoFilter(filter);

        console.log(mongoFilter)
        const res = await matchService.getAll(mongoFilter);
        return res
    };
  
const { data: matches } = useFetch(fetchMatches, [QUERY_KEYS.MATCHES, (filter.sportModes.length).toString(), (filter.hours.length).toString(), (filter.zones.length).toString()])
    const { data: zonas } = useFetch(zonesService.getZones, [QUERY_KEYS.ZONES])
    const { data: allSportModes } = useFetch(sportmodeService.getAll, [QUERY_KEYS.SPORT_MODES])
    const toggleFilterModal = (filterType: 'mode' | 'hour' | 'zone') => {
        const filterMap = {
            mode: setModeFilterModal,
            hour: setHourFilterModal,
            zone: setZoneFilterModal,
        }
        const toggleFunction = filterMap[filterType]
        if (toggleFunction) {
            toggleFunction((prev) => !prev)
        }
    }

    const toggleZoneSelection = (zone) => {
        const isSelected = filter.zones.some((z) => z._id === zone._id)
        if (isSelected) {
            setFilter((prev) => ({ ...prev, zones: prev.zones.filter((z) => z._id !== zone._id) }))
        } else {
            setFilter((prev) => ({ ...prev, zones: [...prev.zones, zone] }))
        }
    }

    const handleSelectMode = (mode: SportMode, index: number) => {
        const isSelected = filter.sportModes.some((m) => m._id === mode._id)
        if (isSelected) {
            setFilter((prev) => ({
                ...prev,
                sportModes: prev.sportModes.filter((m) => m._id !== mode._id)
            }))
        } else {
            setFilter((prev) => ({ ...prev, sportModes: [...prev.sportModes, mode] }))
        }
    }

    if (!zonas || !allSportModes) return null
    const matchesInfo = matches?.data.results ?? []

    return (
        <>
            <Overlay onBackdropPress={() => toggleFilterModal('mode')} visible={modeFilterModal} p="xl" w={'90%'}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    contentContainerStyle={{ gap: scale(16) }}
                >
                    {allSportModes.data.results.map((mode, index) => (
                        <SportModeButton
                            key={mode._id}
                            mode={mode}
                            index={index}
                            onPress={handleSelectMode}
                            selected={filter.sportModes.some((m) => m._id === mode._id)}
                            length={allSportModes.data.results.length}
                        />
                    ))}
                </ScrollView>
            </Overlay>
            <Overlay onBackdropPress={() => toggleFilterModal('hour')} visible={hourFilterModal} p="xl">
                {schedules.map((schedule) => {
                    const isSelected = filter.hours.some((item) => item.id === schedule.id)
                    return (
                        <TouchableOpacity
                            key={schedule.id}
                            onPress={() => {
                                setFilter((prev) => {
                                    if (prev.hours.some((item) => item.id === schedule.id)) {
                                        return { ...prev, hours: prev.hours.filter((item) => item.id !== schedule.id) }
                                    } else {
                                        return { ...prev, hours: [...prev.hours, schedule] }
                                    }
                                })
                            }}
                        >
                            <Div
                                h={verticalScale(48)}
                                bg={isSelected ? customTheme.colors.secondaryBackground : 'white'}
                                justifyContent="center"
                                borderWidth={1}
                            >
                                <Text
                                    color={isSelected ? 'white' : customTheme.colors.secondaryBackground}
                                    textAlign="center"
                                >
                                    {schedule.time === '00:00' ? 'A definir' : schedule.time}
                                </Text>
                            </Div>
                        </TouchableOpacity>
                    )
                })}
            </Overlay>
            <Overlay onBackdropPress={() => toggleFilterModal('zone')} visible={zoneFilterModal} p="xl">
                {zonas.data.results.map((zona, index) => {
                    const isSelected = filter.zones.some((z) => z._id === zona._id)
                    return (
                        <TouchableOpacity key={index} onPress={() => toggleZoneSelection(zona)}>
                            <Div
                                h={verticalScale(48)}
                                bg={isSelected ? 'black' : 'white'}
                                justifyContent="center"
                                borderWidth={1}
                            >
                                <Text
                                    color={isSelected ? 'white' : 'black'}
                                    textAlign="center"
                                >
                                    {zona.name}
                                </Text>
                            </Div>
                        </TouchableOpacity>
                    )
                })}
            </Overlay>
            <Div p={customTheme.spacing.medium}>
                <Div mt={customTheme.spacing.medium} alignSelf='center' style={{ gap: 10 }} flexDir='row'>
                    <TouchableOpacity onPress={() => toggleFilterModal('mode')}>
                        <Div borderWidth={1} p={customTheme.spacing.small} rounded={'circle'}>
                            <Text>MODO</Text>
                        </Div>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleFilterModal('hour')}>
                        <Div borderWidth={1} p={customTheme.spacing.small} rounded={'circle'}>
                            <Text>HORA</Text>
                        </Div>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleFilterModal('zone')}>
                        <Div borderWidth={1} p={customTheme.spacing.small} rounded={'circle'}>
                            <Text>ZONA</Text>
                        </Div>
                    </TouchableOpacity>
                </Div>
                <ScrollView>
                    {matchesInfo.map((match: Match) => (
                        <MatchCard
                            key={match.id}
                            date={"F"}
                            day={match.dayOfWeek}
                            location={match.location?.address}
                            maxPlayers={match.playersLimit}
                            players={10}
                            time={'horario'}
                        />
                    ))}
                </ScrollView>
            </Div>
        </>
    )
}

export default MatchesScreen
