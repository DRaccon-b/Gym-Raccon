import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { useAppData } from '../context/AppDataContext';
import { APP_VERSION } from '../constants/version';
import Card from '../components/Card';
import { colors, radius, spacing, typography } from '../theme';

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
  const { restSeconds, setRestSeconds, showVolume, setShowVolume } = useSettings();
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

      <Card style={styles.stepper}>
        <TouchableOpacity style={styles.stepperButton} onPress={decrease}>
          <Text style={styles.stepperButtonText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.stepperValue}>{formatSeconds(restSeconds)}</Text>
        <TouchableOpacity style={styles.stepperButton} onPress={increase}>
          <Text style={styles.stepperButtonText}>+</Text>
        </TouchableOpacity>
      </Card>

      <Text style={[styles.sectionTitle, { marginTop: 40 }]}>Fortschritt</Text>
      <Card style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.switchLabel}>Bewegtes Gewicht anzeigen</Text>
          <Text style={styles.switchHint}>
            Zeigt unten im Fortschritt-Tab an, wie viel Gewicht du insgesamt bewegt hast.
          </Text>
        </View>
        <Switch
          value={showVolume}
          onValueChange={setShowVolume}
          trackColor={{ false: colors.surfaceRaised, true: colors.accent }}
          thumbColor={colors.textPrimary}
        />
      </Card>

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
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  sectionTitle: { ...typography.title, fontSize: 20, marginTop: 8 },
  sectionSubtitle: { ...typography.body, marginTop: 6, marginBottom: 24 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 32,
  },
  stepperButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepperButtonText: { color: colors.accent, fontSize: 24, fontWeight: '700' },
  stepperValue: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    minWidth: 110,
    textAlign: 'center',
  },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  switchLabel: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
  switchHint: { ...typography.body, fontSize: 12, marginTop: 4 },
  dangerButton: {
    marginTop: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dangerButtonText: { color: colors.danger, fontSize: 15, fontWeight: '700' },
  version: { color: colors.textMuted, fontSize: 12, textAlign: 'center', marginTop: 32 },
});
