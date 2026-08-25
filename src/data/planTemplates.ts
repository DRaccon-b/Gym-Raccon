export type TemplateExercise = { name: string; sets: number; reps: number };

export type PlanTemplate = {
  key: string;
  label: string;
  emoji: string;
  exercises: TemplateExercise[];
};

export const PLAN_TEMPLATES: PlanTemplate[] = [
  {
    key: 'push',
    label: 'Push',
    emoji: '💪',
    exercises: [
      { name: 'Bankdrücken', sets: 4, reps: 8 },
      { name: 'Schulterdrücken', sets: 3, reps: 10 },
      { name: 'Trizepsdrücken am Kabel', sets: 3, reps: 12 },
      { name: 'Seitheben', sets: 3, reps: 15 },
    ],
  },
  {
    key: 'pull',
    label: 'Pull',
    emoji: '🏋️',
    exercises: [
      { name: 'Klimmzüge', sets: 4, reps: 8 },
      { name: 'Rudern vorgebeugt', sets: 4, reps: 10 },
      { name: 'Latzug', sets: 3, reps: 10 },
      { name: 'Bizepscurls', sets: 3, reps: 12 },
    ],
  },
  {
    key: 'leg',
    label: 'Leg',
    emoji: '🦵',
    exercises: [
      { name: 'Kniebeugen', sets: 4, reps: 8 },
      { name: 'Beinpresse', sets: 3, reps: 10 },
      { name: 'Beinbeuger', sets: 3, reps: 12 },
      { name: 'Wadenheben', sets: 4, reps: 15 },
    ],
  },
  {
    key: 'upper',
    label: 'Oberkörper',
    emoji: '🫁',
    exercises: [
      { name: 'Bankdrücken', sets: 4, reps: 8 },
      { name: 'Rudern vorgebeugt', sets: 4, reps: 10 },
      { name: 'Schulterdrücken', sets: 3, reps: 10 },
      { name: 'Bizepscurls', sets: 3, reps: 12 },
    ],
  },
  {
    key: 'lower',
    label: 'Unterkörper',
    emoji: '🦿',
    exercises: [
      { name: 'Kniebeugen', sets: 4, reps: 8 },
      { name: 'Kreuzheben', sets: 3, reps: 8 },
      { name: 'Ausfallschritte', sets: 3, reps: 12 },
      { name: 'Wadenheben', sets: 4, reps: 15 },
    ],
  },
  {
    key: 'fullbody',
    label: 'Ganzkörper',
    emoji: '⚡',
    exercises: [
      { name: 'Kniebeugen', sets: 3, reps: 10 },
      { name: 'Bankdrücken', sets: 3, reps: 10 },
      { name: 'Rudern vorgebeugt', sets: 3, reps: 10 },
      { name: 'Schulterdrücken', sets: 3, reps: 10 },
    ],
  },
];
