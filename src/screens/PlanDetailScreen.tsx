import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppData } from '../context/AppDataContext';
import { radius, spacing, Colors, Typography } from '../theme';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';
import { useSettings } from '../context/SettingsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PlanDetail'>;

export default function PlanDetailScreen({ route, navigation }: Props) {
  const { planId } = route.params;
  const { plans } = useAppData();
  const { accent, colors, typography } = useSettings();
  const styles = useMemo(() => makeStyles(colors, typography), [colors, typography]);
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
              <Text style={[styles.editButtonText, { color: accent.color }]}>Bearbeiten</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.cardRow}>
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
                {item.weightKg ? ` · ${item.weightKg} kg` : ''}
              </Text>
            </View>
          </Card>
        )}
      />
      <GradientButton
        label="Workout starten"
        onPress={() => navigation.navigate('StartWorkout', { planId: plan.id })}
        style={styles.startButton}
      />
    </View>
  );
}

function makeStyles(colors: Colors, typography: Typography) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md, paddingBottom: 110 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: { ...typography.screenTitle },
  editButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editButtonText: { fontSize: 13, fontWeight: '700' },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  thumb: { width: 48, height: 48, borderRadius: radius.md },
  thumbPlaceholder: {
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { ...typography.title, fontSize: 16 },
  cardSubtitle: { ...typography.body, marginTop: 4 },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: 40 },
  startButton: {
    position: 'absolute',
    bottom: 24,
    left: spacing.md,
    right: spacing.md,
  },
  });
}
