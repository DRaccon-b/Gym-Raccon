import { LoggedExercise, WorkoutSession } from '../types';

export type EnergyLevel = 'good' | 'weak' | 'bad';

export const WEIGHT_STEP_KG = 2.5;

export function adjustWeightForEnergy(weightKg: number, energy: EnergyLevel): number {
  if (weightKg <= 0) return weightKg;
  if (energy === 'good') return Math.round((weightKg + WEIGHT_STEP_KG) * 10) / 10;
  if (energy === 'bad') return Math.max(0, Math.round((weightKg - WEIGHT_STEP_KG) * 10) / 10);
  return weightKg;
}

export type ProgressPoint = {
  date: string;
  maxWeight: number;
  topSetReps: number;
  totalVolume: number;
};

export function getLoggedExerciseNames(sessions: WorkoutSession[]): string[] {
  const names = new Set<string>();
  sessions.forEach((session) => session.exercises.forEach((ex) => names.add(ex.name)));
  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

export function getExerciseProgress(
  exerciseName: string,
  sessions: WorkoutSession[]
): ProgressPoint[] {
  const points: ProgressPoint[] = [];
  sessions.forEach((session) => {
    const match = session.exercises.find((ex) => ex.name === exerciseName);
    if (!match || match.sets.length === 0) return;
    const maxWeight = Math.max(...match.sets.map((s) => s.weightKg));
    const topSet = match.sets.find((s) => s.weightKg === maxWeight) ?? match.sets[0];
    const totalVolume = match.sets.reduce((sum, s) => sum + s.weightKg * s.reps, 0);
    points.push({ date: session.date, maxWeight, topSetReps: topSet.reps, totalVolume });
  });
  return points.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTrainedDateKeys(sessions: WorkoutSession[]): Set<string> {
  return new Set(sessions.map((s) => dateKey(new Date(s.date))));
}

export function getCurrentStreak(sessions: WorkoutSession[]): number {
  const trained = getTrainedDateKeys(sessions);
  const cursor = new Date();
  if (!trained.has(dateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while (trained.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export { dateKey };

export function findLastLoggedExercise(
  exerciseName: string,
  sessions: WorkoutSession[]
): LoggedExercise | undefined {
  const sorted = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  for (const session of sorted) {
    const match = session.exercises.find((ex) => ex.name === exerciseName);
    if (match) return match;
  }
  return undefined;
}
