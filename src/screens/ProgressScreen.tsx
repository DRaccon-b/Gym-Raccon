import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useAppData } from '../context/AppDataContext';
import { useSettings } from '../context/SettingsContext';
import {
  getExerciseProgress,
  getLoggedExerciseNames,
  getTotalVolume,
  VolumePeriod,
} from '../utils/workoutHistory';
import LineChart from '../components/LineChart';
import Card from '../components/Card';
import { colors, radius, spacing, typography } from '../theme';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
}

function formatVolume(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1).replace(/\.0$/, '')} t`;
  return `${Math.round(kg)} kg`;
}

const VOLUME_PERIODS: { value: VolumePeriod; label: string }[] = [
  { value: 'session', label: 'Letztes Workout' },
  { value: 'week', label: '7 Tage' },
  { value: 'month', label: '30 Tage' },
  { value: 'all', label: 'Gesamt' },
];

export default function ProgressScreen() {
  const { sessions } = useAppData();
  const { showVolume, accent } = useSettings();
  const { width } = useWindowDimensions();
  const exerciseNames = useMemo(() => getLoggedExerciseNames(sessions), [sessions]);
  const [selected, setSelected] = useState<string | undefined>(exerciseNames[0]);
  const [volumePeriod, setVolumePeriod] = useState<VolumePeriod>('week');
  const totalVolume = useMemo(
    () => getTotalVolume(sessions, volumePeriod),
    [sessions, volumePeriod]
  );

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
            style={[
              styles.chip,
              name === activeName && { backgroundColor: accent.color, borderColor: accent.color },
            ]}
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
              <View>
                <Text style={styles.statLabel}>Sätze</Text>
                <Text style={styles.statValue}>{latest.setsCount}</Text>
              </View>
            </Card>

            <Card>
              <Text style={styles.chartTitle}>Gewicht &amp; Wiederholungen im Top-Satz</Text>
              <LineChart
                series={[
                  { values: progress.map((p) => p.maxWeight), color: accent.color },
                  { values: progress.map((p) => p.topSetReps), color: colors.success },
                ]}
                width={width - 64}
              />
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: accent.color }]} />
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
                    {p.maxWeight} kg × {p.topSetReps} Wdh. · {p.setsCount} Sätze
                  </Text>
                </View>
              ))}
            </View>

            {showVolume && (
              <View style={styles.volumeCompact}>
                <Text style={styles.volumeCompactLabel}>Bewegtes Gewicht</Text>
                <View style={styles.volumeCompactRow}>
                  <Text style={styles.volumeCompactValue}>{formatVolume(totalVolume)}</Text>
                  <View style={styles.volumeChipRowCompact}>
                    {VOLUME_PERIODS.map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        style={[
                          styles.volumeChipCompact,
                          volumePeriod === opt.value && {
                            backgroundColor: accent.color,
                            borderColor: accent.color,
                          },
                        ]}
                        onPress={() => setVolumePeriod(opt.value)}
                      >
                        <Text
                          style={[
                            styles.volumeChipTextCompact,
                            volumePeriod === opt.value && styles.volumeChipTextSelected,
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  volumeCompact: {
    marginTop: 4,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surface,
  },
  volumeCompactLabel: { ...typography.label, marginBottom: 6 },
  volumeCompactRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  volumeCompactValue: { color: colors.textSecondary, fontSize: 15, fontWeight: '700' },
  volumeChipRowCompact: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', flex: 1 },
  volumeChipCompact: {
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  volumeChipTextCompact: { color: colors.textMuted, fontSize: 10, fontWeight: '600' },
  volumeChipTextSelected: { color: colors.textPrimary },
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
  chipText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
  chipTextSelected: { color: colors.textPrimary },
  content: { padding: spacing.md, paddingTop: 4, gap: spacing.md },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    rowGap: 12,
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
