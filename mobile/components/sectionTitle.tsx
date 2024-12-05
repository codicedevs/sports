import { PropsWithChildren, ReactElement } from "react";
import { Text } from "react-native-animatable";
import { Div } from "react-native-magnus";

interface SectionTitleProps {
    title: string;
}

export default function SectionTitle({ title } : SectionTitleProps): ReactElement {
    return (
        <Div mt={25}>
            <Text style={{ fontFamily: "RobotoCondensed-Bold", fontSize: 20 }}>{title}</Text>
        </Div>
    )
}