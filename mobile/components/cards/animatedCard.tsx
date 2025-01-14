import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { scale } from 'react-native-size-matters';

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
  time = { duration: 300, opacityDuration: 200 },
  containerStyle = {},
}: ModalAnimationProps) => {
  const [visible, setVisible] = useState(false);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
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
    <Modal transparent visible={visible} animationType="none" onRequestClose={onFinish}>
      {/* Fondo Oscuro */}
      <TouchableWithoutFeedback onPress={hideModal}>
        <Animated.View style={[styles.overlay, animatedBackgroundStyle]} />
      </TouchableWithoutFeedback>

      {/* Modal */}
      <View style={styles.centeredView}>
        <Animated.View
          style={[
            styles.modal,
            animatedModalStyle,
            StyleSheet.flatten(containerStyle),
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ModalAnimation;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: scale(320),
    height: scale(400),
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 1001,
  },
});
