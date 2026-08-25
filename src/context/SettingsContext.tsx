import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  loadRestSeconds,
  saveRestSeconds,
  DEFAULT_REST_SECONDS,
  loadShowVolume,
  saveShowVolume,
  DEFAULT_SHOW_VOLUME,
  loadAccentKey,
  saveAccentKey,
} from '../storage/settingsStorage';
import { AccentKey, AccentTheme, ACCENT_THEMES, DEFAULT_ACCENT_KEY } from '../theme';

type SettingsContextValue = {
  restSeconds: number;
  showVolume: boolean;
  accentKey: AccentKey;
  accent: AccentTheme;
  loading: boolean;
  setRestSeconds: (seconds: number) => Promise<void>;
  setShowVolume: (value: boolean) => Promise<void>;
  setAccentKey: (key: AccentKey) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [restSeconds, setRestSecondsState] = useState(DEFAULT_REST_SECONDS);
  const [showVolume, setShowVolumeState] = useState(DEFAULT_SHOW_VOLUME);
  const [accentKey, setAccentKeyState] = useState<AccentKey>(DEFAULT_ACCENT_KEY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [seconds, volume, accent] = await Promise.all([
        loadRestSeconds(),
        loadShowVolume(),
        loadAccentKey(),
      ]);
      setRestSecondsState(seconds);
      setShowVolumeState(volume);
      setAccentKeyState(accent);
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

  return (
    <SettingsContext.Provider
      value={{
        restSeconds,
        showVolume,
        accentKey,
        accent: ACCENT_THEMES[accentKey],
        loading,
        setRestSeconds,
        setShowVolume,
        setAccentKey,
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
