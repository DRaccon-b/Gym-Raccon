import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppData } from '../context/AppDataContext';
import { EnergyLevel } from '../utils/workoutHistory';

type Props = NativeStackScreenProps<RootStackParamList, 'StartWorkout'>;

const ENERGY_OPTIONS: { value: EnergyLevel; emoji: string; label: string; hint: string }[] = [
  { value: 'good', emoji: '💪', label: 'Fühl mich gut', hint: 'Gewicht wird leicht erhöht' },
  { value: 'weak', emoji: '😐', label: 'Bin schwach', hint: 'Gewicht bleibt gleich' },
  { value: 'bad', emoji: '😩', label: 'Abgrundtief scheiße', hint: 'Gewicht wird leicht gesenkt' },
];

export default function StartWorkoutScreen({ route, navigation }: Props) {
  const { planId } = route.params;
  const { plans } = useAppData();
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
          style={[styles.energyCard, energy === opt.value && styles.energyCardSelected]}
          onPress={() => setEnergy(opt.value)}
        >
          <Text style={styles.energyEmoji}>{opt.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.energyLabel}>{opt.label}</Text>
            <Text style={styles.energyHint}>{opt.hint}</Text>
          </View>
          {energy === opt.value && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Mit welcher Übung starten?</Text>
      {plan.exercises.map((ex) => (
        <TouchableOpacity
          key={ex.id}
          style={[styles.exerciseChip, startExerciseId === ex.id && styles.exerciseChipSelected]}
          onPress={() => setStartExerciseId(ex.id)}
        >
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

      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.startButtonText}>Los geht's</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115' },
  content: { padding: 16, paddingBottom: 48 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 12 },
  energyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b1e26',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  energyCardSelected: { borderColor: '#ff5a3c' },
  energyEmoji: { fontSize: 26, marginRight: 14 },
  energyLabel: { color: '#fff', fontSize: 16, fontWeight: '600' },
  energyHint: { color: '#9aa0ac', fontSize: 13, marginTop: 2 },
  checkmark: { color: '#ff5a3c', fontSize: 18, fontWeight: '700' },
  exerciseChip: {
    backgroundColor: '#1b1e26',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  exerciseChipSelected: { borderColor: '#ff5a3c', backgroundColor: '#2a1e1a' },
  exerciseChipText: { color: '#fff', fontSize: 15 },
  exerciseChipTextSelected: { fontWeight: '700' },
  startButton: {
    marginTop: 28,
    backgroundColor: '#ff5a3c',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  emptyText: { color: '#9aa0ac', textAlign: 'center', marginTop: 40 },
});
