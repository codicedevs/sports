import React, { useState } from 'react'
import { Div, Text } from 'react-native-magnus'
import { customTheme } from '../../../utils/theme'
import { ScrollView, View } from 'react-native'
import SportButton from '../Form/sportButton'
import SportModeButton from '../Form/sportModeButton'
import useFetch from '../../../hooks/useGet'
import sportmodeService from '../../../service/sportmode.service'
import { QUERY_KEYS } from '../../../types/query.types'
import { scale, verticalScale } from 'react-native-size-matters'

const SportInput = () => {
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedSportMode, setSelectedSportMode] = useState('');

  const { data: sports } = useFetch(sportmodeService.getAll, [QUERY_KEYS.SPORTS]);
  const { data: sportModes } = useFetch(sportmodeService.getAll, [QUERY_KEYS.SPORT_MODES]);

  if (!sports || !sportModes) return null;

  const handleSelectSport = (sportId: string, index: number) => {
    setSelectedSport(sportId);
  };

  const handleSelectMode = (modeId: string, index: number) => {
    setSelectedSportMode(modeId);
  };

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
              selected={selectedSport === sport._id}  // Pasa si está seleccionado
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
              selected={selectedSportMode === mode._id}  // Pasa si está seleccionado
              length={sportModes.data.length}
            />
          ))}
        </ScrollView>
      </Div>
    </Div>
  );
};

export default SportInput;
