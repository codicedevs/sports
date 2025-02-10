import "react-native-gesture-handler";
if (__DEV__) {
  require("./ReactotronConfig");
}
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ThemeProvider as MagnusThemeProvider } from "react-native-magnus";
import { ThemeProvider } from "styled-components/native";
import AppProvider from "./context/authProvider";
import { LoadingProvider } from "./context/loadingProvider";
import "./gesture-handler";
import AppNavigator from "./navigation/appNavigator";
import { customTheme } from "./utils/theme";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded] = useFonts({
    //noto sans fuente
    "NotoSans-Italic": require("./assets/fonts/NotoSans-Italic-VariableFont_wdth,wght.ttf"),
    "NotoSans-Variable": require("./assets/fonts/NotoSans-VariableFont_wdth,wght.ttf"),
    "NotoSans-ExtraCondensed-BoldItalic": require("./assets/fonts/NotoSans_ExtraCondensed-BoldItalic.ttf"),
    "NotoSans-BoldItalic": require("./assets/fonts/NotoSans-BoldItalic.ttf"),
    "NotoSans_Condensed-Black": require("./assets/fonts/NotoSans_Condensed-Black.ttf"),
    "NotoSans_Condensed-BlackItalic": require("./assets/fonts/NotoSans_Condensed-BlackItalic.ttf"),
    "NotoSans_Condensed-ExtraBoldItalic": require("./assets/fonts/NotoSans_Condensed-ExtraBoldItalic.ttf"),
    "NotoSans-Regular" : require("./assets/fonts/NotoSans-Regular.ttf"),
   "NotoSans_SemiCondensed-ExtraBold" : require("./assets/fonts/NotoSans_SemiCondensed-ExtraBold.ttf"),
   "NotoSans-Black" : require("./assets/fonts/NotoSans-Black.ttf"),
   "NotoSans-ExtraBold" : require("./assets/fonts/NotoSans-ExtraBold.ttf"),
   "NotoSans-ExtraBoldItalic" : require ("./assets/fonts/NotoSans-ExtraBoldItalic.ttf")
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={customTheme}>
        <MagnusThemeProvider theme={customTheme}>
          <LoadingProvider>
            <AppProvider>
              <SafeAreaView style={{ flex: 1 }}>
                <StatusBar
                  translucent
                  backgroundColor="transparent"
                  style="light"
                />
                <AppNavigator />
              </SafeAreaView>
            </AppProvider>
          </LoadingProvider>
        </MagnusThemeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
