import React, { useEffect, useRef, useState } from 'react';
import { Div, Text, Modal } from "react-native-magnus";
import Match from '../../types/match.type';
import { customTheme } from '../../utils/theme';
import { verticalScale } from 'react-native-size-matters';
import PlayersCounterInput from '../matche/Inputs/playersCounter';
import { Accordion } from '../collapsibleView';
import SportInput from '../matche/Inputs/sport';
import MatchPrivacyToggleInput from '../matche/Inputs/matchPrivacyToggle';
import { ScrollView, TouchableOpacity } from 'react-native';
import MatchSchedulerInput from '../matche/Inputs/matchScheduler';
import SearchLocationInput from '../matche/Inputs/searchLocation';
import { MatchDetails, Place, PrivacyOption, Sport, SportMode } from '../../types/form.type';

const MatchModalHandler = ({ open, setOpen, match }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; match?: Match }) => {
  const matchDetailsRef = useRef<MatchDetails>({
    selectedSport: null,
    selectedSportMode: null,
    playerLimit: 0,
    privacyOption: 'private',
    matchDate: null,
    location: null,
  });

  const [openId, setOpenId] = useState<null | string>(null);

  const createMatch = () => {

  }

  return (
    <Modal isVisible={open} onBackButtonPress={() => setOpen(false)}>
      <ScrollView >
        <Div flex={1} style={{ gap: verticalScale(16) }} bg={customTheme.colors.background} p={customTheme.spacing.medium}>
          <Accordion id={"Deportes"} openId={openId} setOpenId={setOpenId} title={'Deporte'} rightText='Futbol 5' size={342} >
            <SportInput matchDetailsRef={matchDetailsRef} />
          </Accordion>
          <Accordion id={"PlayerInput"} openId={openId} setOpenId={setOpenId} title={'Cupo'} rightText='Agrega participantes' size={123} >
            <PlayersCounterInput matchDetailsRef={matchDetailsRef} />
          </Accordion>
          <Accordion id={"PrivacyToggle"} openId={openId} setOpenId={setOpenId} title={'Privacidad'} rightText='Privada' size={134} >
            <MatchPrivacyToggleInput matchDetailsRef={matchDetailsRef} />
          </Accordion>
          <Div borderBottomWidth={1} borderBottomColor={customTheme.colors.gray} />
          <Text fontSize={customTheme.fontSize.medium} color={customTheme.colors.gray} fontFamily='NotoSans-Variable'>Campos no obligatorios para crear</Text>
          <Accordion id={"Horario"} openId={openId} setOpenId={setOpenId} title={'Horario'} rightText='A definir' size={802} >
            <MatchSchedulerInput matchDetailsRef={matchDetailsRef} />
          </Accordion>
          <Accordion id={"Busqueda"} openId={openId} setOpenId={setOpenId} title={'¿Donde juegan?'} rightText='A definir' size={300} >
            <SearchLocationInput matchDetailsRef={matchDetailsRef} />
          </Accordion>
        </Div>
      </ScrollView>
      <Div justifyContent='center' bg='#151515E5' h={verticalScale(80)} p={customTheme.spacing.medium}>
        <TouchableOpacity>
          <Div h={verticalScale(45)} justifyContent='center' bg={customTheme.colors.primary}>
            <Text textAlign='center'>Crear</Text>
          </Div>
        </TouchableOpacity>
      </Div>
    </Modal>
  );
};

export default MatchModalHandler;
