import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Div, Text } from 'react-native-magnus';
import { customTheme } from '../../../utils/theme';
import { scale, verticalScale } from 'react-native-size-matters';
import SportButton from '../Form/sportButton';
import SportModeButton from '../Form/sportModeButton';
import useFetch from '../../../hooks/useGet';
import sportService from '../../../service/sport.service';
import sportmodeService from '../../../service/sportmode.service';
import { QUERY_KEYS } from '../../../types/query.types';
import { Profile, Sport, SportMode } from '../../../types/form.type';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';

interface SportInputProps {
    matchDetailsRef: React.MutableRefObject<Profile>;
}

const SportArrayInput = ({ matchDetailsRef }: SportInputProps) => {
    const [selectedSports, setSelectedSports] = useState<Sport[]>(
        matchDetailsRef.current.preferredSports
            ? (matchDetailsRef.current.preferredSports as Sport[])
            : []
    );
    const [selectedSportModes, setSelectedSportModes] = useState<SportMode[]>(
        matchDetailsRef.current.preferredSportModes
            ? (matchDetailsRef.current.preferredSportModes as SportMode[])
            : []
    );

    const { data: sports } = useFetch(sportService.getAll, [QUERY_KEYS.SPORTS]);
    const { data: allSportModes } = useFetch(sportmodeService.getAll, [QUERY_KEYS.SPORT_MODES]);
    useEffect(() => {
        if (!selectedSports.length && sports) {
            const defaultSport = sports.results[0];
            setSelectedSports([defaultSport]);
            matchDetailsRef.current.preferredSports = [defaultSport];
        }
    }, [sports]);

    useEffect(() => {
        if (sports && matchDetailsRef.current.preferredSports) {
          const updatedSports = (matchDetailsRef.current.preferredSports as (string | Sport)[]).map(item =>
            typeof item === 'string'
              ? sports.results.find((s: Sport) => s._id === item)
              : item
          ).filter(Boolean) as Sport[];
          setSelectedSports(updatedSports);
          matchDetailsRef.current.preferredSports = updatedSports;
        }
      }, [sports]);

      useEffect(() => {
        if (allSportModes && matchDetailsRef.current.preferredSportModes) {
          const updatedModes = (matchDetailsRef.current.preferredSportModes as (string | SportMode)[]).map(item =>
            typeof item === 'string'
              ? allSportModes.results.find((m: SportMode) => m._id === item)
              : item
          ).filter(Boolean) as SportMode[];
          setSelectedSportModes(updatedModes);
          matchDetailsRef.current.preferredSportModes = updatedModes;
        }
      }, [allSportModes]);
      
    const handleSelectSport = (sport: Sport, index: number) => {
        const isSelected = selectedSports.some(s => s._id === sport._id);
        let newSelectedSports: Sport[];
        if (isSelected) {
            newSelectedSports = selectedSports.filter(s => s._id !== sport._id);
        } else {
            newSelectedSports = [...selectedSports, sport];
        }
        setSelectedSports(newSelectedSports);
        matchDetailsRef.current.preferredSports = newSelectedSports;
    };

    const handleSelectMode = (mode: SportMode, index: number) => {
        const isSelected = selectedSportModes.some(m => m._id === mode._id);
        let newSelectedModes: SportMode[];
        if (isSelected) {
            newSelectedModes = selectedSportModes.filter(m => m._id !== mode._id);
        } else {
            newSelectedModes = [...selectedSportModes, mode];
        }
        setSelectedSportModes(newSelectedModes);
        matchDetailsRef.current.preferredSportModes = newSelectedModes;
    };

    const handleSelectAllModes = () => {
        if (sportModesForSelectedSports.length === 0) return;

        const allSelected = sportModesForSelectedSports.every(
            (mode: SportMode) => selectedSportModes.some((m) => m._id === mode._id)
        );

        let newSelectedModes: SportMode[];

        if (allSelected) {
            newSelectedModes = selectedSportModes.filter(
                (mode: SportMode) =>
                    !sportModesForSelectedSports.some((m: SportMode) => m._id === mode._id)
            );
        } else {
            newSelectedModes = [...selectedSportModes];
            sportModesForSelectedSports.forEach((mode: SportMode) => {
                if (!newSelectedModes.some((m) => m._id === mode._id)) {
                    newSelectedModes.push(mode);
                }
            });
        }

        setSelectedSportModes(newSelectedModes);
        matchDetailsRef.current.preferredSportModes = newSelectedModes;
    };

    if (!sports || !allSportModes)
        return (
            <MotiView>
                <Skeleton colorMode="light" height={'100%'} width={'100%'} />
            </MotiView>
        );

    const sportModesForSelectedSports = allSportModes
        ? allSportModes.results.filter((mode: SportMode) =>
            selectedSports.some(s => s._id === mode.sport)
        )
        : [];
        
    return (
        <Div py={customTheme.spacing.medium}>
            <Div pb={customTheme.spacing.medium} style={{ gap: verticalScale(8) }}>
                <Text fontSize={16} px={customTheme.spacing.medium}>
                    ¿Qué deporte juegan?
                </Text>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    contentContainerStyle={{ gap: scale(16) }}
                >
                    {sports.results.map((sport, index) => (
                        <SportButton
                            key={sport._id}
                            sport={sport}
                            index={index}
                            onPress={handleSelectSport}
                            selected={selectedSports.some(s => s._id === sport._id)}
                            length={sports.results.length}
                        />
                    ))}
                </ScrollView>
            </Div>
            <Div px={customTheme.spacing.medium}>
                <View style={{ width: '100%', borderBottomWidth: 1, borderStyle: 'dotted' }} />
            </Div>
            <Div pt={customTheme.spacing.medium} style={{ gap: verticalScale(8) }}>
                <Text fontSize={customTheme.fontSize.medium} px={customTheme.spacing.medium}>
                    ¿Qué modalidad?
                </Text>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    contentContainerStyle={{ gap: scale(16) }}
                >
                    <SportModeButton
                        key="todos"
                        index={0}
                        onPress={handleSelectAllModes}
                        isAll={true}
                        allSelected={selectedSportModes.length === sportModesForSelectedSports.length}
                    />
                    {sportModesForSelectedSports.map((mode, index) => (
                        <SportModeButton
                            key={mode._id}
                            mode={mode}
                            index={index}
                            onPress={handleSelectMode}
                            selected={
                                sportModesForSelectedSports.length === selectedSportModes.length?
                                false
                                :
                                selectedSportModes.some(m => m._id === mode._id)
                            }
                            length={sportModesForSelectedSports.length}
                            hasAll={true}
                        />
                    ))}

                </ScrollView>
            </Div>
        </Div>
    );
};

export default SportArrayInput;
