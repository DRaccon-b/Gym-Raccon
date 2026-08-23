import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { AppDataProvider } from './src/context/AppDataContext';

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: '#0f1115', card: '#0f1115' },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppDataProvider>
        <NavigationContainer theme={theme}>
          <RootNavigator />
        </NavigationContainer>
        <StatusBar style="light" />
      </AppDataProvider>
    </SafeAreaProvider>
  );
}
