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

const MatchModalHandler = ({ open, setOpen, match }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; match?: Match }) => {
  // States for selects
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedSportMode, setSelectedSportMode] = useState(match?.sportMode ?? '');
  const [selectValue3, setSelectValue3] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(match?.location ? match.location._id : '')
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(new Date())
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const { currentUser } = useSession()

  // NUEVO
  const [openSecond, setOpenSecond] = useState(false)
  const [amount, setAmount] = useState(10)
  const LowLimit = 10;
  const HighLimit = LowLimit + 5

  const IncreaseAmount = () => {
    if (amount === HighLimit) return
    setAmount(prev => prev + 1)
  }

  const DecreaseAmount = () => {
    if (amount === LowLimit) return
    setAmount(prev => prev - 1)
  }

  const createMatch = async () => {
    try {
      const res = await matchService.create({
        name: "BORRAR-5-con location",
        date: date,
        location: selectedLocation,
        playersLimit: 10,
        userId: "6720ef183a78ebc10564e97b",
        sportMode: selectedSportMode
      })
      navigate(AppScreens.MATCH_DETAIL, { id: res.data._id });
    } catch (e) {

    }
  }

  const editMatch = async () => {
    if (!match) return
    try {
      const res = await matchService.update(match._id, {
        name: "BORRAR-5-con location",
        date: date,
        location: selectedLocation,
        playersLimit: 10,
        userId: "6720ef183a78ebc10564e97b",
        sportMode: selectedSportMode
      })
    } catch (e) {

    } finally {

    }
  }

  const mockSport = [{ name: 'Futbol', _id: '123' }, { name: 'Basquet', _id: '321' }, { name: "padel", id: '434' }]
  const mockSportMode = [{ name: '5', _id: '123' }, { name: '7', _id: '321' }, { name: "11", id: '434' }]



  // if (!sports || !sportModes) return null;
  return (
    <Modal isVisible={open} onBackButtonPress={() => setOpen(false)}>
      <Div p={customTheme.spacing.medium}>
        <Div borderWidth={1} rounded={'xl'} h={verticalScale(123)} p={customTheme.spacing.medium} style={{ gap: 8 }}>
          <Text fontSize={customTheme.fontSize.medium}>Cupo</Text>
          <Div flexDir='row' flex={1} justifyContent='center' alignItems='center' w={'100%'} >
            <TouchableOpacity onPress={DecreaseAmount}>
              <Div w={scale(119)} h={verticalScale(56)} justifyContent='center' bg={amount === LowLimit ? '#DDDED9' : '#151515'}><Text color={amount === LowLimit ? '#9A9B98' : 'white'} textAlign='center' fontSize={customTheme.fontSize.xl}>-</Text></Div>
            </TouchableOpacity>
            <Div w={scale(56)} h={verticalScale(56)} justifyContent='center'><Text fontSize={customTheme.fontSize.xl} textAlign='center'>{amount}</Text></Div>
            <TouchableOpacity onPress={IncreaseAmount}>
              <Div w={scale(119)} h={verticalScale(56)} justifyContent='center' bg={amount === HighLimit ? '#DDDED9' : '#151515'}><Text color={amount === HighLimit ? '#9A9B98' : 'white'} textAlign='center' fontSize={customTheme.fontSize.xl}>+</Text></Div>
            </TouchableOpacity>
          </Div>
        </Div>
      </Div>
    </Modal>
  );
};

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 18,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: 'black',
  },
});

export default MatchModalHandler;
