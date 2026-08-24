import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppData } from '../context/AppDataContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PlanDetail'>;

export default function PlanDetailScreen({ route, navigation }: Props) {
  const { planId } = route.params;
  const { plans } = useAppData();
  const plan = plans.find((p) => p.id === planId);

  if (!plan) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Plan nicht gefunden.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={plan.exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{plan.name}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('CreatePlan', { planId: plan.id })}
            >
              <Text style={styles.editButtonText}>Bearbeiten</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, styles.cardRow]}>
            {item.photoUri ? (
              <Image source={{ uri: item.photoUri }} style={styles.thumb} />
            ) : (
              <View style={[styles.thumb, styles.thumbPlaceholder]}>
                <Text style={{ fontSize: 22 }}>🏋️</Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>
                {item.sets} Sätze × {item.reps} Wiederholungen
              </Text>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('StartWorkout', { planId: plan.id })}
      >
        <Text style={styles.startButtonText}>Workout starten</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115' },
  list: { padding: 16, paddingBottom: 96 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  editButton: {
    backgroundColor: '#1b1e26',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  editButtonText: { color: '#ff5a3c', fontSize: 13, fontWeight: '600' },
  card: { backgroundColor: '#1b1e26', borderRadius: 14, padding: 16, marginBottom: 10 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 48, height: 48, borderRadius: 12 },
  thumbPlaceholder: { backgroundColor: '#0f1115', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cardSubtitle: { color: '#9aa0ac', fontSize: 14, marginTop: 4 },
  emptyText: { color: '#9aa0ac', textAlign: 'center', marginTop: 40 },
  startButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#ff5a3c',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
