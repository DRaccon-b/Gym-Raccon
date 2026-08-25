import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutPlan, WorkoutSession } from '../types';

const PLANS_KEY = '@gym_raccon/plans';
const SESSIONS_KEY = '@gym_raccon/sessions';
const REST_DAYS_KEY = '@gym_raccon/rest_days';

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function loadPlans(): Promise<WorkoutPlan[]> {
  return readJson<WorkoutPlan[]>(PLANS_KEY, []);
}

export async function savePlans(plans: WorkoutPlan[]): Promise<void> {
  await writeJson(PLANS_KEY, plans);
}

export async function loadSessions(): Promise<WorkoutSession[]> {
  return readJson<WorkoutSession[]>(SESSIONS_KEY, []);
}

export async function saveSessions(sessions: WorkoutSession[]): Promise<void> {
  await writeJson(SESSIONS_KEY, sessions);
}

export async function loadRestDays(): Promise<string[]> {
  return readJson<string[]>(REST_DAYS_KEY, []);
}

export async function saveRestDays(restDays: string[]): Promise<void> {
  await writeJson(REST_DAYS_KEY, restDays);
}
