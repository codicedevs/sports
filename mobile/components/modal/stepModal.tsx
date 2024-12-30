import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';

type StepModalProps = {
  steps: React.ReactNode[]; // Array de componentes para cada paso
  visible: boolean;
  onClose: () => void;
};

const StepModal: React.FC<StepModalProps> = ({ steps, visible, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isClosing, setIsClosing] = useState(false); // Para controlar la animación de cierre

  // Reiniciar los pasos al cerrar el modal
  useEffect(() => {
    if (!visible) {
      setCurrentStep(0);
      setIsClosing(false);
    }
  }, [visible]);

  const handleNextStep = () => {
    if (isClosing) return; // Evita interacción durante el cierre

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Iniciar animación de cierre
      setIsClosing(true);
    }
  };

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
          {(visible || isClosing) && (
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
              onDidAnimate={handleAnimationComplete} // Detecta el fin de la animación
              transition={{
                type: 'spring',
                damping: 15, // Amortiguación (menor valor, más rebote)
                stiffness: 200, // Rigidez (mayor valor, animación más rápida)
              }}
            >
              {steps[currentStep]}
              <TouchableOpacity
                onPress={handleNextStep}
                style={[
                  styles.button,
                  isClosing && styles.buttonDisabled,
                ]}
                disabled={isClosing}
              >
                <Text style={styles.buttonText}>
                  {currentStep < steps.length - 1 ? 'Siguiente' : 'Cerrar'}
                </Text>
              </TouchableOpacity>
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
