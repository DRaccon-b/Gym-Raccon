import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useAppData } from '../context/AppDataContext';
import { getExerciseProgress, getLoggedExerciseNames } from '../utils/workoutHistory';
import LineChart from '../components/LineChart';
import Card from '../components/Card';
import { colors, radius, spacing, typography } from '../theme';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
}

export default function ProgressScreen() {
  const { sessions } = useAppData();
  const { width } = useWindowDimensions();
  const exerciseNames = useMemo(() => getLoggedExerciseNames(sessions), [sessions]);
  const [selected, setSelected] = useState<string | undefined>(exerciseNames[0]);

  const activeName = selected && exerciseNames.includes(selected) ? selected : exerciseNames[0];
  const progress = useMemo(
    () => (activeName ? getExerciseProgress(activeName, sessions) : []),
    [activeName, sessions]
  );

  if (exerciseNames.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Noch keine Trainingsdaten.</Text>
          <Text style={styles.emptySubtext}>
            Sobald du ein Workout absolviert hast, siehst du hier deinen Fortschritt.
          </Text>
        </View>
      </View>
    );
  }

  const latest = progress[progress.length - 1];
  const first = progress[0];
  const diff = latest && first ? latest.maxWeight - first.maxWeight : 0;

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {exerciseNames.map((name) => (
          <TouchableOpacity
            key={name}
            style={[styles.chip, name === activeName && styles.chipSelected]}
            onPress={() => setSelected(name)}
          >
            <Text style={[styles.chipText, name === activeName && styles.chipTextSelected]}>
              {name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content}>
        {progress.length === 0 ? (
          <Text style={styles.emptyText}>Keine Daten für diese Übung.</Text>
        ) : (
          <>
            <Card style={styles.statsRow}>
              <View>
                <Text style={styles.statLabel}>Aktuell</Text>
                <Text style={styles.statValue}>{latest.maxWeight} kg</Text>
              </View>
              {progress.length > 1 && (
                <View>
                  <Text style={styles.statLabel}>Veränderung</Text>
                  <Text
                    style={[
                      styles.statValue,
                      diff > 0 ? styles.statUp : diff < 0 ? styles.statDown : undefined,
                    ]}
                  >
                    {diff > 0 ? '+' : ''}
                    {diff} kg
                  </Text>
                </View>
              )}
              <View>
                <Text style={styles.statLabel}>Workouts</Text>
                <Text style={styles.statValue}>{progress.length}</Text>
              </View>
            </Card>

            <Card>
              <Text style={styles.chartTitle}>Gewicht &amp; Wiederholungen im Top-Satz</Text>
              <LineChart
                series={[
                  { values: progress.map((p) => p.maxWeight), color: colors.accent },
                  { values: progress.map((p) => p.topSetReps), color: colors.success },
                ]}
                width={width - 64}
              />
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
                  <Text style={styles.legendText}>Gewicht ({latest.maxWeight} kg)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
                  <Text style={styles.legendText}>Wiederholungen ({latest.topSetReps})</Text>
                </View>
              </View>
            </Card>

            <View style={styles.historyList}>
              {[...progress].reverse().map((p, i) => (
                <View key={i} style={styles.historyRow}>
                  <Text style={styles.historyDate}>{formatDate(p.date)}</Text>
                  <Text style={styles.historyValue}>
                    {p.maxWeight} kg × {p.topSetReps} Wdh.
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  chipRow: { flexGrow: 0, paddingVertical: 12, paddingLeft: 16 },
  chip: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
  chipTextSelected: { color: colors.textPrimary },
  content: { padding: spacing.md, paddingTop: 4, gap: spacing.md },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: { ...typography.label },
  statValue: { color: colors.textPrimary, fontSize: 18, fontWeight: '800', marginTop: 4 },
  statUp: { color: colors.success },
  statDown: { color: colors.danger },
  chartTitle: { ...typography.subtitle, marginBottom: 8 },
  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  historyList: { marginTop: 8 },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  historyDate: { color: colors.textSecondary, fontSize: 14 },
  historyValue: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  empty: { marginTop: 80, alignItems: 'center', paddingHorizontal: 32 },
  emptyText: { ...typography.title, textAlign: 'center' },
  emptySubtext: { ...typography.body, marginTop: 8, textAlign: 'center' },
});
