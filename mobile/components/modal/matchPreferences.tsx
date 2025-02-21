import React, { useRef, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native';
import { Div, Modal, Text } from 'react-native-magnus';
import { Accordion } from '../collapsibleView';
import { MatchDetails, Profile } from '../../types/form.type';
import { verticalScale } from 'react-native-size-matters';
import SportInput from '../matche/Inputs/sport';
import { customTheme } from '../../utils/theme';
import DateTimePreferenceInput from '../matche/Inputs/dateTimePreference';
import userService from '../../service/user.service';
import SelectZoneInput from '../matche/Inputs/selectZone';
import SportArrayInput from '../matche/Inputs/sportsArray';

const MatchPreferencesModal = ({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [openId, setOpenId] = useState<null | string>(null);
    const matchDetailsRef = useRef<Profile>({
        availability: null,
        preferredSportModes: null,
        preferredSports: null,
        preferredZones: null,
    });

    const closeModal = () => {
        setOpenId(null)
        setOpen(false)
    }

    const createPreference = async () => {
        try {
            const res = await userService.put('6720ef183a78ebc10564e97b', {
                profile: {
                    preferredSports: matchDetailsRef.current.preferredSports,
                    preferredSportModes: matchDetailsRef.current.preferredSportModes,
                    availability: matchDetailsRef.current.availability,
                    preferedZones: matchDetailsRef.current.preferredZones
                }
            })
            console.log(res.data)
        } catch (e) { 
            console.log(e,'ERROR FATAL')
        }
    }

    return (
        <Modal isVisible={open} onBackButtonPress={closeModal}>
            <ScrollView >
                <Div flex={1} style={{ gap: verticalScale(16) }} bg={customTheme.colors.background} p={customTheme.spacing.medium}>
                    <Accordion id={"Deportes"} openId={openId} setOpenId={setOpenId} title={'Deporte'} rightText='Futbol 5' size={342} >
                        <SportArrayInput matchDetailsRef={matchDetailsRef} />
                    </Accordion>
                    <Div borderBottomWidth={1} borderBottomColor={customTheme.colors.gray} />
                    <Text fontSize={customTheme.fontSize.medium} color={customTheme.colors.gray} fontFamily='NotoSans-Variable'>Campos no obligatorios para crear</Text>
                    <Accordion id={"Horario"} openId={openId} setOpenId={setOpenId} title={'Horario'} rightText='A definir' size={572} >
                        <DateTimePreferenceInput matchDetailsRef={matchDetailsRef} />
                    </Accordion>
                    <Accordion id={"Zona"} openId={openId} setOpenId={setOpenId} title={'Zona'} rightText='A definir' size={358} >
                        <SelectZoneInput matchDetailsRef={matchDetailsRef} />
                    </Accordion>
                </Div>
            </ScrollView>
            <Div justifyContent='center' bg='#151515E5' h={verticalScale(80)} p={customTheme.spacing.medium}>
                <TouchableOpacity onPress={createPreference}>
                    <Div h={verticalScale(45)} justifyContent='center' bg={customTheme.colors.primary}>
                        <Text textAlign='center'>Crear</Text>
                    </Div>
                </TouchableOpacity>
            </Div>
        </Modal>
    );
}

export default MatchPreferencesModal
