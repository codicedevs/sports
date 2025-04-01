import React from "react";
import { View } from "react-native";
import { Div, Skeleton } from "react-native-magnus";
import { scale, verticalScale } from "react-native-size-matters";
import { customTheme } from "../../utils/theme";

const MatchCardSkeleton = () => {
  return (
    <Div alignItems="center" h={verticalScale(150)}>
      <Div
        borderWidth={scale(1)}
        rounded={customTheme.borderRadius.medium}
        flex={1}
        h={scale(150)}
        flexDir="row"
      >
        <Div
        bg={customTheme.colors.primary}
          flex={2}
          justifyContent="center"
          rounded={customTheme.borderRadius.medium}

        >
          <Skeleton.Box w={'100%'} h={'100%'} />
        </Div>
        <View
          style={{
            flex: 3,
            borderStyle: "dashed",
            borderLeftWidth: scale(1.2)
          }}
        >
          <Skeleton.Box w="100%" h={'100%'}/>
        </View>
      </Div>
    </Div>
  );
};

export default React.memo(MatchCardSkeleton);
