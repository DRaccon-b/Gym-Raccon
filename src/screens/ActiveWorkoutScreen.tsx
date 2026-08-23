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
import { useSettings } from '../context/SettingsContext';
import { Exercise, LoggedExercise, LoggedSet, WorkoutSession } from '../types';
import { adjustWeightForEnergy, findLastLoggedExercise } from '../utils/workoutHistory';
import RestTimerModal from '../components/RestTimerModal';
import NextExercisePicker from '../components/NextExercisePicker';

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveWorkout'>;

type PreviousSet = { reps: number; weightKg: number } | undefined;

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function ActiveWorkoutScreen({ route, navigation }: Props) {
  const { planId, startExerciseId, energyLevel } = route.params;
  const { plans, sessions, addSession } = useAppData();
  const { restSeconds } = useSettings();
  const plan = plans.find((p) => p.id === planId);
  const startedAt = useMemo(() => Date.now(), []);

  const allExercises: Exercise[] = plan?.exercises ?? [];

  const previousByExercise = useMemo(() => {
    const map = new Map<string, PreviousSet[]>();
    allExercises.forEach((ex) => {
      const lastLogged = findLastLoggedExercise(ex.name, sessions);
      const prevSets: PreviousSet[] = Array.from({ length: ex.sets }, (_, i) => {
        if (!lastLogged || lastLogged.sets.length === 0) return undefined;
        return lastLogged.sets[i] ?? lastLogged.sets[lastLogged.sets.length - 1];
      });
      map.set(ex.id, prevSets);
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, sessions]);

  const initialLog = useMemo(() => {
    const map = new Map<string, LoggedExercise>();
    allExercises.forEach((ex) => {
      const prevSets = previousByExercise.get(ex.id) ?? [];
      map.set(ex.id, {
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
      });
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, previousByExercise, energyLevel]);

  const [logByExercise, setLogByExercise] = useState<Map<string, LoggedExercise>>(initialLog);
  const [visitOrder, setVisitOrder] = useState<string[]>([startExerciseId]);
  const [showTimer, setShowTimer] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  if (!plan) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Plan nicht gefunden.</Text>
      </View>
    );
  }

  const currentExerciseId = visitOrder[visitOrder.length - 1];
  const currentExercise = allExercises.find((e) => e.id === currentExerciseId);
  const currentLog = logByExercise.get(currentExerciseId);
  const remainingExercises = allExercises.filter((e) => !visitOrder.includes(e.id));
  const isWorkoutComplete = remainingExercises.length === 0;
  const prevSets = previousByExercise.get(currentExerciseId) ?? [];

  function updateSet(setIndex: number, field: keyof LoggedSet, value: string) {
    setLogByExercise((prev) => {
      const next = new Map(prev);
      const entry = next.get(currentExerciseId);
      if (!entry) return prev;
      const numeric = parseFloat(value.replace(',', '.'));
      const sets = [...entry.sets];
      sets[setIndex] = { ...sets[setIndex], [field]: Number.isFinite(numeric) ? numeric : 0 };
      next.set(currentExerciseId, { ...entry, sets });
      return next;
    });
  }

  function handleNext() {
    if (isWorkoutComplete) {
      handleFinish();
      return;
    }
    setShowPicker(true);
  }

  function handlePickNext(exerciseId: string) {
    setVisitOrder((prev) => [...prev, exerciseId]);
    setShowPicker(false);
  }

  async function handleFinish() {
    const durationMinutes = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
    const exercisesLog = visitOrder
      .map((id) => logByExercise.get(id))
      .filter((e): e is LoggedExercise => !!e);
    const session: WorkoutSession = {
      id: makeId(),
      planId: plan!.id,
      planName: plan!.name,
      date: new Date().toISOString(),
      durationMinutes,
      exercises: exercisesLog,
    };
    await addSession(session);
    Alert.alert('Workout gespeichert', `${plan!.name} wurde in deinem Verlauf gespeichert.`);
    navigation.popToTop();
  }

  if (!currentExercise || !currentLog) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Übung nicht gefunden.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.progress}>
          Übung {visitOrder.length} von {allExercises.length}
        </Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            {currentExercise.photoUri ? (
              <Image source={{ uri: currentExercise.photoUri }} style={styles.exerciseThumb} />
            ) : (
              <View style={[styles.exerciseThumb, styles.exerciseThumbPlaceholder]}>
                <Text style={{ fontSize: 22 }}>🏋️</Text>
              </View>
            )}
            <Text style={styles.cardTitle}>{currentExercise.name}</Text>
          </View>

          {currentLog.sets.map((set, setIndex) => {
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
                      onChangeText={(v) => updateSet(setIndex, 'reps', v)}
                    />
                    <Text style={styles.setUnit}>Wdh.</Text>
                    <TextInput
                      style={styles.setInput}
                      keyboardType="numeric"
                      value={String(set.weightKg)}
                      onChangeText={(v) => updateSet(setIndex, 'weightKg', v)}
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

          <TouchableOpacity style={styles.restButton} onPress={() => setShowTimer(true)}>
            <Text style={styles.restButtonText}>⏱ Satzpause starten</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.nextButton, isWorkoutComplete && styles.nextButtonFinal]}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>
          {isWorkoutComplete ? 'Workout beenden' : 'Nächste Übung →'}
        </Text>
      </TouchableOpacity>

      <RestTimerModal
        visible={showTimer}
        totalSeconds={restSeconds}
        onClose={() => setShowTimer(false)}
      />
      <NextExercisePicker
        visible={showPicker}
        exercises={remainingExercises}
        onSelect={handlePickNext}
        onClose={() => setShowPicker(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115' },
  list: { padding: 16, paddingBottom: 96 },
  progress: { color: '#9aa0ac', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  card: { backgroundColor: '#1b1e26', borderRadius: 14, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  exerciseThumb: { width: 48, height: 48, borderRadius: 12 },
  exerciseThumbPlaceholder: {
    backgroundColor: '#0f1115',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  setBlock: { marginBottom: 12 },
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
  restButton: {
    marginTop: 8,
    backgroundColor: '#2a2f3a',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  restButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  emptyText: { color: '#9aa0ac', textAlign: 'center', marginTop: 40 },
  nextButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#ff5a3c',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonFinal: { backgroundColor: '#22c55e' },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
