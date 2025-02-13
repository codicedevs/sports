import React, { useEffect } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { customTheme } from '../../../utils/theme';

interface SportModeButtonProps {
  mode: {
    name: string;
    _id: string;
    label: string
  };
  index: number;
  onPress: (modeId: {
    name: string;
    _id: string;
    label: string
  }, index: number) => void;
  selected: boolean; // Prop que indica si el botón está seleccionado
  length: number;
}

const SportModeButton = ({ mode, index, onPress, selected, length }: SportModeButtonProps) => {
  // Inicializamos la animación localmente
  const animationValue = useSharedValue(0);

  // Actualizamos la animación cuando cambia la prop 'selected'
  useEffect(() => {
    animationValue.value = withTiming(selected ? 1 : 0, { duration: 80 });
  }, [selected, animationValue]);

  // Aplicamos la misma lógica de animación que en SportButton
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: animationValue.value
      ? withTiming('black', { duration: 80 })
      : withTiming('white', { duration: 80 }),
    opacity: withTiming(animationValue.value ? 1 : 0.8, { duration: 80 }),
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    color: animationValue.value
      ? withTiming('white', { duration: 80 })
      : withTiming('black', { duration: 80 }),
  }));

  return (
    <TouchableWithoutFeedback onPress={() => onPress(mode, index)}>
      <View>
        <Animated.View
          style={[
            {
              width: scale(88),
              height: scale(88),
              borderWidth: 1,
              borderRadius: 56,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: index === 0 ? customTheme.spacing.medium : 0,
              marginRight: index === length - 1 ? 16 : 0,
            },
            animatedStyle,
          ]}
        >
          <Animated.Text
            style={[
              { fontSize: customTheme.fontSize.xl, fontFamily: 'NotoSans-BoldItalic' },
              textAnimatedStyle,
            ]}
          >
            {mode.label ? mode.label : "5"}
          </Animated.Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SportModeButton;
