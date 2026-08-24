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
    const totalVolume = match.sets.reduce((sum, s) => sum + s.weightKg * s.reps, 0);
    points.push({ date: session.date, maxWeight, totalVolume });
  });
  return points.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

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
