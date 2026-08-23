import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loadRestSeconds, saveRestSeconds, DEFAULT_REST_SECONDS } from '../storage/settingsStorage';

type SettingsContextValue = {
  restSeconds: number;
  loading: boolean;
  setRestSeconds: (seconds: number) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [restSeconds, setRestSecondsState] = useState(DEFAULT_REST_SECONDS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const seconds = await loadRestSeconds();
      setRestSecondsState(seconds);
      setLoading(false);
    })();
  }, []);

  const setRestSeconds = useCallback(async (seconds: number) => {
    setRestSecondsState(seconds);
    await saveRestSeconds(seconds);
  }, []);

  return (
    <SettingsContext.Provider value={{ restSeconds, loading, setRestSeconds }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
