import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';

type StepModalProps = {
  steps: React.ReactNode[];
  visible: boolean;
  onClose: () => void;
  currentStep: number; 
};

const StepModal: React.FC<StepModalProps> = ({ steps, visible, onClose, currentStep }) => {
  const [isClosing, setIsClosing] = useState(false); // Para controlar la animación de cierre

  // Reiniciar la animación de cierre al cerrar el modal
  useEffect(() => {
    if (!visible) {
      setIsClosing(false);
    }
  }, [visible]);

  /**
   * Finalizar animación de cierre
   */
  const handleAnimationComplete = () => {
    if (isClosing) {
      onClose(); // Cierra el modal después de la animación de salida
      setIsClosing(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none">
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
             {currentStep < steps.length ? steps[currentStep] : null}
            </MotiView>
          )}
        </AnimatePresence>
      </View>
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
    position:"absolute"
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0', // Botón deshabilitado durante la animación
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default StepModal;
