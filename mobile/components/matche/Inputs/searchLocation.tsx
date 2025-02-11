import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Div, Text } from 'react-native-magnus';
import { verticalScale } from 'react-native-size-matters';
import { customTheme } from '../../../utils/theme';
import SearchBar from '../Form/searchBar';

const SearchLocationInput = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [filter, setFilter] = useState('')
    const [selectedLocation, setSelectedLocation] = useState('')
    const [filteredLocations, setFilteredLocations] = useState<{ id: string; name: string; }[]>([])

    const Locations = [
        { id: '1', name: 'Adiur' },
        { id: '2', name: 'Juan 23' },
        { id: '3', name: 'El cruce' },
        { id: '4', name: 'Loyal' },
        { id: '5', name: 'EL DIEGO' }
    ];

    useEffect(() => {
        if (filter.trim() === '') {
            setFilteredLocations([]); // Si no hay filtro, lista vacía
        } else {
            setFilteredLocations(
                Locations.filter(loc =>
                    loc.name.toLowerCase().includes(filter.toLowerCase())
                )
            );
        }
    }, [filter]);



    return (
        <Div overflow='scroll' px={customTheme.spacing.medium} pt={customTheme.spacing.medium}>
            <Text mb={customTheme.spacing.medium}>¿Dónde juegan?</Text>
            <SearchBar isEditing={isEditing} setIsEditing={setIsEditing} setFilter={setFilter} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Div mt={customTheme.spacing.medium} style={{ gap: 8 }}>
                    {
                        (filteredLocations.length > 0 ? filteredLocations : Locations).map((location, index) => (
                            <TouchableOpacity onPress={(() => setSelectedLocation(location.id))}>
                                <Div
                                    h={verticalScale(48)}
                                    mb={Locations.length - 1 === index ? customTheme.spacing.medium : 0}
                                    bg={selectedLocation === location.id ? customTheme.colors.secondaryBackground : "white"}
                                    justifyContent='center'
                                    borderWidth={1}>
                                    <Text textAlign='center' color={selectedLocation === location.id ? 'white' : customTheme.colors.secondaryBackground}>{location.name}</Text>
                                </Div>
                            </TouchableOpacity>
                        ))
                    }
                </Div>
            </ScrollView>
        </Div>
    );
};

export default SearchLocationInput;
