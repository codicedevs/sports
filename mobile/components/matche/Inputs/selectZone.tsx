import React, { useState, useEffect } from 'react'
import { Div, Text } from 'react-native-magnus'
import { Profile, Zone } from '../../../types/form.type'
import useFetch from '../../../hooks/useGet'
import zonesService from '../../../service/zones.service'
import { QUERY_KEYS } from '../../../types/query.types'
import { TouchableOpacity } from 'react-native'
import { verticalScale } from 'react-native-size-matters'
import { customTheme } from '../../../utils/theme'

interface SportInputProps {
    matchDetailsRef: React.MutableRefObject<Profile>
}

const SelectZoneInput = ({ matchDetailsRef }: SportInputProps) => {
    const [selectedZone, setSelectedZone] = useState<Zone[]>([])

    const { data: zonas } = useFetch(zonesService.getZones, [QUERY_KEYS.ZONES])
    useEffect(() => {
        if (zonas && matchDetailsRef.current.preferredZones) {
            const updatedZone = (matchDetailsRef.current.preferredZones as (string | Zone)[]).map(item =>
                typeof item === 'string'
                    ? zonas.data.results.find((s: Zone) => s._id === item)
                    : item
            ).filter(Boolean) as Zone[];
            setSelectedZone(updatedZone);
            console.log(updatedZone)
            matchDetailsRef.current.preferredZones = updatedZone;
        }
    }, [zonas]);

    const toggleZoneSelection = (zone: Zone) => {
        setSelectedZone((prevSelected) => {
          let updated: Zone[];
          if (prevSelected.some((z) => z._id === zone._id)) {
            updated = prevSelected.filter((z) => z._id !== zone._id);
          } else {
            updated = [...prevSelected, zone];
          }
          matchDetailsRef.current.preferredZones = updated;
          return updated;
        });
      };
      
      const toggleSelectAll = () => {
        let newSelected: Zone[];
        if (selectedZone.length === zonas.data.results.length) {
          newSelected = [];
        } else {
          newSelected = zonas.data.results;
        }
        setSelectedZone(newSelected);
        matchDetailsRef.current.preferredZones = newSelected;
      };

    if (!zonas) return null
    return (
        <Div p={customTheme.spacing.medium}>
            <Text my={customTheme.spacing.medium}>Elegir zona</Text>
            <Div style={{ gap: 8 }}>
                <TouchableOpacity onPress={toggleSelectAll}>
                    <Div
                        h={verticalScale(48)}
                        bg={selectedZone.length === zonas.data.results.length ? 'black' : 'white'}
                        justifyContent="center"
                        borderWidth={1}
                    >
                        <Text
                            color={selectedZone.length === zonas.data.results.length ? 'white' : 'black'}
                            textAlign="center"
                        >
                            Todos
                        </Text>
                    </Div>
                </TouchableOpacity>
                {zonas.data.results.map((zona, index) => {
                    const isSelected = selectedZone.some(z => z._id === zona._id)
                    return (
                        <TouchableOpacity key={index} onPress={() => toggleZoneSelection(zona)}>
                            <Div
                                h={verticalScale(48)}
                                bg={isSelected ? 'black' : 'white'}
                                justifyContent="center"
                                borderWidth={1}
                            >
                                <Text
                                    color={isSelected ? 'white' : 'black'}
                                    textAlign="center"
                                >
                                    {zona.name}
                                </Text>
                            </Div>
                        </TouchableOpacity>
                    )
                })}
            </Div>
        </Div>
    )
}

export default SelectZoneInput
