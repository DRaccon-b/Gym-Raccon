import React, { useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { Exercise } from '../types';
import { radius, Colors } from '../theme';
import { useSettings } from '../context/SettingsContext';

type Props = {
  visible: boolean;
  exercises: Exercise[];
  onSelect: (exerciseId: string) => void;
  onClose: () => void;
};

export default function NextExercisePicker({ visible, exercises, onSelect, onClose }: Props) {
  const { colors, shadow } = useSettings();
  const styles = useMemo(() => makeStyles(colors, shadow.card), [colors, shadow]);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Welche Übung als Nächstes?</Text>
          <ScrollView style={{ maxHeight: 360 }}>
            {exercises.map((ex) => (
              <TouchableOpacity key={ex.id} style={styles.item} onPress={() => onSelect(ex.id)}>
                {ex.photoUri ? (
                  <Image source={{ uri: ex.photoUri }} style={styles.thumb} />
                ) : (
                  <View style={[styles.thumb, styles.thumbPlaceholder]}>
                    <Text style={{ fontSize: 16 }}>🏋️</Text>
                  </View>
                )}
                <Text style={styles.itemText}>{ex.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Abbrechen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function makeStyles(colors: Colors, cardShadow: object) {
  return StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      padding: 20,
      paddingBottom: 32,
      borderTopWidth: 1,
      borderColor: colors.border,
      ...cardShadow,
    },
    title: { color: colors.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 16 },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.surfaceSunken,
      borderRadius: radius.md,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    thumb: { width: 36, height: 36, borderRadius: radius.sm },
    thumbPlaceholder: {
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemText: { color: colors.textPrimary, fontSize: 15 },
    cancelButton: { marginTop: 12, alignItems: 'center', paddingVertical: 12 },
    cancelText: { color: colors.textSecondary, fontSize: 15 },
  });
}
