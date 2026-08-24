import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { WorkoutPlan, WorkoutSession } from '../types';
import { loadPlans, savePlans, loadSessions, saveSessions } from '../storage/storage';

type AppDataContextValue = {
  plans: WorkoutPlan[];
  sessions: WorkoutSession[];
  loading: boolean;
  addPlan: (plan: WorkoutPlan) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;
  addSession: (session: WorkoutSession) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  clearAllData: () => Promise<void>;
};

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [loadedPlans, loadedSessions] = await Promise.all([loadPlans(), loadSessions()]);
      setPlans(loadedPlans);
      setSessions(loadedSessions);
      setLoading(false);
    })();
  }, []);

  const addPlan = useCallback(async (plan: WorkoutPlan) => {
    setPlans((prev) => {
      const next = [...prev, plan];
      savePlans(next);
      return next;
    });
  }, []);

  const deletePlan = useCallback(async (planId: string) => {
    setPlans((prev) => {
      const next = prev.filter((p) => p.id !== planId);
      savePlans(next);
      return next;
    });
  }, []);

  const addSession = useCallback(async (session: WorkoutSession) => {
    setSessions((prev) => {
      const next = [session, ...prev];
      saveSessions(next);
      return next;
    });
  }, []);

  const deleteSession = useCallback(async (sessionId: string) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== sessionId);
      saveSessions(next);
      return next;
    });
  }, []);

  const clearAllData = useCallback(async () => {
    setPlans([]);
    setSessions([]);
    await Promise.all([savePlans([]), saveSessions([])]);
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        plans,
        sessions,
        loading,
        addPlan,
        deletePlan,
        addSession,
        deleteSession,
        clearAllData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
