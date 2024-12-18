import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, LayoutChangeEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

interface CircleData {
  id: number;
  color: string;
}

interface Position {
  x: number;
  y: number;
}

const DraggableCircle: React.FC<{
  id: number;
  color: string;
  onDrop: (id: number, x: number, y: number) => void;
  onLayout: (id: number, event: LayoutChangeEvent) => void;
}> = ({ id, color, onDrop, onLayout }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGestureStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx: { startX: number; startY: number }) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      runOnJS(onDrop)(id, translateX.value, translateY.value);
    },
  });

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View
        style={[styles.circle, { backgroundColor: color }, panGestureStyle]}
        onLayout={(event) => onLayout(id, event)}
      >
        <Text style={styles.circleText}>{id}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const MoreCircles: React.FC = () => {
  const [circlesData, setCirclesData] = useState<CircleData[]>([
    { id: 1, color: "red" },
    { id: 2, color: "blue" },
    { id: 3, color: "green" },
    { id: 4, color: "yellow" },
    { id: 5, color: "gray" },
    { id: 6, color: "red" },
    { id: 7, color: "blue" },
    { id: 8, color: "green" },
    { id: 9, color: "yellow" },
    { id: 10, color: "gray" },
  ]);

  const circlePositions = useRef<{ [key: number]: Position }>({});
  const [renderKey, setRenderKey] = useState(0);

  const calculateDistance = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const findNearestCircle = (droppedId: number, x: number, y: number) => {
    let nearestCircle: CircleData | null = null;
    let minDistance = Infinity;
  
    console.log(`\n=== findNearestCircle ===`);
    console.log(`Dropped Circle ID: ${droppedId}, Position: x=${x}, y=${y}`);
    console.log("Current Circle Positions:", circlePositions.current);
  
    Object.entries(circlePositions.current).forEach(([id, position]) => {
      console.log(`\nChecking Circle ID: ${id}`);
  
      if (parseInt(id) !== droppedId) {
        console.log(`Position of Circle ${id}: x=${position.x}, y=${position.y}`);
        const distance = calculateDistance(x, y, position.x, position.y);
        console.log(`Distance to Circle ${id}: ${distance}`);
  
        if (distance < minDistance) {
          console.log(
            `Circle ${id} is closer. Updating nearestCircle (Previous minDistance: ${minDistance})`
          );
          minDistance = distance;
          nearestCircle =
            circlesData.find((circle) => circle.id === parseInt(id)) || null;
        }
      } else {
        console.log(`Skipping Circle ${id} (same as dropped circle).`);
      }
    });
  
    console.log(
      `\nNearest Circle Found: ${
        nearestCircle ? `ID=${nearestCircle.id}, Color=${nearestCircle.color}` : "None"
      }`
    );
    console.log(`Final minDistance: ${minDistance}`);
  
    return nearestCircle;
  };

  const handleDrop = (id: number, x: number, y: number) => {
    const initialPosition = circlePositions.current[id];
    const newX = initialPosition.x + x;
    const newY = initialPosition.y + y;

    const nearestCircle = findNearestCircle(id, newX, newY);
    if (nearestCircle) {
      console.log(
        `Dropped circle ${id} - Nearest circle: ${JSON.stringify(
          nearestCircle
        )}`
      );

      const circleIndex = circlesData.findIndex((circle) => circle.id === id);
      const nearestCircleIndex = circlesData.findIndex(
        (circle) => circle.id === nearestCircle?.id
      );
      const circles = [...circlesData];
      circles[nearestCircleIndex] = circlesData[circleIndex];
      circles[circleIndex] = nearestCircle;
      setCirclesData(circles);
    }

    // Update the position of the dropped circle
    circlePositions.current[id] = { x: newX, y: newY };
    setRenderKey((prev) => prev + 1);
  };

  const handleLayout = (id: number, event: LayoutChangeEvent) => {
    const { x, y } = event.nativeEvent.layout;
    circlePositions.current[id] = { x, y };
    console.log(`handleLayout: Circle ${id} position saved -> x=${x}, y=${y}`);
  };

  const firtHalf = circlesData.slice(0,5)
  const secondHalf = circlesData.slice(5,10)

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* <View style={styles.circlesContainer}> */}
      <View style={{flexWrap:"wrap", flexDirection:"row"}}>
        {firtHalf.map((circle) => (
          <DraggableCircle
          key={`${circle.id}-${renderKey}`}
          id={circle.id}
          color={circle.color}
          onDrop={handleDrop}
          onLayout={handleLayout}
          />
        ))}
        </View>
        <View style={{flexWrap:"wrap", flexDirection:"row"}}>
         {secondHalf.map((circle) => (
           <DraggableCircle
           key={`${circle.id}-${renderKey}`}
           id={circle.id}
           color={circle.color}
           onDrop={handleDrop}
           onLayout={handleLayout}
           />
          ))}
          </View>


             {/* {firtHalf.map((circle) => (
          <DraggableCircle
          key={`${circle.id}-${renderKey}`}
            id={circle.id}
            color={circle.color}
            onDrop={handleDrop}
            onLayout={handleLayout}
          />
        ))}
         {secondHalf.map((circle) => (
          <DraggableCircle
          key={`${circle.id}-${renderKey}`}
            id={circle.id}
            color={circle.color}
            onDrop={handleDrop}
            onLayout={handleLayout}
          />
        ))} */}
      {/* </View> */}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  circlesContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  circleText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default MoreCircles;