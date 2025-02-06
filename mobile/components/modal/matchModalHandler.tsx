import React, { useState } from 'react';
import { ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { Div, Modal, Text } from "react-native-magnus";
import { scale, verticalScale } from 'react-native-size-matters';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import SportButton from '../matche/Form/sportButton';
import SportModeButton from '../matche/Form/sportModeButton';
import { customTheme } from '../../utils/theme';

const MatchModalHandler = ({ open, setOpen }) => {
  // Estados de selección
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedSportMode, setSelectedSportMode] = useState('');

  // Mock de deportes y modalidades
  const mockSport = [{ name: 'Futbol', _id: '123' }, { name: 'Basquet', _id: '321' }, { name: "Padel", _id: '434' }];
  const mockSportMode = [{ name: '5', _id: '123' }, { name: '7', _id: '321' }, { name: "11", _id: '434' }];

  // Estados de animación para cada deporte y modalidad
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

  //DIV EXPANDIDO

  const height = useSharedValue(50); // Comienza en 50px
  const [expanded, setExpanded] = useState(false); // Estado de expansión

  // Estilos animados
  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value, // Se anima dinámicamente
  }));

  // Función para manejar el press y cambiar la altura
  const toggleHeight = () => {
    setExpanded(!expanded);
    height.value = withTiming(expanded ? 50 : 342, { duration: 500 }); // Alterna altura
  };

  return (
    <Modal isVisible={open} onBackButtonPress={() => setOpen(false)}>
      <Div p={customTheme.spacing.medium}>
        <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>
          <Div w={"100%"} >
            <TouchableWithoutFeedback onPress={toggleHeight}>
              <Div>
                <Animated.View
                  style={[
                    {
                      width: '100%',
                      borderWidth: 1,
                      borderColor: 'black',
                      height: "100%",
                      paddingVertical: customTheme.spacing.small
                    },
                    animatedStyle,
                  ]}
                >
                  <Div pb={customTheme.spacing.medium} style={{ gap: 8 }}>
                    <Text fontSize={16} px={customTheme.spacing.medium}>¿Qué deporte juegan?</Text>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ gap: 16}}>
                      {mockSport.map((sport, index) => (
                        <SportButton
                          key={sport._id}
                          sport={sport}
                          index={index}
                          onPress={handleSelectSport}
                          animationValue={sportAnimations[index]}
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
                        />
                      ))}
                    </ScrollView>
                  </Div>
                </Animated.View>
              </Div>
            </TouchableWithoutFeedback>
            {/*               
              <Div py={16} style={{ gap: 16 }}>
                <Text fontSize={16} px={16}>¿Qué deporte juegan?</Text>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ gap: 16 }}>
                  {mockSport.map((sport, index) => (
                    <SportButton
                      key={sport._id}
                      sport={sport}
                      index={index}
                      onPress={handleSelectSport}
                      animationValue={sportAnimations[index]}
                    />
                  ))}
                </ScrollView>
              </Div>

              <Div px={16}>
                <View style={{ width: '100%', borderBottomWidth: 1, borderStyle: "dotted" }} />
              </Div>

              
              <Div py={16} style={{ gap: 16 }}>
                <Text fontSize={16} px={16}>¿Qué modalidad?</Text>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ gap: 16 }}>
                  {mockSportMode.map((mode, index) => (
                    <SportModeButton
                      key={mode._id}
                      mode={mode}
                      index={index}
                      onPress={handleSelectMode}
                      animationValue={modeAnimations[index]}
                    />
                  ))}
                </ScrollView>
              </Div> */}

          </Div>

        </ScrollView>
      </Div>
    </Modal>
  );
};

export default MatchModalHandler;
