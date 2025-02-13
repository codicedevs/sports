import React, { useEffect, useState } from 'react'
import { Div, Text } from 'react-native-magnus'
import { customTheme } from '../../../utils/theme'
import { ScrollView, View } from 'react-native'
import SportButton from '../Form/sportButton'
import SportModeButton from '../Form/sportModeButton'
import useFetch from '../../../hooks/useGet'
import sportmodeService from '../../../service/sportmode.service'
import { QUERY_KEYS } from '../../../types/query.types'
import { scale, verticalScale } from 'react-native-size-matters'
import sportService from '../../../service/sport.service'
import { Sport, SportMode } from '../../../types/form.type'

interface SportInputProps {
    selectedSport: Sport | null;
    setSelectedSport: React.Dispatch<React.SetStateAction<Sport | null>>;
    selectedSportMode: SportMode | null;
    setSelectedSportMode: React.Dispatch<React.SetStateAction<SportMode | null>>
}

const SportInput = ({ selectedSport, setSelectedSport, selectedSportMode, setSelectedSportMode }: SportInputProps) => {

    const fetchSportModesById = async () => {
        if (selectedSport?.name) {
            //   if (!match) setSelectedSportMode('')
            const res = await sportmodeService.getModesBySportId(selectedSport?._id)
            console.log('POR ID')
            return res
        } else {
            const res = await sportmodeService.getAll()
            console.log("TODO")
            return res
        }
    }

    const { data: sports } = useFetch(sportService.getAll, [QUERY_KEYS.SPORTS]);
    const { data: sportModes } = useFetch(fetchSportModesById, [QUERY_KEYS.SPORT_MODES, selectedSport?.name]);

    const handleSelectSport = (sport: Sport, index: number) => {
        setSelectedSport(sport);
    };

    const handleSelectMode = (mode: SportMode, index: number) => {
        setSelectedSportMode(mode);
    };

    useEffect(() => {
        if (!selectedSport && sports) {
            setSelectedSport(sports.data[0])
        }
    }, [sports])

    useEffect(() => {
        if (!selectedSportMode && sportModes) {
            setSelectedSportMode(sportModes.data[0])
        }
    }, [sportModes])

    if (!sports || !sportModes) return null;


    return (
        <Div py={customTheme.spacing.medium}>
            <Div pb={customTheme.spacing.medium} style={{ gap: verticalScale(8) }}>
                <Text fontSize={16} px={customTheme.spacing.medium}>¿Qué deporte juegan?</Text>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    contentContainerStyle={{ gap: scale(16) }}
                >
                    {sports.data.map((sport, index) => (
                        <SportButton
                            key={sport._id}
                            sport={sport}
                            index={index}
                            onPress={handleSelectSport}
                            selected={selectedSport?._id === sport._id}  // Pasa si está seleccionado
                            length={sports.data.length}
                        />
                    ))}
                </ScrollView>
            </Div>
            <Div px={customTheme.spacing.medium}>
                <View style={{ width: '100%', borderBottomWidth: 1, borderStyle: 'dotted' }} />
            </Div>
            <Div pt={customTheme.spacing.medium} style={{ gap: verticalScale(8) }}>
                <Text fontSize={customTheme.fontSize.medium} px={customTheme.spacing.medium}>¿Qué modalidad?</Text>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    contentContainerStyle={{ gap: scale(16) }}
                >
                    {sportModes.data.map((mode, index) => (
                        <SportModeButton
                            key={mode._id}
                            mode={mode}
                            index={index}
                            onPress={handleSelectMode}
                            selected={selectedSportMode?._id === mode._id}  // Pasa si está seleccionado
                            length={sportModes.data.length}
                        />
                    ))}
                </ScrollView>
            </Div>
        </Div>
    );
};

export default SportInput;
