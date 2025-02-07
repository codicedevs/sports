import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { View } from 'react-native';
import { scale } from 'react-native-size-matters';
import Animated, { SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { customTheme } from '../../../utils/theme';

interface SportModeButtonProps {
  mode: {
    name: string,
    _id: string
  },
  index: number,
  onPress: (modeId: string, index: number) => void,
  animationValue: SharedValue<number>,
  length: number
}

const SportModeButton = ({ mode, index, onPress, animationValue, length }: SportModeButtonProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: animationValue.value
      ? withTiming('black', { duration: 80 })
      : withTiming('white', { duration: 80 }),
    opacity: withTiming(animationValue.value ? 1 : 0.5, { duration: 80 }),
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    color: animationValue.value
      ? withTiming('white', { duration: 80 })
      : withTiming('black', { duration: 80 }),
  }));

  return (
    <TouchableWithoutFeedback onPress={() => onPress(mode._id, index)}>
      <View >
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
            animatedStyle
          ]}
        >
          <Animated.Text
            style={[
              { fontSize: customTheme.fontSize.xl, fontFamily: "NotoSans-BoldItalic" },
              textAnimatedStyle
            ]}
          >
            {mode.name}
          </Animated.Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SportModeButton;
