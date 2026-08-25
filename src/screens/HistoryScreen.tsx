import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppData } from '../context/AppDataContext';
import { spacing, Colors, Typography } from '../theme';
import { useSettings } from '../context/SettingsContext';
import Card from '../components/Card';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

export default function HistoryScreen() {
  const { sessions, deleteSession } = useAppData();
  const { colors, typography } = useSettings();
  const styles = useMemo(() => makeStyles(colors, typography), [colors, typography]);

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
            <TouchableOpacity activeOpacity={0.8} onLongPress={() => deleteSession(item.id)}>
              <Card style={styles.cardSpacing}>
                <Text style={styles.cardTitle}>{item.planName}</Text>
                <Text style={styles.cardSubtitle}>{formatDate(item.date)}</Text>
                <Text style={styles.cardMeta}>
                  {item.exercises.length} Übungen · {totalSets} Sätze
                  {item.durationMinutes ? ` · ${item.durationMinutes} min` : ''}
                </Text>
              </Card>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

function makeStyles(colors: Colors, typography: Typography) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    list: { padding: spacing.md },
    cardSpacing: { marginBottom: spacing.sm },
    cardTitle: { ...typography.title, fontSize: 17 },
    cardSubtitle: { ...typography.body, marginTop: 4 },
    cardMeta: { color: colors.textMuted, fontSize: 13, marginTop: 6 },
    empty: { marginTop: 80, alignItems: 'center' },
    emptyText: { color: colors.textSecondary, fontSize: 15 },
  });
}
