import React, { useEffect, useState } from 'react';
import { Button, Div, Overlay, Text, Input, Modal } from "react-native-magnus";
import { Keyboard, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import matchService from '../../service/match.service';
import { useSession } from '../../context/authProvider';
import { AppScreens } from '../../navigation/screens';
import { navigate } from '../../utils/navigation';
import Match from '../../types/match.type';
import { customTheme } from '../../utils/theme';
import { scale, verticalScale } from 'react-native-size-matters';
import PlayersCounterInput from '../matche/Inputs/playersCounter';
import { Accordion } from '../collapsibleView';
import SportInput from '../matche/Inputs/sport';

const MatchModalHandler = ({ open, setOpen, match }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; match?: Match }) => {
  const [openId, setOpenId] = useState(null);
 

 

  // if (!sports || !sportModes) return null;
  return (
    <Modal isVisible={open} onBackButtonPress={() => setOpen(false)}>
      <Div flex={1} style={{gap:verticalScale(16)}} p={customTheme.spacing.medium}>
        <Accordion id={"Deportes"} openId={openId} setOpenId={setOpenId} title={'Deportes'} size={342} >
          <SportInput />
        </Accordion>
        <Accordion id={"PlayerInput"} openId={openId} setOpenId={setOpenId} title={'Cupos'} size={123}>
        <PlayersCounterInput />
        </Accordion>
      </Div>
    </Modal>
  );
};

export default MatchModalHandler;
