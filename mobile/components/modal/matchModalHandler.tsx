import React, { useEffect, useState } from 'react';
import { Button, Div, Overlay, Text, Input, Modal } from "react-native-magnus";
import SelectDropdown from 'react-native-select-dropdown';
import sportService from '../../service/sport.service';
import useFetch from '../../hooks/useGet';
import { QUERY_KEYS } from '../../types/query.types';
import sportmodeService from '../../service/sportmode.service';
import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
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
import { interpolateColor } from 'react-native-reanimated';

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
  const { data: sports } = useFetch(sportService.getAll, [QUERY_KEYS.SPORTS]);
  const { data: sportModes, isFetching } = useFetch(sportmodeService.getAll, [QUERY_KEYS.SPORT_MODES]);
  const { data: locations } = useFetch(locationService.getAll, [QUERY_KEYS.LOCATIONS])

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

  if (!sports || !sportModes) return null;
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
                                borderRadius: 'lg',
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
                                duration: 300, // Duración de la animación
                              }}
                            >
                              <MotiText
                                style={{
                                  textAlign: 'center',
                                  fontSize: customTheme.fontSize.medium,
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
                                  duration: 300, // Duración de la animación
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
                    <Div w={'100%'} h={1} borderBottomWidth={1} />
                  </Div>

                  <Div py={customTheme.spacing.medium} style={{ gap: 16 }}>
                    <Text fontSize={customTheme.fontSize.medium} px={customTheme.spacing.medium}>¿Que modalidad?</Text>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ gap: 16 }}>
                      {
                        mockSportMode.map((sport, index) => (
                          <TouchableWithoutFeedback onPress={() => setSelectedSportMode(sport._id)}>
                            <MotiView
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
                            </MotiView>
                            {/* <Div
                            w={scale(88)}
                            h={scale(88)}
                            borderWidth={1}
                            rounded={56}
                            justifyContent='center'
                            ml={index === 0 ? 16 : 0}
                            mr={index === mockSportMode.length - 1 ? 16 : 0}
                            bg={selectedSportMode === sport._id? "black" : "white"}
                          >
                            <Text color={selectedSportMode === sport._id? "white" : "black"} textAlign='center' lineHeight={verticalScale(88)} fontSize={customTheme.fontSize.xl}>{sport.name}</Text>
                          </Div> */}
                          </TouchableWithoutFeedback>
                        ))
                      }
                    </ScrollView>
                  </Div>
                </>
              }
            </Div>
          </MotiView>
          {/* </TouchableWithoutFeedback> */}
          {/* <Div borderWidth={1} h={verticalScale(342)} p={customTheme.spacing.small} rounded={"lg"} alignItems='center'>
            <Text fontSize={customTheme.fontSize.small}>Deporte</Text>
          </Div> */}
          {
            //PREVIO INPUT
            // !match &&
            // <>
            //   {/* Select 1 */}
            //   <Div mb="lg">
            //     <Text mb="sm">Select Option 1</Text>
            //     <SelectDropdown
            //       data={sports.data.map((item) => item.name)}
            //       onSelect={(selectedItem, index) => {
            //         setSelectedSport(sports.data[index]._id);
            //       }}
            //       defaultValueByIndex={0}
            //       defaultButtonText="Choose an option"
            //       buttonTextAfterSelection={(selectedItem, index) => selectedItem}
            //       rowTextForSelection={(item, index) => item}
            //       buttonStyle={styles.dropdownButtonStyle}
            //       buttonTextStyle={styles.dropdownButtonTxtStyle}
            //       dropdownStyle={styles.dropdownMenuStyle}
            //       rowTextStyle={styles.dropdownItemTxtStyle}
            //       renderDropdownIcon={isOpened => (
            //         <Text style={styles.dropdownButtonArrowStyle}>
            //           {isOpened ? '▲' : '▼'}
            //         </Text>
            //       )}
            //       renderItem={(item, index, isSelected) => {
            //         return (
            //           <Div style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>

            //             <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
            //           </Div>
            //         );
            //       }}
            //       renderButton={(selectedItem, isOpened) => {
            //         return (
            //           <Div style={styles.dropdownButtonStyle}>
            //             <Text style={styles.dropdownButtonTxtStyle}>
            //               {selectedItem ? selectedItem : 'Choose an option'}
            //             </Text>
            //             <Text style={styles.dropdownButtonArrowStyle}>
            //               {isOpened ? '▲' : '▼'}
            //             </Text>
            //           </Div>
            //         );
            //       }}
            //     />
            //   </Div>
            // </>
          }
          {/* Select 2 */}
          {
            // isFetching ?
            //   <Text>Cargando</Text>
            //   :
            //   <Div mb="lg">
            //     <Text mb="sm">Select Option 2</Text>
            //     <SelectDropdown
            //       data={sportModes.data.map((item) => item.name)}
            //       onSelect={(selectedItem, index) => {
            //         setSelectedSportMode(sportModes.data[index]._id);
            //       }}
            //       defaultValueByIndex={match ? sportModes.data.findIndex(modes => modes._id === selectedSportMode) : 0}
            //       defaultButtonText="Choose an option"
            //       buttonTextAfterSelection={(selectedItem, index) => selectedItem}
            //       rowTextForSelection={(item, index) => item}
            //       buttonStyle={styles.dropdownButtonStyle}
            //       buttonTextStyle={styles.dropdownButtonTxtStyle}
            //       dropdownStyle={styles.dropdownMenuStyle}
            //       rowTextStyle={styles.dropdownItemTxtStyle}
            //       renderDropdownIcon={isOpened => (
            //         <Text style={styles.dropdownButtonArrowStyle}>
            //           {isOpened ? '▲' : '▼'}
            //         </Text>
            //       )}
            //       renderItem={(item, index, isSelected) => {
            //         return (
            //           <Div style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>

            //             <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
            //           </Div>
            //         );
            //       }}
            //       renderButton={(selectedItem, isOpened) => {
            //         return (
            //           <Div style={styles.dropdownButtonStyle}>
            //             <Text style={styles.dropdownButtonTxtStyle}>
            //               {selectedItem ? selectedItem : 'Choose an option'}
            //             </Text>
            //             <Text style={styles.dropdownButtonArrowStyle}>
            //               {isOpened ? '▲' : '▼'}
            //             </Text>
            //           </Div>
            //         );
            //       }}
            //     />
            //   </Div>
          }


          {/* Select 3 */}
          {/* <Div mb="lg">
            <Text mb="sm">Select Option 3</Text>
            <SelectDropdown
              data={['Privado', 'Publico']}
              onSelect={(selectedItem, index) => {
                setSelectValue3(selectedItem === 'Privado' ? 'private' : 'public');
              }}
              defaultValueByIndex={0}
              defaultButtonText="Choose an option"
              buttonTextAfterSelection={(selectedItem, index) => selectedItem}
              rowTextForSelection={(item, index) => item}
              buttonStyle={styles.dropdownButtonStyle}
              buttonTextStyle={styles.dropdownButtonTxtStyle}
              dropdownStyle={styles.dropdownMenuStyle}
              rowTextStyle={styles.dropdownItemTxtStyle}
              renderDropdownIcon={isOpened => (
                <Text style={styles.dropdownButtonArrowStyle}>
                  {isOpened ? '▲' : '▼'}
                </Text>
              )}
              renderItem={(item, index, isSelected) => {
                return (
                  <Div style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>

                    <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                  </Div>
                );
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <Div style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {selectedItem ? selectedItem : 'Choose an option'}
                    </Text>
                    <Text style={styles.dropdownButtonArrowStyle}>
                      {isOpened ? '▲' : '▼'}
                    </Text>
                  </Div>
                );
              }}
            />
          </Div> */}

          {/* Inputs */}
          {/* <Div mb="lg">
            <Text mb="sm">Select Location</Text>
            <SelectDropdown
              data={locations.data.map((item) => item.name)}
              onSelect={(selectedItem, index) => {
                setSelectedLocation(locations.data[index]._id);
              }}
              defaultValueByIndex={match ? locations.data.findIndex(location => location._id === selectedLocation) : null}
              defaultButtonText="Choose an option"
              buttonTextAfterSelection={(selectedItem, index) => selectedItem}
              rowTextForSelection={(item, index) => item}
              buttonStyle={styles.dropdownButtonStyle}
              buttonTextStyle={styles.dropdownButtonTxtStyle}
              dropdownStyle={styles.dropdownMenuStyle}
              rowTextStyle={styles.dropdownItemTxtStyle}
              renderDropdownIcon={isOpened => (
                <Text style={styles.dropdownButtonArrowStyle}>
                  {isOpened ? '▲' : '▼'}
                </Text>
              )}
              renderItem={(item, index, isSelected) => {
                return (
                  <Div style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>

                    <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                  </Div>
                );
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <Div style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {selectedItem ? selectedItem : 'Choose an option'}
                    </Text>
                    <Text style={styles.dropdownButtonArrowStyle}>
                      {isOpened ? '▲' : '▼'}
                    </Text>
                  </Div>
                );
              }}
            />
          </Div> */}

          {/* <Div mb="lg">
            <Text mb="sm">Fecha</Text>
            <Button onPress={() => setShowCalendar(true)}>Seleccionar Fecha</Button>
            {showCalendar &&
              <DateTimePicker
                value={date}
                mode="date" // Puedes cambiar a "time" o "datetime"
                display="default" // "default", "spinner", "calendar", "clock"
                onTouchCancel={() => setShowCalendar(false)}
                onChange={onChangeDate}
              />
            }
          </Div>

          <Div mb="lg">
            <Text mb="sm">Select hour</Text>
            <SelectDropdown
              data={mockHours}
              onSelect={(selectedItem, index) => {
                setTime(mockHours[index]);
              }}
              defaultButtonText="Choose an option"
              buttonTextAfterSelection={(selectedItem, index) => selectedItem}
              rowTextForSelection={(item, index) => item}
              buttonStyle={styles.dropdownButtonStyle}
              buttonTextStyle={styles.dropdownButtonTxtStyle}
              dropdownStyle={styles.dropdownMenuStyle}
              rowTextStyle={styles.dropdownItemTxtStyle}
              renderDropdownIcon={isOpened => (
                <Text style={styles.dropdownButtonArrowStyle}>
                  {isOpened ? '▲' : '▼'}
                </Text>
              )}
              renderItem={(item, index, isSelected) => {
                return (
                  <Div style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>

                    <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                  </Div>
                );
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <Div style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {selectedItem ? selectedItem : 'Choose an option'}
                    </Text>
                    <Text style={styles.dropdownButtonArrowStyle}>
                      {isOpened ? '▲' : '▼'}
                    </Text>
                  </Div>
                );
              }}
            />
          </Div>
         
          <Div row justifyContent="space-between" mt="lg">
            <Button bg="red600" color="white" onPress={() => setOpen(false)} rounded="lg">
              Cancel
            </Button>
            <Button bg="blue600" color="white" onPress={match ? editMatch : createMatch} rounded="lg">
              Save
            </Button>
          </Div> */}
        </ScrollView>
      </Div>
      {/* </Overlay> */}
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
