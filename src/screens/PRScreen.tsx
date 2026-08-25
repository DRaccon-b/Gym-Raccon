import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useAppData } from '../context/AppDataContext';
import { useSettings } from '../context/SettingsContext';
import { getPersonalRecords } from '../utils/workoutHistory';
import { radius, spacing, Colors, Typography } from '../theme';
import Card from '../components/Card';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function PRScreen() {
  const { sessions } = useAppData();
  const { accent, colors, typography } = useSettings();
  const styles = useMemo(() => makeStyles(colors, typography), [colors, typography]);
  const records = useMemo(() => getPersonalRecords(sessions), [sessions]);

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        keyExtractor={(item) => item.exerciseName}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Noch keine Trainingsdaten.</Text>
            <Text style={styles.emptySubtext}>
              Sobald du eine Übung mit Gewicht loggst, erscheint hier dein persönlicher Rekord.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.exerciseName}>{item.exerciseName}</Text>
              <Text style={styles.recordDate}>{formatDate(item.date)}</Text>
            </View>
            <View style={styles.recordValue}>
              <Text style={[styles.recordWeight, { color: accent.color }]}>{item.maxWeight} kg</Text>
              <Text style={styles.recordReps}>× {item.reps} Wdh.</Text>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

function makeStyles(colors: Colors, typography: Typography) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    list: { padding: spacing.md },
    cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
    exerciseName: { ...typography.title, fontSize: 16 },
    recordDate: { ...typography.body, marginTop: 4 },
    recordValue: { alignItems: 'flex-end', marginLeft: spacing.sm },
    recordWeight: { fontSize: 20, fontWeight: '800' },
    recordReps: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
    empty: { marginTop: 80, alignItems: 'center', paddingHorizontal: 32 },
    emptyText: { ...typography.title, textAlign: 'center' },
    emptySubtext: { ...typography.body, marginTop: 8, textAlign: 'center' },
  });
}
