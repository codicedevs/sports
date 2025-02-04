import 'react-native-gesture-handler';
if (__DEV__) {
  require("./ReactotronConfig");
}
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ThemeProvider as MagnusThemeProvider } from 'react-native-magnus';
import { ThemeProvider } from 'styled-components/native';
import AppProvider from './context/authProvider';
import { LoadingProvider } from './context/loadingProvider';
import './gesture-handler';
import AppNavigator from './navigation/appNavigator';
import { customTheme } from './utils/theme';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const queryClient = new QueryClient()

export default function App() {
  const [fontsLoaded] = useFonts({
    'AcuminProCondensed': require('./assets/fonts/Acumin_Pro_Condensed.otf'),
    'Coolvetica': require('./assets/fonts/coolvetica.otf'),

    // Poppins Fonts
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),

    // Roboto Condensed Fonts
    'RobotoCondensed-Black': require('./assets/fonts/RobotoCondensed-Black.ttf'),
    'RobotoCondensed-BlackItalic': require('./assets/fonts/RobotoCondensed-BlackItalic.ttf'),
    'RobotoCondensed-Bold': require('./assets/fonts/RobotoCondensed-Bold.ttf'),
    'RobotoCondensed-BoldItalic': require('./assets/fonts/RobotoCondensed-BoldItalic.ttf'),
    'RobotoCondensed-ExtraBold': require('./assets/fonts/RobotoCondensed-ExtraBold.ttf'),
    'RobotoCondensed-ExtraBoldItalic': require('./assets/fonts/RobotoCondensed-ExtraBoldItalic.ttf'),
    'RobotoCondensed-ExtraLight': require('./assets/fonts/RobotoCondensed-ExtraLight.ttf'),
    'RobotoCondensed-ExtraLightItalic': require('./assets/fonts/RobotoCondensed-ExtraLightItalic.ttf'),
    'RobotoCondensed-Italic': require('./assets/fonts/RobotoCondensed-Italic.ttf'),
    'RobotoCondensed-Light': require('./assets/fonts/RobotoCondensed-Light.ttf'),
    'RobotoCondensed-LightItalic': require('./assets/fonts/RobotoCondensed-LightItalic.ttf'),
    'RobotoCondensed-Medium': require('./assets/fonts/RobotoCondensed-Medium.ttf'),
    'RobotoCondensed-MediumItalic': require('./assets/fonts/RobotoCondensed-MediumItalic.ttf'),
    'RobotoCondensed-Regular': require('./assets/fonts/RobotoCondensed-Regular.ttf'),
    'RobotoCondensed-SemiBold': require('./assets/fonts/RobotoCondensed-SemiBold.ttf'),
    'RobotoCondensed-SemiBoldItalic': require('./assets/fonts/RobotoCondensed-SemiBoldItalic.ttf'),
    'RobotoCondensed-Thin': require('./assets/fonts/RobotoCondensed-Thin.ttf'),
    'RobotoCondensed-ThinItalic': require('./assets/fonts/RobotoCondensed-ThinItalic.ttf'),
    //noto sans fuente
    'NotoSans-Italic': require('./assets/fonts/NotoSans-Italic-VariableFont_wdth,wght.ttf'),
    'NotoSans-Variable' : require('./assets/fonts/NotoSans-VariableFont_wdth,wght.ttf')
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
