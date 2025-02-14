import React, { useEffect, useState } from 'react';
import { Div, Text } from 'react-native-magnus';
import { customTheme } from '../../../utils/theme';
import { ScrollView, View } from 'react-native';
import SportButton from '../Form/sportButton';
import SportModeButton from '../Form/sportModeButton';
import useFetch from '../../../hooks/useGet';
import sportmodeService from '../../../service/sportmode.service';
import { QUERY_KEYS } from '../../../types/query.types';
import { scale, verticalScale } from 'react-native-size-matters';
import sportService from '../../../service/sport.service';
import { Sport, SportMode } from '../../../types/form.type';
import { MatchDetails } from '../../../types/match.types'; // Asegúrate de tener definido este tipo
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

  const fetchSportModesById = async () => {
    if (selectedSport?.name) {
      const res = await sportmodeService.getModesBySportId(selectedSport._id);
      return res;
    } else {
      const res = await sportmodeService.getAll();
      return res;
    }
  };

  const { data: sports } = useFetch(sportService.getAll, [QUERY_KEYS.SPORTS]);
  const { data: sportModes } = useFetch(
    fetchSportModesById,
    [QUERY_KEYS.SPORT_MODES, selectedSport?.name]
  );

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
      const defaultSport = sports.data[0];
      setSelectedSport(defaultSport);
      matchDetailsRef.current.selectedSport = defaultSport;
    }
  }, [sports]);

  useEffect(() => {
    if (!selectedSportMode && sportModes) {
      const defaultMode = sportModes.data[0];
      setSelectedSportMode(defaultMode);
      matchDetailsRef.current.selectedSportMode = defaultMode;
    }
  }, [sportModes]);

  if (!sports || !sportModes) return (
    <MotiView>
      <Skeleton colorMode='light' height={'100%'} width={"100%"} />
    </MotiView>
  )

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
          {sports.data.map((sport, index) => (
            <SportButton
              key={sport._id}
              sport={sport}
              index={index}
              onPress={handleSelectSport}
              selected={selectedSport?._id === sport._id}
              length={sports.data.length}
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
          {sportModes.data.map((mode, index) => (
            <SportModeButton
              key={mode._id}
              mode={mode}
              index={index}
              onPress={handleSelectMode}
              selected={selectedSportMode?._id === mode._id}
              length={sportModes.data.length}
            />
          ))}
        </ScrollView>
      </Div>
    </Div>
  );
};

export default SportInput;
