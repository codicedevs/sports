import React from "react";
import { Div, Skeleton } from "react-native-magnus";
import { scale, verticalScale } from "react-native-size-matters";
import { customTheme } from "../../utils/theme";

const UpcomingMatchCardSkeleton = () => {
  return (
    <Skeleton.Box
      h={verticalScale(160)}
      w={scale(155)}
      rounded="md"
      borderWidth={1}
      borderColor="black"
      p={customTheme.spacing.medium}
      mr={15}
    />
  );
};

export default React.memo(UpcomingMatchCardSkeleton);