import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { AppDataProvider } from './src/context/AppDataContext';
import { SettingsProvider } from './src/context/SettingsContext';

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: '#0f1115', card: '#0f1115' },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppDataProvider>
        <SettingsProvider>
          <NavigationContainer theme={theme}>
            <RootNavigator />
          </NavigationContainer>
          <StatusBar style="light" />
        </SettingsProvider>
      </AppDataProvider>
    </SafeAreaProvider>
  );
}
