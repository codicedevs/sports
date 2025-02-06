import React, { useEffect, useState } from 'react';
import { Button, Div, Overlay, Text, Input, Modal } from "react-native-magnus";
import SelectDropdown from 'react-native-select-dropdown';
import sportService from '../../service/sport.service';
import useFetch from '../../hooks/useGet';
import { QUERY_KEYS } from '../../types/query.types';
import sportmodeService from '../../service/sportmode.service';
import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import locationService from '../../service/location.service';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import matchService from '../../service/match.service';
import { useSession } from '../../context/authProvider';
import { AppScreens } from '../../navigation/screens';
import { navigate } from '../../utils/navigation';
import Match from '../../types/match.type';
import { customTheme } from '../../utils/theme';
import { scale, verticalScale } from 'react-native-size-matters';
import { MotiText, MotiView } from 'moti';
import Animated, { interpolateColor, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

const mockHours = [
  "10:00",
  "10:30",
  "11:00",
  "11:30"
]

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
  const [openFirst, setOpenFirst] = useState(false)

  // const fetchSportModesById = async () => {
  //   if (selectedSport) {
  //     if (!match) setSelectedSportMode('')
  //     const res = await sportmodeService.getModesBySportId(selectedSport)
  //     console.log('POR ID')
  //     return res
  //   } else {
  //     const res = await sportmodeService.getAll()
  //     console.log("TODO")
  //     return res
  //   }
  // }

  // const onChangeDate = (event, selectedDate) => {
  //   setShowCalendar(false);

  //   if (event.type === "set" && selectedDate) {
  //     setDate(selectedDate);
  //   }
  // };

  // const onChangeTime = (event, selectedTime) => {
  //   setShowTimePicker(false);

  //   if (event.type === "set" && selectedTime) {
  //     setTime(selectedTime);
  //   }
  // };

  // Get info
  // const { data: sports } = useFetch(sportService.getAll, [QUERY_KEYS.SPORTS]);
  // const { data: sportModes, isFetching } = useFetch(sportmodeService.getAll, [QUERY_KEYS.SPORT_MODES]);
  // const { data: locations } = useFetch(locationService.getAll, [QUERY_KEYS.LOCATIONS])

  // useEffect(() => {
  //   if (match) return
  //   if (sports) {
  //     setSelectedSport(sports.data[0]._id)
  //   }
  // }, [sports])

  // useEffect(() => {
  //   if (match) {
  //     setSelectedSportMode(match.sportMode)
  //     return
  //   }
  //   if (selectedSport && sportModes) {
  //     setSelectedSportMode(sportModes.data[0]._id)
  //   }
  // }, [sportModes])

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
        <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>

          {/* TITULO */}
          {/* <Div flexDir='row' mt={customTheme.spacing.large} mb={customTheme.spacing.medium}>
            <Button>X</Button>
            <Text fontSize="md" mb="md" color='black'>
              {match ? 'Editar partido' : 'Organizar partido'}
            </Text>
          </Div> */}

          <MotiView
            from={{ height: verticalScale(50), borderWidth: 1 }}
            animate={{ height: openFirst ? verticalScale(342) : verticalScale(35), borderWidth: 1 }}
            transition={{ type: "spring", damping: 15 }}
            style={{
              borderColor: "#000",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Div
              flex={1}
              w={"100%"}
            >
              {/* TITULO */}
              {!openFirst &&
                <TouchableWithoutFeedback onPress={() => setOpenFirst(true)}>
                  <Div py={customTheme.spacing.small} h={verticalScale(35)} w={"100%"}>
                    <Text>Deporte</Text>
                  </Div>
                </TouchableWithoutFeedback>
              }
              {
                openFirst &&
                <>
                  <Div
                    py={customTheme.spacing.medium}
                    style={{ gap: 16 }}>
                    <Text fontSize={customTheme.fontSize.medium} px={customTheme.spacing.medium}>¿Que deporte juegan?</Text>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ gap: 16 }}>
                      {
                        mockSport.map((sport, index) => (
                          <TouchableWithoutFeedback onPress={() => setSelectedSport(sport._id)}>
                            <MotiView
                              key={index}
                              style={{
                                width: scale(112),
                                height: verticalScale(112),
                                borderWidth: 1,
                                borderRadius: 8,
                                justifyContent: 'center',
                                marginLeft: index === 0 ? 16 : 0,
                                marginRight: index === mockSport.length - 1 ? 16 : 0,
                              }}
                              animate={{
                                backgroundColor: interpolateColor(
                                  selectedSport === sport._id ? 1 : 0, // Controlamos la interpolación entre 1 (seleccionado) y 0 (no seleccionado)
                                  [0, 1], // Rango de la animación
                                  ['white', 'black'] // Colores entre los que se interpolará el fondo
                                ),
                              }}
                              transition={{
                                type: 'timing',
                                duration: 100, // Duración de la animación
                              }}
                            >
                              <MotiText
                                style={{
                                  textAlign: 'center',
                                  fontSize: customTheme.fontSize.medium,
                                  fontFamily: "NotoSans-BoldItalic"
                                }}
                                animate={{
                                  color: interpolateColor(
                                    selectedSport === sport._id ? 1 : 0, // Mismo control para el texto
                                    [0, 1], // Rango de la animación
                                    ['black', 'white'] // Colores entre los que se interpolará el texto
                                  ),
                                }}
                                transition={{
                                  type: 'timing',
                                  duration: 100, // Duración de la animación
                                }}
                              >
                                {sport.name}
                              </MotiText>
                            </MotiView>
                          </TouchableWithoutFeedback>
                        ))
                      }
                    </ScrollView>
                  </Div>

                  <Div px={customTheme.spacing.medium}>
                    <View style={{ width: '100%', borderBottomWidth: 1, borderStyle: "dotted" }} />
                  </Div>

                  <Div py={customTheme.spacing.medium} style={{ gap: 16 }}>
                    <Text fontSize={customTheme.fontSize.medium} px={customTheme.spacing.medium}>¿Que modalidad?</Text>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ gap: 16 }}>
                      {
                        mockSportMode.map((sport, index) => (
                          <TouchableWithoutFeedback key={sport._id} onPress={() => setSelectedSportMode(sport._id)}>
                            {/* <MotiView
                              style={{
                                width: scale(88),
                                height: scale(88),
                                borderWidth: 1,
                                borderRadius: 56,
                                justifyContent: 'center',
                                marginLeft: index === 0 ? 16 : 0,
                                marginRight: index === mockSportMode.length - 1 ? 16 : 0,
                              }}
                              animate={{
                                backgroundColor: selectedSportMode === sport._id ? 'black' : 'white',
                              }}
                              transition={{
                                type: 'timing',
                                duration: 300,
                              }}
                            >
                              <MotiText
                                style={{
                                  textAlign: 'center',
                                  lineHeight: verticalScale(88),
                                  fontSize: customTheme.fontSize.xl,
                                  fontFamily: "NotoSans-BoldItalic"
                                }}
                                animate={{
                                  color: interpolateColor(
                                    selectedSportMode === sport._id ? 1 : 0, // Esto controla la interpolación
                                    [0, 1], // El rango de la animación
                                    ['black', 'white'] // Los colores entre los que interpolará
                                  ),
                                }}
                                transition={{
                                  type: 'timing',
                                  duration: 300,
                                }}
                              >
                                {sport.name}
                              </MotiText>
                            </MotiView> */}
                            <View style={{
                              width:scale(88),
                              height:scale(88),
                              borderWidth:1,
                              borderRadius:56,
                              justifyContent:'center',
                              backgroundColor:selectedSportMode === sport._id? "black" : "white"
                            }}>
                              <Text color='red'>hola</Text>
                            </View>
                           
                          </TouchableWithoutFeedback>
                        ))
                      }
                    </ScrollView>
                  </Div>
                </>
              }
            </Div>
          </MotiView>
        
        </ScrollView>
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
