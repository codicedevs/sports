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
        matchDetailsRef.current.preferredZones = selectedZone;
    }, [selectedZone, matchDetailsRef]);

    const toggleZoneSelection = (zone: Zone) => {
        const isSelected = selectedZone.some(z => z._id === zone._id)
        if (isSelected) {
            setSelectedZone(selectedZone.filter(z => z._id !== zone._id))
        } else {
            setSelectedZone([...selectedZone, zone])
        }
    }

    const toggleSelectAll = () => {
        if (selectedZone.length === zonas.data.results.length) {
            setSelectedZone([]);
        } else {
            setSelectedZone(zonas.data.results);
        }
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
