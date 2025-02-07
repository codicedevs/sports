import React, { useState } from 'react'
import { Div, Text } from 'react-native-magnus'
import { customTheme } from '../../../utils/theme'
import { ScrollView, View } from 'react-native'
import SportButton from '../Form/sportButton'
import SportModeButton from '../Form/sportModeButton'
import { useSharedValue, withTiming } from 'react-native-reanimated'

const SportInput = () => {
    const [selectedSport, setSelectedSport] = useState('');
    const [selectedSportMode, setSelectedSportMode] = useState('');
    const mockSport = [{ name: 'Futbol', _id: '123' }, { name: 'Basquet', _id: '321' }, { name: "Padel", _id: '434' }];
    const mockSportMode = [{ name: '5', _id: '123' }, { name: '7', _id: '321' }, { name: "11", _id: '434' }];

    const sportAnimations = mockSport.map(() => useSharedValue(0));
    const modeAnimations = mockSportMode.map(() => useSharedValue(0));

    // Función para manejar selección de deporte con fade
    const handleSelectSport = (sportId: string, index: number) => {
        setSelectedSport(sportId);

        sportAnimations.forEach((animation, i) => {
            animation.value = withTiming(i === index ? 1 : 0, { duration: 80 });
        });
    };

    // Función para manejar selección de modalidad con fade
    const handleSelectMode = (modeId: string, index: number) => {
        setSelectedSportMode(modeId);

        modeAnimations.forEach((animation, i) => {
            animation.value = withTiming(i === index ? 1 : 0, { duration: 80 });
        });
    };

    return (
        <Div>
            <Div pb={customTheme.spacing.medium} style={{ gap: 8 }}>
                <Text fontSize={16} px={customTheme.spacing.medium}>¿Qué deporte juegan?</Text>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ gap: 16 }}>
                    {mockSport.map((sport, index) => (
                        <SportButton
                            key={sport._id}
                            sport={sport}
                            index={index}
                            onPress={handleSelectSport}
                            animationValue={sportAnimations[index]}
                            length={mockSport.length}
                        />
                    ))}
                </ScrollView>
            </Div>

            <Div px={16}>
                <View style={{ width: '100%', borderBottomWidth: 1, borderStyle: "dotted" }} />
            </Div>

            <Div pt={customTheme.spacing.medium} style={{ gap: 8 }}>
                <Text fontSize={16} px={16}>¿Qué modalidad?</Text>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ gap: 16 }}>
                    {mockSportMode.map((mode, index) => (
                        <SportModeButton
                            key={mode._id}
                            mode={mode}
                            index={index}
                            onPress={handleSelectMode}
                            animationValue={modeAnimations[index]}
                            length={mockSportMode.length}
                        />
                    ))}
                </ScrollView>
            </Div>
        </Div>
    )
}

export default SportInput
