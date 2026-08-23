import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppData } from '../context/AppDataContext';
import { Exercise, LoggedExercise, LoggedSet, WorkoutSession } from '../types';
import { adjustWeightForEnergy, findLastLoggedExercise } from '../utils/workoutHistory';

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveWorkout'>;

type PreviousSet = { reps: number; weightKg: number } | undefined;

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function orderExercises(exercises: Exercise[], startExerciseId: string): Exercise[] {
  const startIndex = exercises.findIndex((e) => e.id === startExerciseId);
  if (startIndex <= 0) return exercises;
  return [exercises[startIndex], ...exercises.slice(0, startIndex), ...exercises.slice(startIndex + 1)];
}

export default function ActiveWorkoutScreen({ route, navigation }: Props) {
  const { planId, startExerciseId, energyLevel } = route.params;
  const { plans, sessions, addSession } = useAppData();
  const plan = plans.find((p) => p.id === planId);
  const startedAt = useMemo(() => Date.now(), []);

  const orderedExercises = useMemo(
    () => (plan ? orderExercises(plan.exercises, startExerciseId) : []),
    [plan, startExerciseId]
  );

  const previousByExercise = useMemo(() => {
    const map = new Map<string, PreviousSet[]>();
    orderedExercises.forEach((ex) => {
      const lastLogged = findLastLoggedExercise(ex.name, sessions);
      const prevSets: PreviousSet[] = Array.from({ length: ex.sets }, (_, i) => {
        if (!lastLogged || lastLogged.sets.length === 0) return undefined;
        return lastLogged.sets[i] ?? lastLogged.sets[lastLogged.sets.length - 1];
      });
      map.set(ex.id, prevSets);
    });
    return map;
  }, [orderedExercises, sessions]);

  const initialLog: LoggedExercise[] = useMemo(
    () =>
      orderedExercises.map((ex) => {
        const prevSets = previousByExercise.get(ex.id) ?? [];
        return {
          exerciseId: ex.id,
          name: ex.name,
          sets: Array.from({ length: ex.sets }, (_, i) => {
            const prev = prevSets[i];
            const baseWeight = prev?.weightKg ?? ex.weightKg ?? 0;
            const baseReps = prev?.reps ?? ex.reps;
            return {
              reps: baseReps,
              weightKg: adjustWeightForEnergy(baseWeight, energyLevel),
            };
          }),
        };
      }),
    [orderedExercises, previousByExercise, energyLevel]
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
        {log.map((exercise, exerciseIndex) => {
          const prevSets = previousByExercise.get(exercise.exerciseId) ?? [];
          return (
            <View
              key={exercise.exerciseId}
              style={[styles.card, exerciseIndex === 0 && styles.currentCard]}
            >
              <View style={styles.cardHeader}>
                {(() => {
                  const photoUri = orderedExercises.find((e) => e.id === exercise.exerciseId)
                    ?.photoUri;
                  return photoUri ? (
                    <Image source={{ uri: photoUri }} style={styles.exerciseThumb} />
                  ) : (
                    <View style={[styles.exerciseThumb, styles.exerciseThumbPlaceholder]}>
                      <Text style={{ fontSize: 18 }}>🏋️</Text>
                    </View>
                  );
                })()}
                <Text style={styles.cardTitle}>{exercise.name}</Text>
              </View>
              {exercise.sets.map((set, setIndex) => {
                const prev = prevSets[setIndex];
                return (
                  <View key={setIndex} style={styles.setBlock}>
                    <View style={styles.setRow}>
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
                    <Text style={styles.prevText}>
                      {prev
                        ? `Letztes Mal: ${prev.weightKg} kg × ${prev.reps} Wdh.`
                        : 'Letztes Mal: keine Daten'}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}
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
  currentCard: { borderWidth: 2, borderColor: '#ff5a3c' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  exerciseThumb: { width: 40, height: 40, borderRadius: 10 },
  exerciseThumbPlaceholder: {
    backgroundColor: '#0f1115',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  setBlock: { marginBottom: 10 },
  setRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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
  prevText: { color: '#6b7280', fontSize: 12, marginTop: 4, marginLeft: 60 },
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
