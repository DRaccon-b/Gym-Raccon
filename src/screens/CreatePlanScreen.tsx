import React, { useState } from 'react';
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
import { Exercise, WorkoutPlan } from '../types';
import ExercisePhotoPicker from '../components/ExercisePhotoPicker';
import GradientButton from '../components/GradientButton';
import { colors, radius, spacing } from '../theme';
import { useSettings } from '../context/SettingsContext';
import { PLAN_TEMPLATES } from '../data/planTemplates';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePlan'>;

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function CreatePlanScreen({ navigation, route }: Props) {
  const { plans, addPlan, updatePlan } = useAppData();
  const { accent } = useSettings();
  const editingPlanId = route.params?.planId;
  const existingPlan = editingPlanId ? plans.find((p) => p.id === editingPlanId) : undefined;

  const [planName, setPlanName] = useState(existingPlan?.name ?? '');
  const [exercises, setExercises] = useState<Exercise[]>(existingPlan?.exercises ?? []);
  const [editingExerciseId, setEditingExerciseId] = useState<string | undefined>(undefined);
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);

  function applyTemplate(templateKey: string) {
    const template = PLAN_TEMPLATES.find((t) => t.key === templateKey);
    if (!template) return;

    setPlanName(template.label);
    setExercises(
      template.exercises.map((ex) => ({
        id: makeId(),
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
      }))
    );
    resetExerciseForm();
  }

  function resetExerciseForm() {
    setEditingExerciseId(undefined);
    setExerciseName('');
    setSets('3');
    setReps('10');
    setPhotoUri(undefined);
  }

  function handleSubmitExercise() {
    if (!exerciseName.trim()) return;
    const updated: Exercise = {
      id: editingExerciseId ?? makeId(),
      name: exerciseName.trim(),
      sets: parseInt(sets, 10) || 1,
      reps: parseInt(reps, 10) || 1,
      photoUri,
    };
    setExercises((prev) =>
      editingExerciseId ? prev.map((e) => (e.id === editingExerciseId ? updated : e)) : [...prev, updated]
    );
    resetExerciseForm();
  }

  function handleEditExercise(ex: Exercise) {
    setEditingExerciseId(ex.id);
    setExerciseName(ex.name);
    setSets(String(ex.sets));
    setReps(String(ex.reps));
    setPhotoUri(ex.photoUri);
  }

  function handleRemoveExercise(id: string) {
    setExercises((prev) => prev.filter((e) => e.id !== id));
    if (editingExerciseId === id) resetExerciseForm();
  }

  function handleChangeExercisePhoto(id: string, uri: string | undefined) {
    setExercises((prev) => prev.map((e) => (e.id === id ? { ...e, photoUri: uri } : e)));
  }

  async function handleSavePlan() {
    if (!planName.trim()) {
      Alert.alert('Name fehlt', 'Bitte gib deinem Plan einen Namen.');
      return;
    }
    if (exercises.length === 0) {
      Alert.alert('Keine Übungen', 'Füge mindestens eine Übung hinzu.');
      return;
    }
    if (existingPlan) {
      await updatePlan({ ...existingPlan, name: planName.trim(), exercises });
    } else {
      const plan: WorkoutPlan = {
        id: makeId(),
        name: planName.trim(),
        exercises,
        createdAt: new Date().toISOString(),
      };
      await addPlan(plan);
    }
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[styles.label, { marginTop: 0 }]}>Plan-Name</Text>
      <TextInput
        style={styles.input}
        placeholder="z. B. Push Day"
        placeholderTextColor="#6b7280"
        value={planName}
        onChangeText={setPlanName}
      />

      <Text style={styles.sectionTitle}>Übungen</Text>
      {exercises.map((ex) => (
        <View
          key={ex.id}
          style={[
            styles.exerciseRow,
            editingExerciseId === ex.id && { borderColor: accent.color },
          ]}
        >
          <ExercisePhotoPicker
            photoUri={ex.photoUri}
            onChange={(uri) => handleChangeExercisePhoto(ex.id, uri)}
          />
          <TouchableOpacity style={{ flex: 1, marginLeft: 12 }} onPress={() => handleEditExercise(ex)}>
            <Text style={styles.exerciseText}>
              {ex.name} — {ex.sets}×{ex.reps}
            </Text>
            <Text style={styles.editHint}>Antippen zum Bearbeiten</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRemoveExercise(ex.id)}>
            <Text style={[styles.removeText, { color: accent.color }]}>Entfernen</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.addExerciseBox}>
        {editingExerciseId && (
          <View style={[styles.editingBanner, { backgroundColor: accent.glow }]}>
            <Text style={[styles.editingBannerText, { color: accent.color }]}>
              Übung wird bearbeitet
            </Text>
            <TouchableOpacity onPress={resetExerciseForm}>
              <Text style={styles.editingBannerCancel}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.row}>
          <ExercisePhotoPicker photoUri={photoUri} onChange={setPhotoUri} size={64} />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Übungsname (z. B. Bankdrücken)"
            placeholderTextColor="#6b7280"
            value={exerciseName}
            onChangeText={setExerciseName}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Sätze</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={sets}
              onChangeText={setSets}
            />
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Wdh.</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={reps}
              onChangeText={setReps}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleSubmitExercise}>
          <Text style={styles.addButtonText}>
            {editingExerciseId ? 'Übung aktualisieren' : '+ Übung hinzufügen'}
          </Text>
        </TouchableOpacity>
      </View>

      {!existingPlan && (
        <View>
          <Text style={styles.sectionTitle}>Vorlage verwenden (optional)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateRow}>
            {PLAN_TEMPLATES.map((template) => (
              <TouchableOpacity
                key={template.key}
                style={styles.templateChip}
                onPress={() => applyTemplate(template.key)}
              >
                <Text style={styles.templateEmoji}>{template.emoji}</Text>
                <Text style={styles.templateLabel}>{template.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <GradientButton
        label={existingPlan ? 'Änderungen speichern' : 'Plan speichern'}
        onPress={handleSavePlan}
        style={{ marginTop: spacing.xl }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 48 },
  label: { color: colors.textSecondary, fontSize: 13, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 8 },
  templateRow: { flexGrow: 0, marginBottom: 8 },
  templateChip: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 88,
  },
  templateEmoji: { fontSize: 22, marginBottom: 4 },
  templateLabel: { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  exerciseText: { color: colors.textPrimary, fontSize: 15 },
  editHint: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  removeText: { fontSize: 13, fontWeight: '600' },
  addExerciseBox: {
    marginTop: 12,
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editingBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  editingBannerText: { fontSize: 13, fontWeight: '600' },
  editingBannerCancel: { color: colors.textSecondary, fontSize: 13 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 12 },
  rowItem: { flex: 1 },
  addButton: {
    marginTop: 12,
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.sm,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  addButtonText: { color: colors.textPrimary, fontWeight: '600' },
});
