import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { AppDataProvider } from './src/context/AppDataContext';
import { SettingsProvider, useSettings } from './src/context/SettingsContext';

function AppContent() {
  const { colorScheme, colors } = useSettings();
  const isDark = colorScheme === 'dark';
  const baseTheme = isDark ? DarkTheme : DefaultTheme;
  const theme = {
    ...baseTheme,
    colors: { ...baseTheme.colors, background: colors.background, card: colors.background },
  };

  return (
    <>
      <NavigationContainer theme={theme}>
        <RootNavigator />
      </NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppDataProvider>
        <SettingsProvider>
          <AppContent />
        </SettingsProvider>
      </AppDataProvider>
    </SafeAreaProvider>
  );
}
