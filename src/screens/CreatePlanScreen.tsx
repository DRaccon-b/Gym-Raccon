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

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePlan'>;

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function CreatePlanScreen({ navigation, route }: Props) {
  const { plans, addPlan, updatePlan } = useAppData();
  const editingPlanId = route.params?.planId;
  const existingPlan = editingPlanId ? plans.find((p) => p.id === editingPlanId) : undefined;

  const [planName, setPlanName] = useState(existingPlan?.name ?? '');
  const [exercises, setExercises] = useState<Exercise[]>(existingPlan?.exercises ?? []);
  const [editingExerciseId, setEditingExerciseId] = useState<string | undefined>(undefined);
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);

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
      <Text style={styles.label}>Plan-Name</Text>
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
          style={[styles.exerciseRow, editingExerciseId === ex.id && styles.exerciseRowEditing]}
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
            <Text style={styles.removeText}>Entfernen</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.addExerciseBox}>
        {editingExerciseId && (
          <View style={styles.editingBanner}>
            <Text style={styles.editingBannerText}>Übung wird bearbeitet</Text>
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

      <TouchableOpacity style={styles.saveButton} onPress={handleSavePlan}>
        <Text style={styles.saveButtonText}>
          {existingPlan ? 'Änderungen speichern' : 'Plan speichern'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115' },
  content: { padding: 16, paddingBottom: 48 },
  label: { color: '#9aa0ac', fontSize: 13, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#1b1e26',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 8 },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1b1e26',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  exerciseRowEditing: { borderColor: '#ff5a3c' },
  exerciseText: { color: '#fff', fontSize: 15 },
  editHint: { color: '#6b7280', fontSize: 11, marginTop: 2 },
  removeText: { color: '#ff5a3c', fontSize: 13, fontWeight: '600' },
  addExerciseBox: { marginTop: 12, backgroundColor: '#151821', borderRadius: 12, padding: 12 },
  editingBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a1e1a',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  editingBannerText: { color: '#ff5a3c', fontSize: 13, fontWeight: '600' },
  editingBannerCancel: { color: '#9aa0ac', fontSize: 13 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 12 },
  rowItem: { flex: 1 },
  addButton: {
    marginTop: 12,
    backgroundColor: '#2a2f3a',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: '600' },
  saveButton: {
    marginTop: 32,
    backgroundColor: '#ff5a3c',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
