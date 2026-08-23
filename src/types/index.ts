export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weightKg?: number;
};

export type WorkoutPlan = {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: string;
};

export type LoggedSet = {
  reps: number;
  weightKg: number;
};

export type LoggedExercise = {
  exerciseId: string;
  name: string;
  sets: LoggedSet[];
};

export type WorkoutSession = {
  id: string;
  planId?: string;
  planName: string;
  date: string;
  durationMinutes?: number;
  exercises: LoggedExercise[];
};
