import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccentKey, DEFAULT_ACCENT_KEY, ACCENT_THEMES } from '../theme';

const ACCENT_KEY_STORAGE_KEY = '@gym_raccon/accent_color';

export type ThemeMode = 'light' | 'dark' | 'system';
const THEME_MODE_KEY = '@gym_raccon/theme_mode';
const DEFAULT_THEME_MODE: ThemeMode = 'dark';

export async function loadThemeMode(): Promise<ThemeMode> {
  const raw = await AsyncStorage.getItem(THEME_MODE_KEY);
  return raw === 'light' || raw === 'dark' || raw === 'system' ? raw : DEFAULT_THEME_MODE;
}

export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(THEME_MODE_KEY, mode);
}

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

export async function loadAccentKey(): Promise<AccentKey> {
  const raw = await AsyncStorage.getItem(ACCENT_KEY_STORAGE_KEY);
  return raw && raw in ACCENT_THEMES ? (raw as AccentKey) : DEFAULT_ACCENT_KEY;
}

export async function saveAccentKey(key: AccentKey): Promise<void> {
  await AsyncStorage.setItem(ACCENT_KEY_STORAGE_KEY, key);
}

export { DEFAULT_REST_SECONDS, DEFAULT_SHOW_VOLUME };
