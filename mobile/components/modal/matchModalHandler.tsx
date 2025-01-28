import React, { useEffect, useState } from 'react';
import { Button, Div, Overlay, Text, Input } from "react-native-magnus";
import SelectDropdown from 'react-native-select-dropdown';
import sportService from '../../service/sport.service';
import useFetch from '../../hooks/useGet';
import { QUERY_KEYS } from '../../types/query.types';
import sportmodeService from '../../service/sportmode.service';
import { StyleSheet } from 'react-native';

const MatchModalHandler = ({ id, open, setOpen }: { id?: number; open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  // States for selects
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedSportMode, setSelectedSportMode] = useState('');
  const [selectValue3, setSelectValue3] = useState(null);

  const fetchSportModesById = async () => {
    if(selectedSport){
      setSelectedSportMode('')
      const res = await sportmodeService.getById(selectedSport)
      return res
    } else {
      const res = await sportmodeService.getAll()
      return res
    }
  } 

  // Get info
  const { data: sports } = useFetch({ fn: sportService.getAll, key: [QUERY_KEYS.SPORTS] });
  const { data: sportModes } = useFetch({ fn: fetchSportModesById, key: [QUERY_KEYS.SPORT_MODES, selectedSport] });
  
  useEffect(() => {
    if(sports){
      setSelectedSport(sports.data[0]._id)
    }
    if(selectedSport && sportModes){
      setSelectedSportMode(sportModes.data[0]._id)
    }
  }, [sports ,selectedSport])
  
  if (!sports || !sportModes) return null;
  console.log(sportModes,"STALA")
  return (
    <Overlay visible={open} onBackdropPress={() => setOpen(false)} p="lg" rounded="lg">
      <Div>
        <Text fontSize="xl" mb="md" textAlign="center">
          {id ? 'Editar partido' : 'Crear partido'}
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
          <Text mb="sm">Input 1</Text>
          <Input placeholder="Enter value 1" mt="sm" rounded="lg" />
        </Div>

        <Div mb="lg">
          <Text mb="sm">Input 2</Text>
          <Input placeholder="Enter value 2" mt="sm" rounded="lg" />
        </Div>

        <Div mb="lg">
          <Text mb="sm">Input 3</Text>
          <Input placeholder="Enter value 3" mt="sm" rounded="lg" />
        </Div>

        {/* Buttons */}
        <Div row justifyContent="space-between" mt="lg">
          <Button bg="red600" color="white" onPress={() => setOpen(false)} rounded="lg">
            Cancel
          </Button>
          <Button bg="blue600" color="white" onPress={() => alert('Save action')} rounded="lg">
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
