import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppData } from '../context/AppDataContext';
import { EnergyLevel } from '../utils/workoutHistory';
import GradientButton from '../components/GradientButton';
import { colors, radius, spacing } from '../theme';
import { useSettings } from '../context/SettingsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'StartWorkout'>;

const ENERGY_OPTIONS: { value: EnergyLevel; emoji: string; label: string; hint: string }[] = [
  { value: 'good', emoji: '💪', label: 'Fühl mich gut', hint: 'Gewicht wird leicht erhöht' },
  { value: 'weak', emoji: '😐', label: 'Normal', hint: 'Gewicht bleibt gleich' },
  { value: 'bad', emoji: '😩', label: 'Abgrundtief scheiße', hint: 'Gewicht wird leicht gesenkt' },
];

export default function StartWorkoutScreen({ route, navigation }: Props) {
  const { planId } = route.params;
  const { plans } = useAppData();
  const { accent } = useSettings();
  const plan = plans.find((p) => p.id === planId);

  const [energy, setEnergy] = useState<EnergyLevel>('weak');
  const [startExerciseId, setStartExerciseId] = useState<string | undefined>(
    plan?.exercises[0]?.id
  );

  if (!plan) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Plan nicht gefunden.</Text>
      </View>
    );
  }

  function handleStart() {
    if (!startExerciseId) return;
    navigation.replace('ActiveWorkout', {
      planId: plan!.id,
      startExerciseId,
      energyLevel: energy,
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Wie fühlst du dich heute?</Text>
      {ENERGY_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[
            styles.energyCard,
            energy === opt.value && { borderColor: accent.color, backgroundColor: accent.glow },
          ]}
          onPress={() => setEnergy(opt.value)}
        >
          <Text style={styles.energyEmoji}>{opt.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.energyLabel}>{opt.label}</Text>
            <Text style={styles.energyHint}>{opt.hint}</Text>
          </View>
          {energy === opt.value && (
            <Text style={[styles.checkmark, { color: accent.color }]}>✓</Text>
          )}
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Mit welcher Übung starten?</Text>
      {plan.exercises.map((ex) => (
        <TouchableOpacity
          key={ex.id}
          style={[
            styles.exerciseChip,
            startExerciseId === ex.id && { borderColor: accent.color, backgroundColor: accent.glow },
          ]}
          onPress={() => setStartExerciseId(ex.id)}
        >
          {ex.photoUri ? (
            <Image source={{ uri: ex.photoUri }} style={styles.exerciseThumb} />
          ) : (
            <View style={[styles.exerciseThumb, styles.exerciseThumbPlaceholder]}>
              <Text style={{ fontSize: 16 }}>🏋️</Text>
            </View>
          )}
          <Text
            style={[
              styles.exerciseChipText,
              startExerciseId === ex.id && styles.exerciseChipTextSelected,
            ]}
          >
            {ex.name}
          </Text>
        </TouchableOpacity>
      ))}

      <GradientButton label="Los geht's" onPress={handleStart} style={{ marginTop: spacing.lg }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 48 },
  sectionTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 12 },
  energyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.border,
  },
  energyEmoji: { fontSize: 26, marginRight: 14 },
  energyLabel: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
  energyHint: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  checkmark: { fontSize: 18, fontWeight: '700' },
  exerciseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  exerciseThumb: { width: 36, height: 36, borderRadius: radius.sm },
  exerciseThumbPlaceholder: {
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseChipText: { color: colors.textPrimary, fontSize: 15 },
  exerciseChipTextSelected: { fontWeight: '700' },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: 40 },
});
