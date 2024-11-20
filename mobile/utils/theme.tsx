import { ThemeType } from "react-native-magnus";
import { moderateScale, scale } from "react-native-size-matters";
import "styled-components/native";
import { DefaultTheme as SCDefaultTheme } from "styled-components/native";

// Define el tipo de tu tema personalizado
export type CustomThemeType = ThemeType & {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        cardBorder: string;
    };
    fontFamily: {
        normal: string;
        bold: string
    };
    fontSize: {
        small: number;
        medium: number;
        large: number;
        title: number;
        xl: number;
    };
    borderRadius: {
        none: number;
        circle: number;
        medium: number;
        small: number;
        big: number;
    };
    spacing: {
        none: number;
        xs: number;
        small: number;
        medium: number;
        large: number;
        xl: number;
    };
    shadowColor: string;
    name: string;
};

// Extiende la interfaz `DefaultTheme` usando el tipo `CustomThemeType`
declare module "styled-components/native" {
    export interface DefaultTheme extends CustomThemeType { }
}

export const customTheme: CustomThemeType = {
    colors: {
        primary: "#0070f3",
        secondary: "#1c1c1c",
        accent: "#e91e63",
        background: "#f0f0f0",
        text: "#333333",
        cardBorder: "lightgray",
    },
    fontFamily: {
        normal: "Poppins-Regular",
        bold: "Poppins-Bold"
    },
    fontSize: {
        small: moderateScale(12),
        medium: moderateScale(16),
        large: moderateScale(20),
        title: moderateScale(24),
        xl: moderateScale(32),
    },
    borderRadius: {
        none: 0,
        circle: 99999,
        medium: scale(5),
        small: scale(8),
        big: scale(16),
    },
    spacing: {
        none: 0,
        xs: scale(5),
        small: scale(8),
        medium: scale(16),
        large: scale(24),
        xl: scale(32),
    },
    shadowColor: "black",
    name: "myTheme",
    components: {
        Text: {
            fontFamily: "Poppins-Regular"
        }
    }
};
