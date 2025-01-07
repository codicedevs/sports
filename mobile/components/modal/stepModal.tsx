import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';

type StepModalProps = {
  steps: React.ReactNode[];
  visible: boolean;
  onClose: () => void;
  currentStep: number; 
};

const StepModal: React.FC<StepModalProps> = ({ steps, visible, onClose, currentStep }) => {
  const [isClosing, setIsClosing] = useState(false); // Para controlar la animación de cierre

  useEffect(() => {
    if (!visible) {
      setIsClosing(false);
    }
  }, [visible]);

  const handleAnimationComplete = () => {
    if (isClosing) {
      onClose();
      setIsClosing(false);
    }
  };

  const handleOverlayPress = () => {
    setIsClosing(true); // Inicia la animación de salida
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={styles.overlay}>
          <AnimatePresence>
            {visible && (
              <MotiView
                key={currentStep}
                style={styles.modalContainer}
                from={{
                  opacity: 0,
                  width: '0%',
                  height: '0%',
                }}
                animate={{
                  opacity: 1,
                  width: '90%',
                  height: '60%',
                }}
                exit={{
                  opacity: 0,
                  width: '10%',
                  height: '10%',
                }}
                onDidAnimate={handleAnimationComplete}
                transition={{
                  type: 'spring',
                  damping: 15,
                  stiffness: 200,
                }}
              >
                <TouchableWithoutFeedback>
                  <View style={styles.content}>
                    {currentStep < steps.length ? steps[currentStep] : null}
                  </View>
                </TouchableWithoutFeedback>
              </MotiView>
            )}
          </AnimatePresence>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
  },
  content: {
    width: '100%',
    height: '100%',
  },
});

export default StepModal;
