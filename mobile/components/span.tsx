import { PropsWithChildren } from "react";
import { Div, Text, TextProps } from "react-native-magnus";

interface SpanProps extends PropsWithChildren, TextProps {}

const Span = ({ children, ...rest }: SpanProps) => (
  <Div justifyContent="flex-start" alignItems="flex-start" h={"auto"} >
    <Text {...rest} p="xs" rounded="xl">{children}</Text>
  </Div>
);

export default Span;
