import AsyncStorage from '@react-native-async-storage/async-storage';

const REST_SECONDS_KEY = '@gym_raccon/rest_seconds';
const DEFAULT_REST_SECONDS = 90;

export async function loadRestSeconds(): Promise<number> {
  const raw = await AsyncStorage.getItem(REST_SECONDS_KEY);
  const parsed = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_REST_SECONDS;
}

export async function saveRestSeconds(seconds: number): Promise<void> {
  await AsyncStorage.setItem(REST_SECONDS_KEY, String(seconds));
}

export { DEFAULT_REST_SECONDS };
