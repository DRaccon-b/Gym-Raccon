import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppData } from '../context/AppDataContext';
import { APP_VERSION } from '../constants/version';

type Props = NativeStackScreenProps<RootStackParamList, 'Plans'>;

export default function PlansScreen({ navigation }: Props) {
  const { plans, deletePlan } = useAppData();

  return (
    <View style={styles.container}>
      <Text style={styles.version}>{APP_VERSION}</Text>
      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Noch keine Trainingspläne.</Text>
            <Text style={styles.emptySubtext}>Erstelle deinen ersten Plan mit dem Button unten.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PlanDetail', { planId: item.id })}
            onLongPress={() => deletePlan(item.id)}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>{item.exercises.length} Übungen</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreatePlan')}>
        <Text style={styles.fabText}>+ Neuer Plan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115' },
  version: { color: '#6b7280', fontSize: 12, textAlign: 'center', paddingTop: 8 },
  list: { padding: 16, paddingBottom: 96 },
  card: {
    backgroundColor: '#1b1e26',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  cardSubtitle: { color: '#9aa0ac', fontSize: 14, marginTop: 4 },
  empty: { marginTop: 80, alignItems: 'center', paddingHorizontal: 32 },
  emptyText: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
  emptySubtext: { color: '#9aa0ac', fontSize: 14, marginTop: 8, textAlign: 'center' },
  fab: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#ff5a3c',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  fabText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
