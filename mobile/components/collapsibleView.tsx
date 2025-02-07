import { useEffect } from "react";
import { TouchableWithoutFeedback, View, Text } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from "react-native-reanimated";
import { customTheme } from "../utils/theme";
import { Div } from "react-native-magnus";

export const Accordion = ({ id, title, children, openId, setOpenId }) => {
    const isOpen = openId === id; // Verifica si este acordeón está abierto
    const height = useSharedValue(50); // ⬅ Comienza en colapsado

    const animatedStyle = useAnimatedStyle(() => ({
        height: height.value,
    }));

    useEffect(() => {
        runOnJS(setTimeout)(() => { // ⬅ Hace que la animación se ejecute correctamente
            height.value = withTiming(isOpen ? 342 : 50, { duration: 300 });
        }, 10);
    }, [isOpen]);

    const toggleAccordion = () => {
        setOpenId(isOpen ? null : id);
    };

    return (
        <Animated.View
            style={[
                {
                    width: '100%',
                    borderWidth: 1,
                    borderColor: 'black',
                    borderRadius: customTheme.borderRadius.medium,
                    overflow: "hidden",
                },
                animatedStyle
            ]}
        >
            {
                !isOpen &&
                <TouchableWithoutFeedback onPress={toggleAccordion}>
                <Div justifyContent='center' h={50} px={customTheme.spacing.medium}>
                    <Text>{title}</Text>
                </Div>
            </TouchableWithoutFeedback>
            }

            <Div py={customTheme.spacing.medium}>
                {children}
            </Div>
        </Animated.View>
    );
};
