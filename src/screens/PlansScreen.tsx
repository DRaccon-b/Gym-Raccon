import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppData } from '../context/AppDataContext';
import { APP_VERSION } from '../constants/version';
import { colors, radius, spacing, typography, shadow } from '../theme';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Plans'>;

export default function PlansScreen({ navigation }: Props) {
  const { plans, deletePlan } = useAppData();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Deine Pläne</Text>
        <Text style={styles.version}>{APP_VERSION}</Text>
      </View>
      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Text style={{ fontSize: 32 }}>🏋️</Text>
            </View>
            <Text style={styles.emptyText}>Noch keine Trainingspläne</Text>
            <Text style={styles.emptySubtext}>Erstelle deinen ersten Plan mit dem Button unten.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('PlanDetail', { planId: item.id })}
            onLongPress={() => deletePlan(item.id)}
          >
            <Card style={styles.cardRow}>
              <View style={styles.cardIcon}>
                <Text style={{ fontSize: 20 }}>🔥</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>{item.exercises.length} Übungen</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
      <GradientButton
        label="+ Neuer Plan"
        onPress={() => navigation.navigate('CreatePlan')}
        style={styles.fab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  headerTitle: { ...typography.screenTitle },
  version: { color: colors.textMuted, fontSize: 12 },
  list: { padding: spacing.md, paddingBottom: 110 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.accentGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { ...typography.title },
  cardSubtitle: { ...typography.body, marginTop: 2 },
  chevron: { color: colors.textMuted, fontSize: 24, fontWeight: '300' },
  empty: { marginTop: 96, alignItems: 'center', paddingHorizontal: spacing.xl },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadow.card,
  },
  emptyText: { ...typography.title, textAlign: 'center' },
  emptySubtext: { ...typography.body, marginTop: spacing.xs, textAlign: 'center' },
  fab: {
    position: 'absolute',
    bottom: 24,
    left: spacing.md,
    right: spacing.md,
  },
});
