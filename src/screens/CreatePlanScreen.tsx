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

export default function CreatePlanScreen({ navigation }: Props) {
  const { addPlan } = useAppData();
  const [planName, setPlanName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);

  function handleAddExercise() {
    if (!exerciseName.trim()) return;
    setExercises((prev) => [
      ...prev,
      {
        id: makeId(),
        name: exerciseName.trim(),
        sets: parseInt(sets, 10) || 1,
        reps: parseInt(reps, 10) || 1,
        photoUri,
      },
    ]);
    setExerciseName('');
    setSets('3');
    setReps('10');
    setPhotoUri(undefined);
  }

  function handleRemoveExercise(id: string) {
    setExercises((prev) => prev.filter((e) => e.id !== id));
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
    const plan: WorkoutPlan = {
      id: makeId(),
      name: planName.trim(),
      exercises,
      createdAt: new Date().toISOString(),
    };
    await addPlan(plan);
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
        <View key={ex.id} style={styles.exerciseRow}>
          <ExercisePhotoPicker
            photoUri={ex.photoUri}
            onChange={(uri) => handleChangeExercisePhoto(ex.id, uri)}
          />
          <Text style={[styles.exerciseText, { flex: 1, marginLeft: 12 }]}>
            {ex.name} — {ex.sets}×{ex.reps}
          </Text>
          <TouchableOpacity onPress={() => handleRemoveExercise(ex.id)}>
            <Text style={styles.removeText}>Entfernen</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.addExerciseBox}>
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
        <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
          <Text style={styles.addButtonText}>+ Übung hinzufügen</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSavePlan}>
        <Text style={styles.saveButtonText}>Plan speichern</Text>
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
  },
  exerciseText: { color: '#fff', fontSize: 15 },
  removeText: { color: '#ff5a3c', fontSize: 13, fontWeight: '600' },
  addExerciseBox: { marginTop: 12, backgroundColor: '#151821', borderRadius: 12, padding: 12 },
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
