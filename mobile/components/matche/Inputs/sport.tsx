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
import { MatchDetails, Sport, SportMode } from '../../../types/form.type';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';

interface SportInputProps {
  matchDetailsRef: React.MutableRefObject<MatchDetails>;
}

const SportInput = ({ matchDetailsRef }: SportInputProps) => {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(
    matchDetailsRef.current.selectedSport
  );
  const [selectedSportMode, setSelectedSportMode] = useState<SportMode | null>(
    matchDetailsRef.current.selectedSportMode
  );

  const { data: sports } = useFetch(sportService.getAll, [QUERY_KEYS.SPORTS]);
  const { data: allSportModes } = useFetch(sportmodeService.getAll, [QUERY_KEYS.SPORT_MODES]);

  useEffect(() => {

    if (selectedSport && allSportModes?.data) {
      const filteredModes = allSportModes.data.results.filter(
        (mode: SportMode) => mode.sport === selectedSport._id
      );
      if (filteredModes.length > 0) {
        setSelectedSportMode(filteredModes[0]);
        matchDetailsRef.current.selectedSportMode = filteredModes[0];
      } else {
        setSelectedSportMode(null);
        matchDetailsRef.current.selectedSportMode = null;
      }
    }
  }, [selectedSport, allSportModes]);

  const handleSelectSport = (sport: Sport, index: number) => {
    setSelectedSport(sport);
    matchDetailsRef.current.selectedSport = sport;
    
  };

  const handleSelectMode = (mode: SportMode, index: number) => {
    setSelectedSportMode(mode);
    matchDetailsRef.current.selectedSportMode = mode;
  };

  useEffect(() => {
    if (!selectedSport && sports) {
      const defaultSport = sports.results[0];
      setSelectedSport(defaultSport);
      matchDetailsRef.current.selectedSport = defaultSport;
    }
  }, [sports]);

  if (!sports || !allSportModes)
    return (
      <MotiView>
        <Skeleton colorMode="light" height={'100%'} width={'100%'} />
      </MotiView>
    );

  const sportModesForSelectedSport = allSportModes
    ? allSportModes.results.filter(
      (mode: SportMode) => mode.sport === selectedSport?._id
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
              selected={selectedSport?._id === sport._id}
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
          {sportModesForSelectedSport.map((mode, index) => (
            <SportModeButton
              key={mode._id}
              mode={mode}
              index={index}
              onPress={handleSelectMode}
              selected={selectedSportMode?._id === mode._id}
              length={sportModesForSelectedSport.length}
            />
          ))}
        </ScrollView>
      </Div>
    </Div>
  );
};

export default SportInput;
