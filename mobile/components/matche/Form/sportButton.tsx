import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { Div } from "react-native-magnus";
import { scale, verticalScale } from 'react-native-size-matters';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { customTheme } from '../../../utils/theme';

const SportButton = ({ sport, index, onPress, animationValue }) => {
  // Estilos animados
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: animationValue.value
      ? withTiming('black', { duration: 80 })
      : withTiming('white', { duration: 80 }),
    opacity: withTiming(animationValue.value ? 1 : 0.5, { duration: 80 }),
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    color: animationValue.value
      ? withTiming('white', { duration: 80 }) // Texto blanco si está seleccionado
      : withTiming('black', { duration: 80 }), // Texto negro si no está seleccionado
  }));

  return (
    <TouchableWithoutFeedback onPress={() => onPress(sport._id, index)}>
      <Div>
        <Animated.View
          style={[
            {
              width: scale(112),
              height: verticalScale(112),
              borderWidth: 1,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: index === 0 ? customTheme.spacing.medium : 0,
                                // marginRight: index === mockSport.length - 1 ? 16 : 0,
            },
            animatedStyle
          ]}
        >
          <Animated.Text
            style={[
              { fontSize: 16, fontFamily: "NotoSans-BoldItalic" },
              textAnimatedStyle
            ]}
          >
            {sport.name}
          </Animated.Text>
        </Animated.View>
      </Div>
    </TouchableWithoutFeedback>
  );
};

export default SportButton;
