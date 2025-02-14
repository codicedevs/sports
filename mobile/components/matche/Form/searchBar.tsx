import React, { useRef, useEffect } from 'react';
import { TextInput, Animated, Pressable, TouchableWithoutFeedback } from 'react-native';
import { Div, Icon, Text } from 'react-native-magnus';
import { scale, verticalScale } from 'react-native-size-matters';
import { customTheme } from '../../../utils/theme';

interface SearchBarProps {
  isEditing:boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setFilter: React.Dispatch<React.SetStateAction<string>>
}

const SearchBar = ({ isEditing, setIsEditing, setFilter }: SearchBarProps) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const placeholderOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isEditing) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -60,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(placeholderOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(placeholderOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isEditing, translateX, placeholderOpacity]);

  const handlePress = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Div
        h={verticalScale(48)}
        borderWidth={1}
        flexDir="row"
        alignItems="center"
        justifyContent="center"
        px={customTheme.spacing.medium}
        rounded={8}
        overflow="hidden"
      >
        <Animated.View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            position: 'absolute',
            left: '50%',
            transform: [
              { translateX: scale(-40) },
              { translateX }
            ]
          }}
        >
          <Icon
            color="black"
            fontSize={customTheme.fontSize.medium}
            name="search"
            fontFamily="Feather"
          />
          <Animated.Text
            style={{
              marginLeft: 8,
              opacity: placeholderOpacity,
              fontSize: customTheme.fontSize.medium
            }}
          >
            Buscar
          </Animated.Text>
        </Animated.View>

        {isEditing && (
          <TextInput
            autoFocus
            style={{
              flex: 1,
              fontSize: customTheme.fontSize.medium,
              marginLeft: customTheme.spacing.xl
            }}
            placeholder="Buscar ubicación..."
            onBlur={() => setIsEditing(false)}
            onChangeText={setFilter}
          />
        )}
      </Div>
    </TouchableWithoutFeedback>
  );
};

export default SearchBar;
