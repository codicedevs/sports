import React, { useState, useRef } from 'react';
import { TextInput, Animated, Pressable } from 'react-native';
import { Div, Icon, Text } from 'react-native-magnus';
import { scale, verticalScale } from 'react-native-size-matters';
import { customTheme } from '../../../utils/theme';

const SearchLocationInput = () => {
    const [isEditing, setIsEditing] = useState(false);
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: -60,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            })
        ]).start(() => {
            setIsEditing(true);
        });
    };

    const handleBlur = () => {
        setIsEditing(false);
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            })
        ]).start();
    };

    return (
        <Div p={customTheme.spacing.medium}>
            <Text mb={customTheme.spacing.medium}>¿Dónde juegan?</Text>
            <Pressable onPress={handlePress} disabled={isEditing}>
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
                                opacity,
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
                            onBlur={handleBlur}
                        />
                    )}
                </Div>
            </Pressable>
        </Div>
    );
};

export default SearchLocationInput;
