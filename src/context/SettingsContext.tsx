import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  loadRestSeconds,
  saveRestSeconds,
  DEFAULT_REST_SECONDS,
  loadShowVolume,
  saveShowVolume,
  DEFAULT_SHOW_VOLUME,
} from '../storage/settingsStorage';

type SettingsContextValue = {
  restSeconds: number;
  showVolume: boolean;
  loading: boolean;
  setRestSeconds: (seconds: number) => Promise<void>;
  setShowVolume: (value: boolean) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [restSeconds, setRestSecondsState] = useState(DEFAULT_REST_SECONDS);
  const [showVolume, setShowVolumeState] = useState(DEFAULT_SHOW_VOLUME);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [seconds, volume] = await Promise.all([loadRestSeconds(), loadShowVolume()]);
      setRestSecondsState(seconds);
      setShowVolumeState(volume);
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

  return (
    <SettingsContext.Provider
      value={{ restSeconds, showVolume, loading, setRestSeconds, setShowVolume }}
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
