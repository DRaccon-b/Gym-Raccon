import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppData } from '../context/AppDataContext';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

export default function HistoryScreen() {
  const { sessions, deleteSession } = useAppData();

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Noch keine Workouts absolviert.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const totalSets = item.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
          return (
            <TouchableOpacity style={styles.card} onLongPress={() => deleteSession(item.id)}>
              <Text style={styles.cardTitle}>{item.planName}</Text>
              <Text style={styles.cardSubtitle}>{formatDate(item.date)}</Text>
              <Text style={styles.cardMeta}>
                {item.exercises.length} Übungen · {totalSets} Sätze
                {item.durationMinutes ? ` · ${item.durationMinutes} min` : ''}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115' },
  list: { padding: 16 },
  card: { backgroundColor: '#1b1e26', borderRadius: 14, padding: 16, marginBottom: 12 },
  cardTitle: { color: '#fff', fontSize: 17, fontWeight: '600' },
  cardSubtitle: { color: '#9aa0ac', fontSize: 13, marginTop: 4 },
  cardMeta: { color: '#6b7280', fontSize: 13, marginTop: 6 },
  empty: { marginTop: 80, alignItems: 'center' },
  emptyText: { color: '#9aa0ac', fontSize: 15 },
});
