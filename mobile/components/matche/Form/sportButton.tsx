import React, { useEffect } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Div } from "react-native-magnus";
import { scale, verticalScale } from 'react-native-size-matters';
import { customTheme } from '../../../utils/theme';

interface SportButtonProps {
  sport: {
    name: string,
    _id: string
  },
  index: number,
  onPress: (sportId: {
    name: string,
    _id: string
  }, index: number) => void,
  selected: boolean,
  length: number
}

const SportButton = ({ sport, index, onPress, selected, length }: SportButtonProps) => {
  const animationValue = useSharedValue(0);

  useEffect(() => {
    animationValue.value = withTiming(selected ? 1 : 0, { duration: 80 });
  }, [selected]);

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
    <TouchableWithoutFeedback onPress={() => onPress(sport, index)}>
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
              marginRight: index === length - 1 ? 16 : 0,
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
