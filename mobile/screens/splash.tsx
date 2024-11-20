import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SplashContainer } from '../components/styled/styled';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const SplashScreen = () => {
    const [show, setShow] = useState(true);
    const opacity = useSharedValue(1);
    const rotation = useSharedValue(0);

    const containerStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    const imageStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    useEffect(() => {
        rotation.value = withTiming(360, { duration: 2000 }, () => {
            opacity.value = withTiming(0, { duration: 4000 }, () => {
                runOnJS(setShow)(false);
            });
        });
    }, []);

    if (!show) return null;

    return (
        <SplashContainer style={containerStyle}>
            <AnimatedImage
                resizeMode='contain'
                source={require("../assets/beardman.png")}
                style={imageStyle}
            />
        </SplashContainer>
    );
};

export default SplashScreen;
