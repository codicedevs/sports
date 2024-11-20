import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { Animated } from 'react-native';

export const FadeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    useFocusEffect(
        React.useCallback(() => {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();

            return () => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }).start();
            };
        }, [fadeAnim])
    );

    return (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            {children}
        </Animated.View>
    );
};
