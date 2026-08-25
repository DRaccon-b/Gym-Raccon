import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import {
  loadRestSeconds,
  saveRestSeconds,
  DEFAULT_REST_SECONDS,
  loadShowVolume,
  saveShowVolume,
  DEFAULT_SHOW_VOLUME,
  loadAccentKey,
  saveAccentKey,
  loadThemeMode,
  saveThemeMode,
  ThemeMode,
} from '../storage/settingsStorage';
import {
  AccentKey,
  AccentTheme,
  ACCENT_THEMES,
  DEFAULT_ACCENT_KEY,
  ColorScheme,
  Colors,
  getColors,
  getTypography,
  getShadow,
  Typography,
} from '../theme';

type SettingsContextValue = {
  restSeconds: number;
  showVolume: boolean;
  accentKey: AccentKey;
  accent: AccentTheme;
  themeMode: ThemeMode;
  colorScheme: ColorScheme;
  colors: Colors;
  typography: Typography;
  shadow: ReturnType<typeof getShadow>;
  loading: boolean;
  setRestSeconds: (seconds: number) => Promise<void>;
  setShowVolume: (value: boolean) => Promise<void>;
  setAccentKey: (key: AccentKey) => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [restSeconds, setRestSecondsState] = useState(DEFAULT_REST_SECONDS);
  const [showVolume, setShowVolumeState] = useState(DEFAULT_SHOW_VOLUME);
  const [accentKey, setAccentKeyState] = useState<AccentKey>(DEFAULT_ACCENT_KEY);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [loading, setLoading] = useState(true);
  const systemScheme = useSystemColorScheme();

  useEffect(() => {
    (async () => {
      const [seconds, volume, accent, mode] = await Promise.all([
        loadRestSeconds(),
        loadShowVolume(),
        loadAccentKey(),
        loadThemeMode(),
      ]);
      setRestSecondsState(seconds);
      setShowVolumeState(volume);
      setAccentKeyState(accent);
      setThemeModeState(mode);
      setLoading(false);
    })();
  }, []);

  const setRestSeconds = useCallback(async (seconds: number) => {
    setRestSecondsState(seconds);
    await saveRestSeconds(seconds);
  }, []);

  const setShowVolume = useCallback(async (value: boolean) => {
    setShowVolumeState(value);
    await saveShowVolume(value);
  }, []);

  const setAccentKey = useCallback(async (key: AccentKey) => {
    setAccentKeyState(key);
    await saveAccentKey(key);
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await saveThemeMode(mode);
  }, []);

  const colorScheme: ColorScheme =
    themeMode === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : themeMode;

  const colors = useMemo(() => getColors(colorScheme), [colorScheme]);
  const typography = useMemo(() => getTypography(colors), [colors]);
  const shadow = useMemo(() => getShadow(colors), [colors]);

  return (
    <SettingsContext.Provider
      value={{
        restSeconds,
        showVolume,
        accentKey,
        accent: ACCENT_THEMES[accentKey],
        themeMode,
        colorScheme,
        colors,
        typography,
        shadow,
        loading,
        setRestSeconds,
        setShowVolume,
        setAccentKey,
        setThemeMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
