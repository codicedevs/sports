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

const queryClient = new QueryClient()

export default function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={customTheme}>
        <MagnusThemeProvider theme={customTheme}>
          <LoadingProvider>
            <AppProvider>
              <AppNavigator />
            </AppProvider>
          </LoadingProvider>
        </MagnusThemeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
