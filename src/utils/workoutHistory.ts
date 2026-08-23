import { LoggedExercise, WorkoutSession } from '../types';

export type EnergyLevel = 'good' | 'weak' | 'bad';

export const WEIGHT_STEP_KG = 2.5;

export function adjustWeightForEnergy(weightKg: number, energy: EnergyLevel): number {
  if (weightKg <= 0) return weightKg;
  if (energy === 'good') return Math.round((weightKg + WEIGHT_STEP_KG) * 10) / 10;
  if (energy === 'bad') return Math.max(0, Math.round((weightKg - WEIGHT_STEP_KG) * 10) / 10);
  return weightKg;
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
