import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Div, Text } from 'react-native-magnus';
import { verticalScale } from 'react-native-size-matters';
import { customTheme } from '../../../utils/theme';
import SearchBar from '../Form/searchBar';
import useFetch from '../../../hooks/useGet';
import locationService from '../../../service/location.service';
import { QUERY_KEYS } from '../../../types/query.types';
import { Place } from '../../../types/form.type';

interface SearchLocationInputProps {
  matchDetailsRef: React.MutableRefObject<{
    location: Place | null;
  }>;
}

const SearchLocationInput = ({ matchDetailsRef }: SearchLocationInputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<{ id: string; name: string }[]>([]);
  
  const [selectedLocation, setSelectedLocation] = useState<Place | null>(
    matchDetailsRef.current.location
  );
  
  const { data: Locations } = useFetch(locationService.getAll, [QUERY_KEYS.LOCATIONS]);

  useEffect(() => {
    if (filter.trim() === '') {
      setFilteredLocations([]);
    } else if (Locations) {
      setFilteredLocations(
        Locations.data.filter((loc: Place) =>
          loc.name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
  }, [filter, Locations]);

  if (!Locations) return null;

  const handleSelectLocation = (location: Place) => {
    setSelectedLocation(location);
    matchDetailsRef.current.location = location;
  };

  return (
    <Div px={customTheme.spacing.medium} pt={customTheme.spacing.medium}>
      <Text mb={customTheme.spacing.medium}>¿Dónde juegan?</Text>
      <SearchBar isEditing={isEditing} setIsEditing={setIsEditing} setFilter={setFilter} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Div mt={customTheme.spacing.medium} style={{ gap: 8 }}>
          { (filteredLocations.length > 0 ? filteredLocations : Locations.data).map((loc: Place, index: number) => (
            <TouchableOpacity key={index} onPress={() => handleSelectLocation(loc)}>
              <Div
                h={verticalScale(48)}
                mb={Locations.data.length - 1 === index ? customTheme.spacing.medium : 0}
                bg={selectedLocation?._id === loc._id ? customTheme.colors.secondaryBackground : "white"}
                justifyContent="center"
                borderWidth={1}
              >
                <Text
                  textAlign="center"
                  color={selectedLocation?._id === loc._id ? 'white' : customTheme.colors.secondaryBackground}
                >
                  {loc.name}
                </Text>
              </Div>
            </TouchableOpacity>
          )) }
        </Div>
      </ScrollView>
    </Div>
  );
};

export default SearchLocationInput;
