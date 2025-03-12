import React, { useEffect } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { customTheme } from '../../../utils/theme';
import { SportMode } from '../../../types/form.type';

interface SportModeButtonProps {
  mode?: {
    name: string;
    _id: string;
    label: string;
  };
  index: number;
  onPress: (mode?: SportMode, index: number) => void;
  selected: boolean;
  length: number;
  isAll?: boolean;
  allSelected?: boolean
  hasAll?: boolean
}

const SportModeButton = ({
  mode,
  index,
  onPress,
  selected,
  length,
  isAll = false,
  allSelected,
  hasAll = false
}: SportModeButtonProps) => {
  if (isAll) {
    return (
      <TouchableWithoutFeedback onPress={() => onPress(undefined, index)}>
        <View>
          <View
            style={{
              width: scale(88),
              height: scale(88),
              borderWidth: 1,
              borderRadius: 56,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: customTheme.spacing.medium,
              backgroundColor: allSelected ? 'black' : 'white',
            }}
          >
            <Animated.Text
              style={{
                fontSize: customTheme.fontSize.large,
                fontFamily: 'NotoSans-BoldItalic',
                color: allSelected ? 'white' : 'black',
              }}
            >
              Todos
            </Animated.Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  const animationValue = useSharedValue(0);
  const adjustedIndex = isAll ? index + 1 : index;
  useEffect(() => {
    animationValue.value = withTiming(selected ? 1 : 0, { duration: 80 });
  }, [selected, animationValue]);

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
    <TouchableWithoutFeedback onPress={() => onPress(mode as SportMode, index)}>
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
              marginLeft: hasAll ? 0 : (index === 0 ? customTheme.spacing.medium : 0),
              marginRight: index === length - 1 ? 16 : 0,
            },
            animatedStyle,
          ]}
        >
          <Animated.Text
            style={[
              { fontSize: isAll ? customTheme.fontSize.small : customTheme.fontSize.xl, fontFamily: 'NotoSans-BoldItalic' },
              textAnimatedStyle,
            ]}
          >
            {mode?.name ?? "5"}
          </Animated.Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SportModeButton;
