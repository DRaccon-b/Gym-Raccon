import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { useAppData } from '../context/AppDataContext';
import { APP_VERSION } from '../constants/version';
import Card from '../components/Card';
import AccentColorPicker from '../components/AccentColorPicker';
import ToggleSwitch from '../components/ToggleSwitch';
import { radius, spacing, Colors, Typography } from '../theme';
import { ThemeMode } from '../storage/settingsStorage';
import { buildExportPayload, exportData, importData } from '../utils/exportImport';

const STEP = 15;
const MIN_SECONDS = 15;
const MAX_SECONDS = 600;

const THEME_MODE_OPTIONS: { key: ThemeMode; label: string; icon: string }[] = [
  { key: 'dark', label: 'Dunkel', icon: '🌙' },
  { key: 'light', label: 'Hell', icon: '☀️' },
  { key: 'system', label: 'System', icon: '⚙️' },
];

function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes === 0) return `${rest}s`;
  if (rest === 0) return `${minutes} min`;
  return `${minutes}:${String(rest).padStart(2, '0')} min`;
}

export default function SettingsScreen() {
  const {
    restSeconds,
    setRestSeconds,
    showVolume,
    setShowVolume,
    accentKey,
    accent,
    setAccentKey,
    themeMode,
    setThemeMode,
    colors,
    typography,
  } = useSettings();
  const styles = useMemo(() => makeStyles(colors, typography), [colors, typography]);
  const { plans, sessions, restDays, clearAllData, importAllData } = useAppData();
  const [clearStep, setClearStep] = useState<0 | 1 | 2>(0);
  const [pendingImport, setPendingImport] = useState<{
    plans: typeof plans;
    sessions: typeof sessions;
    restDays: string[];
  } | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  function handleClearAll() {
    setClearStep(1);
  }

  function handleConfirmStep1() {
    setClearStep(2);
  }

  async function handleConfirmStep2() {
    setClearStep(0);
    await clearAllData();
  }

  function handleCancelClear() {
    setClearStep(0);
  }

  async function handleExport() {
    setExporting(true);
    try {
      await exportData(buildExportPayload(plans, sessions, restDays));
    } catch {
      setImportMessage('Export fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      setExporting(false);
    }
  }

  async function handleImportPick() {
    setImporting(true);
    try {
      const data = await importData();
      if (!data) {
        setImportMessage('Keine gültige Backup-Datei ausgewählt.');
        return;
      }
      setPendingImport({ plans: data.plans, sessions: data.sessions, restDays: data.restDays ?? [] });
    } finally {
      setImporting(false);
    }
  }

  async function handleConfirmImport() {
    if (!pendingImport) return;
    await importAllData(pendingImport);
    setPendingImport(null);
    setImportMessage('Backup erfolgreich importiert.');
  }

  function handleCancelImport() {
    setPendingImport(null);
  }

  function decrease() {
    setRestSeconds(Math.max(MIN_SECONDS, restSeconds - STEP));
  }

  function increase() {
    setRestSeconds(Math.min(MAX_SECONDS, restSeconds + STEP));
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Erscheinungsbild</Text>
      <Text style={styles.sectionSubtitle}>Hell, dunkel oder automatisch nach Systemeinstellung.</Text>
      <Card style={styles.themeModeRow}>
        {THEME_MODE_OPTIONS.map((option) => {
          const selected = option.key === themeMode;
          return (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.themeModeOption,
                selected && { backgroundColor: accent.glow, borderColor: accent.color },
              ]}
              onPress={() => setThemeMode(option.key)}
            >
              <Text style={styles.themeModeIcon}>{option.icon}</Text>
              <Text
                style={[styles.themeModeLabel, selected && { color: accent.color }]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Card>

      <Text style={[styles.sectionTitle, { marginTop: 40 }]}>Design</Text>
      <Text style={styles.sectionSubtitle}>Wähle die Akzentfarbe der App.</Text>
      <Card>
        <AccentColorPicker value={accentKey} onChange={setAccentKey} />
      </Card>

      <Text style={[styles.sectionTitle, { marginTop: 40 }]}>Satzpause</Text>
      <Text style={styles.sectionSubtitle}>
        Wie lange soll der Timer zwischen den Sätzen standardmäßig laufen?
      </Text>

      <Card style={styles.stepper}>
        <TouchableOpacity style={styles.stepperButton} onPress={decrease}>
          <Text style={[styles.stepperButtonText, { color: accent.color }]}>−</Text>
        </TouchableOpacity>
        <Text style={styles.stepperValue}>{formatSeconds(restSeconds)}</Text>
        <TouchableOpacity style={styles.stepperButton} onPress={increase}>
          <Text style={[styles.stepperButtonText, { color: accent.color }]}>+</Text>
        </TouchableOpacity>
      </Card>

      <Text style={[styles.sectionTitle, { marginTop: 40 }]}>Fortschritt</Text>
      <Card style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.switchLabel}>Bewegtes Gewicht anzeigen</Text>
          <Text style={styles.switchHint}>
            Zeigt unten im Fortschritt-Tab an, wie viel Gewicht du insgesamt bewegt hast.
          </Text>
        </View>
        <ToggleSwitch value={showVolume} onValueChange={setShowVolume} />
      </Card>

      <Text style={[styles.sectionTitle, { marginTop: 40 }]}>Gefahrenzone</Text>
      <Text style={styles.sectionSubtitle}>
        Löscht alle Trainingspläne, den Workout-Verlauf und alle Fortschrittsdaten unwiderruflich.
      </Text>
      <TouchableOpacity style={styles.dangerButton} onPress={handleClearAll}>
        <Text style={styles.dangerButtonText}>Alle Daten löschen</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { marginTop: 40 }]}>Backup</Text>
      <Text style={styles.sectionSubtitle}>
        Sichere all deine Pläne, deinen Verlauf und Ruhetage als Datei oder stelle sie wieder her.
      </Text>
      <View style={styles.backupRow}>
        <TouchableOpacity
          style={styles.backupButton}
          onPress={handleExport}
          disabled={exporting || plans.length + sessions.length === 0}
        >
          <Text style={styles.backupButtonText}>⬆️ Exportieren</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backupButton} onPress={handleImportPick} disabled={importing}>
          <Text style={styles.backupButtonText}>⬇️ Importieren</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>{APP_VERSION}</Text>

      <Modal
        visible={clearStep !== 0}
        transparent
        animationType="fade"
        onRequestClose={handleCancelClear}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {clearStep === 1 ? (
              <>
                <Text style={styles.modalTitle}>Alles löschen?</Text>
                <Text style={styles.modalMessage}>
                  Das löscht unwiderruflich alle Trainingspläne, deinen kompletten
                  Workout-Verlauf und alle Fortschrittsdaten. Das kann nicht rückgängig
                  gemacht werden.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Bist du sicher?</Text>
                <Text style={styles.modalMessage}>Wirklich ALLE Daten löschen?</Text>
              </>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={handleCancelClear}>
                <Text style={styles.modalCancelText}>Abbrechen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDangerButton}
                onPress={clearStep === 1 ? handleConfirmStep1 : handleConfirmStep2}
              >
                <Text style={styles.modalDangerText}>
                  {clearStep === 1 ? 'Endgültig löschen' : 'Ja, alles löschen'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={pendingImport !== null}
        transparent
        animationType="fade"
        onRequestClose={handleCancelImport}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Backup importieren?</Text>
            <Text style={styles.modalMessage}>
              {pendingImport
                ? `${pendingImport.plans.length} Pläne und ${pendingImport.sessions.length} Workouts aus der Datei ersetzen deine aktuellen Daten unwiderruflich.`
                : ''}
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={handleCancelImport}>
                <Text style={styles.modalCancelText}>Abbrechen</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalDangerButton} onPress={handleConfirmImport}>
                <Text style={styles.modalDangerText}>Importieren</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={importMessage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setImportMessage(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Backup</Text>
            <Text style={styles.modalMessage}>{importMessage}</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancelButton, { flex: 1 }]}
                onPress={() => setImportMessage(null)}
              >
                <Text style={styles.modalCancelText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function makeStyles(colors: Colors, typography: Typography) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.md, paddingBottom: 48 },
    sectionTitle: { ...typography.title, fontSize: 20, marginTop: 8 },
    sectionSubtitle: { ...typography.body, marginTop: 6, marginBottom: 24 },
    themeModeRow: { flexDirection: 'row', gap: 8, padding: 8 },
    themeModeOption: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 14,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: 'transparent',
      gap: 4,
    },
    themeModeIcon: { fontSize: 20 },
    themeModeLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 24,
      gap: 32,
    },
    stepperButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.surfaceRaised,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    stepperButtonText: { fontSize: 24, fontWeight: '700' },
    stepperValue: {
      color: colors.textPrimary,
      fontSize: 28,
      fontWeight: '800',
      minWidth: 110,
      textAlign: 'center',
    },
    switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    switchLabel: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
    switchHint: { ...typography.body, fontSize: 12, marginTop: 4 },
    dangerButton: {
      marginTop: 4,
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderWidth: 1,
      borderColor: colors.danger,
      borderRadius: radius.md,
      paddingVertical: 14,
      alignItems: 'center',
    },
    dangerButtonText: { color: colors.danger, fontSize: 15, fontWeight: '700' },
    backupRow: { flexDirection: 'row', gap: 12 },
    backupButton: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      paddingVertical: 14,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    backupButtonText: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
    version: { color: colors.textMuted, fontSize: 12, textAlign: 'center', marginTop: 32 },
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
    },
    modalCard: {
      width: '100%',
      maxWidth: 380,
      backgroundColor: colors.surfaceRaised,
      borderRadius: radius.md,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 10 },
    modalMessage: { ...typography.body, fontSize: 14, lineHeight: 20 },
    modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
    modalCancelButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: radius.sm,
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalCancelText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
    modalDangerButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: radius.sm,
      alignItems: 'center',
      backgroundColor: colors.danger,
    },
    modalDangerText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  });
}
