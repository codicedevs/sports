import React, { useState } from 'react';
import { ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { Div, Modal, Text } from "react-native-magnus";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { customTheme } from '../../utils/theme';
import SportInput from '../matche/Inputs/sport';
import { Accordion } from '../collapsibleView';

interface ModalProps {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MatchModalHandler = ({ open, setOpen }: ModalProps) => {
  const [openId, setOpenId] = useState(null);

  return (
    <Modal isVisible={open} onBackButtonPress={() => setOpen(false)}>
      <Div p={customTheme.spacing.medium}>
        {
          <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>
            <Div w={"100%"} >
              <Accordion id='sports' title={"Deportes"} openId={openId} setOpenId={setOpenId} >
                <SportInput />
              </Accordion>
            </Div>
          </ScrollView>
        }
      </Div>
    </Modal>
  );
};

export default MatchModalHandler;
