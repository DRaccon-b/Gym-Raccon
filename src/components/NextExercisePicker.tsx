import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { Exercise } from '../types';

type Props = {
  visible: boolean;
  exercises: Exercise[];
  onSelect: (exerciseId: string) => void;
  onClose: () => void;
};

export default function NextExercisePicker({ visible, exercises, onSelect, onClose }: Props) {
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

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#1b1e26',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0f1115',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  thumb: { width: 36, height: 36, borderRadius: 9 },
  thumbPlaceholder: { backgroundColor: '#1b1e26', alignItems: 'center', justifyContent: 'center' },
  itemText: { color: '#fff', fontSize: 15 },
  cancelButton: { marginTop: 12, alignItems: 'center', paddingVertical: 12 },
  cancelText: { color: '#9aa0ac', fontSize: 15 },
});
