import { useEffect } from "react";
import { TouchableWithoutFeedback, View, Text } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from "react-native-reanimated";
import { customTheme } from "../utils/theme";
import { Div } from "react-native-magnus";
import { verticalScale } from "react-native-size-matters";

interface CollapsibleViewProps {
  id:string,
  title: string,
  children: React.JSX.Element,
  openId:string | null,
  setOpenId: React.Dispatch<React.SetStateAction<string | null>>,
  size:number
}

export const Accordion = ({ id, title, children, openId, setOpenId, size }: CollapsibleViewProps) => {
    const isOpen = openId === id;
    const height = useSharedValue(verticalScale(50));

    const animatedStyle = useAnimatedStyle(() => ({
        height: height.value,
    }));

    useEffect(() => {
        runOnJS(setTimeout)(() => { // ⬅ Hace que la animación se ejecute correctamente
            height.value = withTiming(isOpen ? verticalScale(size) : verticalScale(50), { duration: 300 });
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
                    <Div justifyContent='center' h={verticalScale(50)} px={customTheme.spacing.medium}>
                        <Text>{title}</Text>
                    </Div>
                </TouchableWithoutFeedback>
            }
            <Div>
                {children}
            </Div>
        </Animated.View>
    );
};
