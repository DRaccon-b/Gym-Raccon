import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
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
import NumberStepperInput from '../components/NumberStepperInput';
import GradientButton from '../components/GradientButton';
import Card from '../components/Card';
import { colors, radius, spacing } from '../theme';

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

  function updateSet(setIndex: number, field: keyof LoggedSet, value: number) {
    setLogByExercise((prev) => {
      const next = new Map(prev);
      const entry = next.get(currentExerciseId);
      if (!entry) return prev;
      const sets = [...entry.sets];
      sets[setIndex] = { ...sets[setIndex], [field]: value };
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

        <Card>
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
                <View style={styles.setHeaderRow}>
                  <Text style={styles.setLabel}>Satz {setIndex + 1}</Text>
                  <Text style={styles.prevText}>
                    {prev
                      ? `Letztes Mal: ${prev.weightKg} kg × ${prev.reps} Wdh.`
                      : 'Letztes Mal: keine Daten'}
                  </Text>
                </View>
                <View style={styles.setInputs}>
                  <NumberStepperInput
                    value={set.reps}
                    onChange={(v) => updateSet(setIndex, 'reps', v)}
                    step={1}
                    min={0}
                    suffix="Wdh."
                  />
                  <NumberStepperInput
                    value={set.weightKg}
                    onChange={(v) => updateSet(setIndex, 'weightKg', v)}
                    step={2.5}
                    min={0}
                    suffix="kg"
                    decimals={2}
                  />
                </View>
              </View>
            );
          })}

          <TouchableOpacity style={styles.restButton} onPress={() => setShowTimer(true)}>
            <Text style={styles.restButtonText}>⏱ Satzpause starten</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>

      <GradientButton
        label={isWorkoutComplete ? 'Workout beenden' : 'Nächste Übung →'}
        variant={isWorkoutComplete ? 'success' : 'accent'}
        onPress={handleNext}
        style={styles.nextButton}
      />

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
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md, paddingBottom: 110 },
  progress: { color: colors.textSecondary, fontSize: 13, marginBottom: 12, textAlign: 'center', fontWeight: '600' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  exerciseThumb: { width: 48, height: 48, borderRadius: radius.md },
  exerciseThumbPlaceholder: {
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '800' },
  setBlock: {
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  setHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  setLabel: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
  setInputs: { flexDirection: 'row', gap: 12 },
  prevText: { color: colors.textMuted, fontSize: 12 },
  restButton: {
    marginTop: 8,
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  restButtonText: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: 40 },
  nextButton: {
    position: 'absolute',
    bottom: 24,
    left: spacing.md,
    right: spacing.md,
  },
});
