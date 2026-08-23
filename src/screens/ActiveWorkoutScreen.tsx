import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppData } from '../context/AppDataContext';
import { LoggedExercise, LoggedSet, WorkoutSession } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveWorkout'>;

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function ActiveWorkoutScreen({ route, navigation }: Props) {
  const { planId } = route.params;
  const { plans, addSession } = useAppData();
  const plan = plans.find((p) => p.id === planId);
  const startedAt = useMemo(() => Date.now(), []);

  const initialLog: LoggedExercise[] = useMemo(
    () =>
      (plan?.exercises ?? []).map((ex) => ({
        exerciseId: ex.id,
        name: ex.name,
        sets: Array.from({ length: ex.sets }, () => ({
          reps: ex.reps,
          weightKg: ex.weightKg ?? 0,
        })),
      })),
    [plan]
  );

  const [log, setLog] = useState<LoggedExercise[]>(initialLog);

  if (!plan) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Plan nicht gefunden.</Text>
      </View>
    );
  }

  function updateSet(
    exerciseIndex: number,
    setIndex: number,
    field: keyof LoggedSet,
    value: string
  ) {
    setLog((prev) => {
      const next = prev.map((ex) => ({ ...ex, sets: [...ex.sets] }));
      const numeric = parseFloat(value.replace(',', '.'));
      next[exerciseIndex].sets[setIndex] = {
        ...next[exerciseIndex].sets[setIndex],
        [field]: Number.isFinite(numeric) ? numeric : 0,
      };
      return next;
    });
  }

  async function handleFinish() {
    const durationMinutes = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
    const session: WorkoutSession = {
      id: makeId(),
      planId: plan!.id,
      planName: plan!.name,
      date: new Date().toISOString(),
      durationMinutes,
      exercises: log,
    };
    await addSession(session);
    Alert.alert('Workout gespeichert', `${plan!.name} wurde in deinem Verlauf gespeichert.`);
    navigation.popToTop();
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.title}>{plan.name}</Text>
        {log.map((exercise, exerciseIndex) => (
          <View key={exercise.exerciseId} style={styles.card}>
            <Text style={styles.cardTitle}>{exercise.name}</Text>
            {exercise.sets.map((set, setIndex) => (
              <View key={setIndex} style={styles.setRow}>
                <Text style={styles.setLabel}>Satz {setIndex + 1}</Text>
                <View style={styles.setInputs}>
                  <TextInput
                    style={styles.setInput}
                    keyboardType="numeric"
                    value={String(set.reps)}
                    onChangeText={(v) => updateSet(exerciseIndex, setIndex, 'reps', v)}
                  />
                  <Text style={styles.setUnit}>Wdh.</Text>
                  <TextInput
                    style={styles.setInput}
                    keyboardType="numeric"
                    value={String(set.weightKg)}
                    onChangeText={(v) => updateSet(exerciseIndex, setIndex, 'weightKg', v)}
                  />
                  <Text style={styles.setUnit}>kg</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
        <Text style={styles.finishButtonText}>Workout beenden</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115' },
  list: { padding: 16, paddingBottom: 96 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 16 },
  card: { backgroundColor: '#1b1e26', borderRadius: 14, padding: 16, marginBottom: 12 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 10 },
  setRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  setLabel: { color: '#9aa0ac', fontSize: 14, width: 60 },
  setInputs: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  setInput: {
    backgroundColor: '#0f1115',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 56,
    textAlign: 'center',
  },
  setUnit: { color: '#6b7280', fontSize: 12 },
  emptyText: { color: '#9aa0ac', textAlign: 'center', marginTop: 40 },
  finishButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#22c55e',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  finishButtonText: { color: '#0f1115', fontSize: 16, fontWeight: '700' },
});
