import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

const CircleDropdown = () => {
  const [visibleDropdownIndex, setVisibleDropdownIndex] = useState(null);
  const dropdownHeights = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  const dropdownWidths = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  const toggleDropdown = (index) => {
    if (visibleDropdownIndex === index) {
      // Close the currently visible dropdown
      Animated.parallel([
        Animated.timing(dropdownHeights[index], {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(dropdownWidths[index], {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => setVisibleDropdownIndex(null));
    } else {
      if (visibleDropdownIndex !== null) {
        // Close the currently visible dropdown, then open the new one
        Animated.parallel([
          Animated.timing(dropdownHeights[visibleDropdownIndex], {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(dropdownWidths[visibleDropdownIndex], {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start(() => {
          setVisibleDropdownIndex(index);
          Animated.parallel([
            Animated.timing(dropdownHeights[index], {
              toValue: 100, // Desired height
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(dropdownWidths[index], {
              toValue: 100, // Desired width
              duration: 300,
              useNativeDriver: false,
            }),
          ]).start();
        });
      } else {
        // If no dropdown is open, just open the new one
        setVisibleDropdownIndex(index);
        Animated.parallel([
          Animated.timing(dropdownHeights[index], {
            toValue: 100, // Desired height
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(dropdownWidths[index], {
            toValue: 100, // Desired width
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start();
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.circleRow}>
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <View key={index} style={styles.circleContainer}>
              <TouchableOpacity style={styles.circle} onPress={() => toggleDropdown(index)} />
              {visibleDropdownIndex === index && (
                <Animated.View
                  style={[
                    styles.dropdown,
                    {
                      height: dropdownHeights[index],
                      width: dropdownWidths[index],
                    },
                  ]}
                >
                  <Text style={styles.dropdownText}>Dropdown {index + 1} Content</Text>
                </Animated.View>
              )}
            </View>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  circleContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'blue',
  },
  dropdown: {
    position: 'absolute',
    bottom: 60, // Positioned above the circle
    left: '50%', // Center horizontally
    transform: [{ translateX: -50 }], // Adjust for width
    backgroundColor: 'lightgray',
    borderWidth: 1,
    borderColor: 'gray',
    overflow: 'hidden',
  },
  dropdownText: {
    padding: 10,
  },
});

export default CircleDropdown;
