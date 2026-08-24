import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useAppData } from '../context/AppDataContext';
import { dateKey, getCurrentStreak, getTrainedDateKeys } from '../utils/workoutHistory';

const WEEKDAY_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const MONTH_LABELS = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

type DayCell = { date: Date | null; key: string };

function buildMonthGrid(year: number, month: number): DayCell[][] {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7; // Monday-first

  const cells: DayCell[] = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push({ date: null, key: `blank-${i}` });
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    cells.push({ date, key: dateKey(date) });
  }
  while (cells.length % 7 !== 0) cells.push({ date: null, key: `blank-end-${cells.length}` });

  const weeks: DayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export default function StreakScreen() {
  const { sessions } = useAppData();
  const { width } = useWindowDimensions();
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const trainedDates = useMemo(() => getTrainedDateKeys(sessions), [sessions]);
  const currentStreak = useMemo(() => getCurrentStreak(sessions), [sessions]);

  const weeks = useMemo(
    () => buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate]
  );

  const trainedThisMonth = useMemo(
    () =>
      weeks
        .flat()
        .filter((cell) => cell.date && trainedDates.has(cell.key)).length,
    [weeks, trainedDates]
  );

  const todayKey = dateKey(today);
  const cellSize = (width - 32 - 6 * 8) / 7;

  function goToPrevMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  function goToNextMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>🔥 {currentStreak}</Text>
          <Text style={styles.statLabel}>Tage in Folge</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{trainedThisMonth}</Text>
          <Text style={styles.statLabel}>Diesen Monat</Text>
        </View>
      </View>

      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={goToPrevMonth} style={styles.monthNavButton}>
          <Text style={styles.monthNavText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {MONTH_LABELS[viewDate.getMonth()]} {viewDate.getFullYear()}
        </Text>
        <TouchableOpacity onPress={goToNextMonth} style={styles.monthNavButton}>
          <Text style={styles.monthNavText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label) => (
          <Text key={label} style={[styles.weekdayLabel, { width: cellSize }]}>
            {label}
          </Text>
        ))}
      </View>

      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((cell) => {
            if (!cell.date) {
              return <View key={cell.key} style={{ width: cellSize, height: cellSize }} />;
            }
            const trained = trainedDates.has(cell.key);
            const isToday = cell.key === todayKey;
            return (
              <View
                key={cell.key}
                style={[
                  styles.dayCell,
                  { width: cellSize, height: cellSize },
                  trained && styles.dayCellTrained,
                  isToday && styles.dayCellToday,
                ]}
              >
                <Text style={[styles.dayNumber, trained && styles.dayNumberTrained]}>
                  {cell.date.getDate()}
                </Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115', padding: 16 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: '#1b1e26',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  statValue: { color: '#fff', fontSize: 22, fontWeight: '700' },
  statLabel: { color: '#9aa0ac', fontSize: 12, marginTop: 4 },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  monthNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1b1e26',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  monthTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  weekdayRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  weekdayLabel: { color: '#6b7280', fontSize: 12, textAlign: 'center' },
  weekRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  dayCell: {
    backgroundColor: '#1b1e26',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellTrained: { backgroundColor: '#ff5a3c' },
  dayCellToday: { borderWidth: 2, borderColor: '#fff' },
  dayNumber: { color: '#6b7280', fontSize: 11, fontWeight: '600' },
  dayNumberTrained: { color: '#fff' },
});
