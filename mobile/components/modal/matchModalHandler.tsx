import React, { useEffect, useState } from 'react';
import { Button, Div, Overlay, Text, Input, Modal } from "react-native-magnus";
import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import matchService from '../../service/match.service';
import { useSession } from '../../context/authProvider';
import { AppScreens } from '../../navigation/screens';
import { navigate } from '../../utils/navigation';
import Match from '../../types/match.type';
import { customTheme } from '../../utils/theme';
import { scale, verticalScale } from 'react-native-size-matters';
import { MotiView } from 'moti';

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
  const [openSecond, setOpenSecond] = useState(false)

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
          <MotiView
            from={{ height: verticalScale(50), borderWidth: 1 }}
            animate={{ height: openSecond ? verticalScale(123) : verticalScale(35), borderWidth: 1 }}
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
              {!openSecond &&
                <TouchableWithoutFeedback onPress={() => setOpenSecond(true)}>
                  <Div py={customTheme.spacing.small} h={verticalScale(35)} w={"100%"}>
                    <Text>Cupos</Text>
                  </Div>
                </TouchableWithoutFeedback>
              }
              {
                openSecond &&
                <Div
                  p={customTheme.spacing.medium}
                  style={{ gap: 16 }}
                  flex={1}
                >
                  <Text fontSize={customTheme.fontSize.medium} px={customTheme.spacing.medium}>Cupo</Text>
                  <Div style={{gap:8}} flexDir='row' bg='red' flex={1} alignItems='center' >
                    <Div w={scale(119)} h={verticalScale(56)} justifyContent='center' bg='green'><Text textAlign='center' fontSize={customTheme.fontSize.xl}>-</Text></Div>
                    <Div w={scale(56)} h={verticalScale(56)} justifyContent='center'><Text fontSize={customTheme.fontSize.xl} textAlign='center'>10</Text></Div>
                    <Div w={scale(119)} h={verticalScale(56)} justifyContent='center' bg='green'><Text textAlign='center' fontSize={customTheme.fontSize.xl}>+</Text></Div>

                  </Div>
                </Div>
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
