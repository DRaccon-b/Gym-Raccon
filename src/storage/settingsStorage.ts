import AsyncStorage from '@react-native-async-storage/async-storage';

const REST_SECONDS_KEY = '@gym_raccon/rest_seconds';
const DEFAULT_REST_SECONDS = 90;

const SHOW_VOLUME_KEY = '@gym_raccon/show_volume';
const DEFAULT_SHOW_VOLUME = false;

export async function loadRestSeconds(): Promise<number> {
  const raw = await AsyncStorage.getItem(REST_SECONDS_KEY);
  const parsed = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_REST_SECONDS;
}

export async function saveRestSeconds(seconds: number): Promise<void> {
  await AsyncStorage.setItem(REST_SECONDS_KEY, String(seconds));
}

export async function loadShowVolume(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(SHOW_VOLUME_KEY);
  return raw === null ? DEFAULT_SHOW_VOLUME : raw === 'true';
}

export async function saveShowVolume(value: boolean): Promise<void> {
  await AsyncStorage.setItem(SHOW_VOLUME_KEY, String(value));
}

export { DEFAULT_REST_SECONDS, DEFAULT_SHOW_VOLUME };
