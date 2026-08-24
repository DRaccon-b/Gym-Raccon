import type { EnergyLevel } from '../utils/workoutHistory';

export type RootStackParamList = {
  Plans: undefined;
  CreatePlan: { planId?: string } | undefined;
  PlanDetail: { planId: string };
  StartWorkout: { planId: string };
  ActiveWorkout: { planId: string; startExerciseId: string; energyLevel: EnergyLevel };
  History: undefined;
};
