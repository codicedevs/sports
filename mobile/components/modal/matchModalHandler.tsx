import React, { useState } from 'react';
import { Div, Text, Modal } from "react-native-magnus";
import Match from '../../types/match.type';
import { customTheme } from '../../utils/theme';
import { verticalScale } from 'react-native-size-matters';
import PlayersCounterInput from '../matche/Inputs/playersCounter';
import { Accordion } from '../collapsibleView';
import SportInput from '../matche/Inputs/sport';
import MatchPrivacyToggleInput from '../matche/Inputs/matchPrivacyToggle';
import { ScrollView } from 'react-native';
import MatchSchedulerInput from '../matche/Inputs/matchScheduler';

const MatchModalHandler = ({ open, setOpen, match }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; match?: Match }) => {
  const [openId, setOpenId] = useState<null | string>(null);

  return (
    <Modal isVisible={open} onBackButtonPress={() => setOpen(false)}>
      <ScrollView >
        <Div flex={1} style={{ gap: verticalScale(16) }} bg={customTheme.colors.background} p={customTheme.spacing.medium}>
          <Accordion id={"Deportes"} openId={openId} setOpenId={setOpenId} title={'Deporte'} rightText='Futbol 5' size={342} >
            <SportInput />
          </Accordion>
          <Accordion id={"PlayerInput"} openId={openId} setOpenId={setOpenId} title={'Cupo'} rightText='Agrega participantes' size={123} >
            <PlayersCounterInput />
          </Accordion>
          <Accordion id={"PrivacyToggle"} openId={openId} setOpenId={setOpenId} title={'Privacidad'} rightText='Privada' size={134} >
            <MatchPrivacyToggleInput />
          </Accordion>
          <Div borderBottomWidth={1} borderBottomColor={customTheme.colors.gray} />
          <Text fontSize={customTheme.fontSize.medium} color={customTheme.colors.gray} fontFamily='NotoSans-Variable'>Campos no obligatorios para crear</Text>
          <Accordion id={"Horario"} openId={openId} setOpenId={setOpenId} title={'Horario'} rightText='A definir' size={802} >
            <MatchSchedulerInput />
          </Accordion>
        </Div>
      </ScrollView>
    </Modal>
  );
};

export default MatchModalHandler;
