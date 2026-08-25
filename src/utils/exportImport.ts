import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { WorkoutPlan, WorkoutSession } from '../types';

export type ExportedData = {
  exportVersion: number;
  exportedAt: string;
  plans: WorkoutPlan[];
  sessions: WorkoutSession[];
  restDays: string[];
};

const EXPORT_VERSION = 1;

export function buildExportPayload(
  plans: WorkoutPlan[],
  sessions: WorkoutSession[],
  restDays: string[]
): ExportedData {
  return {
    exportVersion: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    plans,
    sessions,
    restDays,
  };
}

export function validateImportPayload(data: unknown): data is ExportedData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return Array.isArray(d.plans) && Array.isArray(d.sessions);
}

export async function exportData(payload: ExportedData): Promise<void> {
  const json = JSON.stringify(payload, null, 2);
  const filename = `gym-raccon-backup-${payload.exportedAt.slice(0, 10)}.json`;

  if (Platform.OS === 'web') {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return;
  }

  const fileUri = FileSystem.documentDirectory + filename;
  await FileSystem.writeAsStringAsync(fileUri, json, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: 'Backup exportieren',
    });
  }
}

export async function importData(): Promise<ExportedData | null> {
  if (Platform.OS === 'web') {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) {
          resolve(null);
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(reader.result as string);
            resolve(validateImportPayload(parsed) ? parsed : null);
          } catch {
            resolve(null);
          }
        };
        reader.onerror = () => resolve(null);
        reader.readAsText(file);
      };
      input.click();
    });
  }

  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
  });
  if (result.canceled || !result.assets?.[0]) return null;
  try {
    const content = await FileSystem.readAsStringAsync(result.assets[0].uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    const parsed = JSON.parse(content);
    return validateImportPayload(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
