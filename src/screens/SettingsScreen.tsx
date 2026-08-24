import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { useAppData } from '../context/AppDataContext';
import { APP_VERSION } from '../constants/version';

const STEP = 15;
const MIN_SECONDS = 15;
const MAX_SECONDS = 600;

function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes === 0) return `${rest}s`;
  if (rest === 0) return `${minutes} min`;
  return `${minutes}:${String(rest).padStart(2, '0')} min`;
}

export default function SettingsScreen() {
  const { restSeconds, setRestSeconds } = useSettings();
  const { clearAllData } = useAppData();

  function handleClearAll() {
    Alert.alert(
      'Alles löschen?',
      'Das löscht unwiderruflich alle Trainingspläne, deinen kompletten Workout-Verlauf und alle Fortschrittsdaten. Das kann nicht rückgängig gemacht werden.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Endgültig löschen',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Bist du sicher?',
              'Wirklich ALLE Daten löschen?',
              [
                { text: 'Abbrechen', style: 'cancel' },
                {
                  text: 'Ja, alles löschen',
                  style: 'destructive',
                  onPress: () => clearAllData(),
                },
              ]
            );
          },
        },
      ]
    );
  }

  function decrease() {
    setRestSeconds(Math.max(MIN_SECONDS, restSeconds - STEP));
  }

  function increase() {
    setRestSeconds(Math.min(MAX_SECONDS, restSeconds + STEP));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Satzpause</Text>
      <Text style={styles.sectionSubtitle}>
        Wie lange soll der Timer zwischen den Sätzen standardmäßig laufen?
      </Text>

      <View style={styles.stepper}>
        <TouchableOpacity style={styles.stepperButton} onPress={decrease}>
          <Text style={styles.stepperButtonText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.stepperValue}>{formatSeconds(restSeconds)}</Text>
        <TouchableOpacity style={styles.stepperButton} onPress={increase}>
          <Text style={styles.stepperButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 40 }]}>Gefahrenzone</Text>
      <Text style={styles.sectionSubtitle}>
        Löscht alle Trainingspläne, den Workout-Verlauf und alle Fortschrittsdaten unwiderruflich.
      </Text>
      <TouchableOpacity style={styles.dangerButton} onPress={handleClearAll}>
        <Text style={styles.dangerButtonText}>Alle Daten löschen</Text>
      </TouchableOpacity>

      <Text style={styles.version}>{APP_VERSION}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115', padding: 16 },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 8 },
  sectionSubtitle: { color: '#9aa0ac', fontSize: 14, marginTop: 6, marginBottom: 24 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1b1e26',
    borderRadius: 16,
    paddingVertical: 24,
    gap: 32,
  },
  stepperButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2a2f3a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonText: { color: '#fff', fontSize: 24, fontWeight: '700' },
  stepperValue: { color: '#fff', fontSize: 28, fontWeight: '700', minWidth: 110, textAlign: 'center' },
  dangerButton: {
    marginTop: 4,
    backgroundColor: '#2a1416',
    borderWidth: 1,
    borderColor: '#7f1d1d',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dangerButtonText: { color: '#ef4444', fontSize: 15, fontWeight: '700' },
  version: { color: '#6b7280', fontSize: 12, textAlign: 'center', marginTop: 32 },
});
