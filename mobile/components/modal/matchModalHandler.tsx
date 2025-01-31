import React, { useEffect, useState } from 'react';
import { Button, Div, Overlay, Text, Input } from "react-native-magnus";
import SelectDropdown from 'react-native-select-dropdown';
import sportService from '../../service/sport.service';
import useFetch from '../../hooks/useGet';
import { QUERY_KEYS } from '../../types/query.types';
import sportmodeService from '../../service/sportmode.service';
import { StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import locationService from '../../service/location.service';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import matchService from '../../service/match.service';
import { useSession } from '../../context/authProvider';

const mockHours = [
  "10:00",
  "10:30",
  "11:00",
  "11:30"
]

const MatchModalHandler = ({ goToMatchDetail, open, setOpen }: { goToMatchDetail: (id: string) => void; open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  // States for selects
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedSportMode, setSelectedSportMode] = useState('');
  const [selectValue3, setSelectValue3] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('')
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(new Date())
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)

  const { currentUser } = useSession()

  const fetchSportModesById = async () => {
    if (selectedSport) {
      setSelectedSportMode('')
      const res = await sportmodeService.getModesBySportId(selectedSport)
      console.log('POR ID')
      return res
    } else {
      const res = await sportmodeService.getAll()
      console.log("TODO")
      return res
    }
  }

  const onChangeDate = (event, selectedDate) => {
    setShowCalendar(false); // Siempre cerramos el picker

    if (event.type === "set" && selectedDate) {
      setDate(selectedDate); // Solo actualizamos si el usuario seleccionó una fecha
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false); // Cierra el picker

    if (event.type === "set" && selectedTime) {
      setTime(selectedTime); // Actualiza la hora si se selecciona
    }
  };

  // Get info
  const { data: sports } = useFetch({ fn: sportService.getAll, key: [QUERY_KEYS.SPORTS] });
  const { data: sportModes, isFetching } = useFetch({ fn: fetchSportModesById, key: [QUERY_KEYS.SPORT_MODES, selectedSport] });
  const { data: locations } = useFetch({ fn: locationService.getAll, key: [QUERY_KEYS.LOCATIONS] })

  useEffect(() => {
    if (sports) {
      setSelectedSport(sports.data[0]._id)
    }
  }, [sports])

  useEffect(() => {
    if (selectedSport && sportModes) {
      setSelectedSportMode(sportModes.data[0]._id)
    }
  }, [sportModes])

  const createMatch = async () => {
    try {
      const res = await matchService.create({
        name: "BORRAR-3",
        date: date,
        // location: selectedLocation,
        playersLimit: 10,
        userId: "6720ef183a78ebc10564e97b",
        sportMode: selectedSportMode
        //estoy trayendo mal el current user, tengo q guardar bien la informacion del usuario.
      })
      goToMatchDetail(res.data._id)
    } catch (e) {

    }
  }

  if (!sports || !sportModes) return null;
  return (
    <Overlay visible={open} onBackdropPress={() => setOpen(false)} p="lg" rounded="lg">
      <Div>
        <Text fontSize="xl" mb="md" textAlign="center">
          {'Crear partido'}
        </Text>

        {/* Select 1 */}
        <Div mb="lg">
          <Text mb="sm">Select Option 1</Text>
          <SelectDropdown
            data={sports.data.map((item) => item.name)}
            onSelect={(selectedItem, index) => {
              setSelectedSport(sports.data[index]._id);
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
        </Div>

        {/* Select 2 */}
        {
          isFetching ?
            <Text>Cargando</Text>
            :
            <Div mb="lg">
              <Text mb="sm">Select Option 2</Text>
              <SelectDropdown
                data={sportModes.data.map((item) => item.name)}
                onSelect={(selectedItem, index) => {
                  setSelectedSportMode(sportModes.data[index]._id);
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
            </Div>
        }


        {/* Select 3 */}
        <Div mb="lg">
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
        </Div>

        {/* Inputs */}
        <Div mb="lg">
          <Text mb="sm">Select Location</Text>
          <SelectDropdown
            data={locations.data.map((item) => item.name)}
            onSelect={(selectedItem, index) => {
              setSelectedLocation(locations.data[index]._id);
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

        <Div mb="lg">
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
        {/* Buttons */}
        <Div row justifyContent="space-between" mt="lg">
          <Button bg="red600" color="white" onPress={() => setOpen(false)} rounded="lg">
            Cancel
          </Button>
          <Button bg="blue600" color="white" onPress={createMatch} rounded="lg">
            Save
          </Button>
        </Div>
      </Div>
    </Overlay>
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
