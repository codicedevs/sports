import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Dimensions } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const initialCircles = [
  { id: 1, name: 'Circle A', position: { x: 50, y: 50 } },
  { id: 2, name: 'Circle B', position: { x: 150, y: 150 } },
  { id: 3, name: 'Circle C', position: { x: 250, y: 250 } },
];

export default function SoccerField() {
  const [circles, setCircles] = useState(initialCircles);
  const positions = useRef(
    initialCircles.map((circle) => new Animated.ValueXY(circle.position))
  ).current;

  const handleGestureEnd = (gestureState, id, index) => {
    const { x, y } = gestureState;

    const draggedCircle = circles.find((circle) => circle.id === id);
    const overlappingCircle = circles.find(
      (circle) =>
        circle.id !== id &&
        Math.abs(circle.position.x - x) < 50 &&
        Math.abs(circle.position.y - y) < 50
    );

    if (overlappingCircle) {
      // Swap positions in the state
      const updatedCircles = circles.map((circle) =>
        circle.id === id
          ? { ...circle, position: overlappingCircle.position }
          : circle.id === overlappingCircle.id
          ? { ...circle, position: draggedCircle.position }
          : circle
      );

      setCircles(updatedCircles);

      // Update Animated.ValueXY positions for both swapped circles
      const draggedIndex = circles.findIndex((circle) => circle.id === id);
      const overlappingIndex = circles.findIndex(
        (circle) => circle.id === overlappingCircle.id
      );

      Animated.timing(positions[draggedIndex], {
        toValue: overlappingCircle.position,
        duration: 150,
        useNativeDriver: false,
      }).start();

      Animated.timing(positions[overlappingIndex], {
        toValue: draggedCircle.position,
        duration: 150,
        useNativeDriver: false,
      }).start();
    } else {
      // Reset dragged circle to its original position
      Animated.timing(positions[index], {
        toValue: draggedCircle.position,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      {circles.map((circle, index) => (
        <PanGestureHandler
          key={circle.id}
          onGestureEvent={Animated.event(
            [
              {
                nativeEvent: {
                  translationX: positions[index].x,
                  translationY: positions[index].y,
                },
              },
            ],
            { useNativeDriver: false }
          )}
          onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.END) {
              const { translationX, translationY } = nativeEvent;
              const newX = circle.position.x + translationX;
              const newY = circle.position.y + translationY;

              handleGestureEnd({ x: newX, y: newY }, circle.id, index);
            }
          }}
        >
          <Animated.View
            style={[
              styles.circle,
              {
                transform: [
                  { translateX: positions[index].x },
                  { translateY: positions[index].y },
                ],
                left: 0, // Set to 0 since Animated handles the position
                top: 0,
              },
            ]}
          >
            <Text style={styles.circleText}>{circle.name}</Text>
          </Animated.View>
        </PanGestureHandler>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  circle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'skyblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
