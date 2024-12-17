import React, { useEffect, useState } from "react";
import { View, StyleSheet, StyleProp, ViewStyle, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface ModalAnimationProps {
  open: boolean;
  children: React.ReactNode;
  onFinish: () => void;
  time?: {
    duration?: number;
    opacityDuration?: number;
  };
  containerStyle?: StyleProp<ViewStyle>;
}

const ModalAnimation = ({
  open,
  children,
  onFinish,
  time = { duration: 500, opacityDuration: 300 },
  containerStyle = {},
}: ModalAnimationProps) => {
  const [visible, setVisible] = useState(false);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    handleModal();
  }, [open]);

  const handleModal = () => {
    if (open) {
      showModal();
    } else {
      hideModal();
    }
  };

  const showModal = () => {
    setVisible(true);
    opacity.value = withTiming(1, {
      duration: time.opacityDuration,
      easing: Easing.out(Easing.exp),
    });
    scale.value = withTiming(1, {
      duration: time.duration,
      easing: Easing.out(Easing.exp),
    });
  };

  const hideModal = () => {
    opacity.value = withTiming(0, {
      duration: time.opacityDuration,
      easing: Easing.in(Easing.exp),
    });
    scale.value = withTiming(0, {
      duration: time.duration,
      easing: Easing.in(Easing.exp),
    });
    setTimeout(() => {
      setVisible(false);
      onFinish();
    }, time.duration!);
  };

  return (
    visible && (
      <View style={styles.overlay}>
        <Pressable style={styles.background} onPress={hideModal}>
          <Animated.View style={[styles.modal, animatedStyle, containerStyle]}>
            {children}
          </Animated.View>
        </Pressable>
      </View>
    )
  );
};

export default ModalAnimation;

const styles = StyleSheet.create({
  overlay: {
    flex: 1, // Ocupa todo el espacio
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(22, 22, 22, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  background: {
    flex: 1, // Asegura que cubre todo
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
});

