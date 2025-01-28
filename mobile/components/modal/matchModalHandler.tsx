import React, { useState, useRef, useEffect } from 'react';
import { Button, Div, Overlay, Select, Text, Input } from "react-native-magnus";
import sportService from '../../service/sport.service';
import useFetch from '../../hooks/useGet';
import { QUERY_KEYS } from '../../types/query.types';
import sportmodeService from '../../service/sportmode.service';

const MatchModalHandler = ({ id, open, setOpen }: { id?: number; open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  // States for selects
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectValue2, setSelectValue2] = useState(null);
  const [selectValue3, setSelectValue3] = useState(null);

  // Refs for selects
  const selectRef1 = useRef(null);
  const selectRef2 = useRef(null);
  const selectRef3 = useRef(null);

  const bringSportModesById = async () => {

  }

  // Get info
  const { data: sports } = useFetch({ fn: sportService.getAll, key: [QUERY_KEYS.SPORTS] })
  const { data: sportModes } = useFetch({ fn: sportmodeService.getAll, key: [QUERY_KEYS.SPORT_MODES] })
  //convendria usar un servicio que pase el id del sport q selecciona actualmente y con eso q vaya cambiando el sportmode en el select

  if (!sports || !sportModes) return
  const futbol = sports.data.filter((item) => item.name = "Fútbol")
  console.log(sports.data, "como viene")
  return (
    <Overlay visible={open} onBackdropPress={() => setOpen(false)} p="lg" rounded="lg">
      <Div>
        <Text fontSize="xl" mb="md" textAlign="center">
          {id ? 'Editar partido' : 'Crear partido'}
        </Text>

        {/* Select 1 */}
        <Div mb="lg">
          <Text mb="sm">Select Option 1</Text>
          <Button
            bg="white"
            borderColor="gray300"
            borderWidth={1}
            onPress={() => selectRef1.current?.open()}
          >
            {selectedSport ? selectedSport : 'Choose an option'}
          </Button>
          <Select
            ref={selectRef1}
            value={selectedSport}
            onSelect={(value) => setSelectedSport(value)}
            title="Select Option 1"
            roundedTop="xl"
            data={sports.data.map((item) => ({
              label: item.name,
              value: item._id,
            }))}
            renderItem={(item) => (
              <Select.Option value={item.value} py="md" px="xl">
                {item.label}
              </Select.Option>
            )}
          />
        </Div>

        {/* Select 2 */}
        <Div mb="lg">
          <Text mb="sm">Select Option 2</Text>
          <Button
            bg="white"
            borderColor="gray300"
            borderWidth={1}
            onPress={() => selectRef2.current?.open()}
          >
            {selectValue2 ? selectValue2 : 'Choose an option'}
          </Button>
          <Select
            ref={selectRef2}
            value={selectValue2}
            onSelect={(value) => setSelectValue2(value)}
            title="Select Option 2"
            roundedTop="xl"
            data={sportModes.data.map((item) => ({
              label: item.name,
              value: item._id,
            }))}
            renderItem={(item) => (
              <Select.Option value={item.value} py="md" px="xl">
                {item.label}
              </Select.Option>
            )}
          />
        </Div>

        {/* Select 3 */}
        <Div mb="lg">
          <Text mb="sm">Select Option 3</Text>
          <Button
            bg="white"
            borderColor="gray300"
            borderWidth={1}
            onPress={() => selectRef3.current?.open()}
          >
            {selectValue3 ? selectValue3 : 'Choose an option'}
          </Button>
          <Select
            ref={selectRef3}
            value={selectValue3}
            onSelect={(value) => setSelectValue3(value)}
            title="Select Option 3"
            roundedTop="xl"
            data={[
              { label: 'Privado', value: 'private' },
              { label: 'Publico', value: 'public' },
            ]}
            renderItem={(item) => (
              <Select.Option value={item.value} py="md" px="xl">
                {item.label}
              </Select.Option>
            )}
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

export default MatchModalHandler;
