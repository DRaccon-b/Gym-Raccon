import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, radius, shadow } from '../theme';

type Props = {
  photoUri?: string;
  onChange: (uri: string | undefined) => void;
  size?: number;
};

const cameraSupported = Platform.OS !== 'web';

export default function ExercisePhotoPicker({ photoUri, onChange, size = 56 }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);

  async function pickFromLibrary() {
    setMenuVisible(false);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Zugriff nötig', 'Bitte erlaube den Zugriff auf deine Fotos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    setMenuVisible(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Zugriff nötig', 'Bitte erlaube den Zugriff auf die Kamera.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.container, { width: size, height: size, borderRadius: size / 4 }]}
        onPress={() => setMenuVisible(true)}
      >
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={[styles.image, { borderRadius: size / 4 }]} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ fontSize: size * 0.4 }}>📷</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Übungsfoto</Text>
            <TouchableOpacity style={styles.option} onPress={pickFromLibrary}>
              <Text style={styles.optionText}>Aus Galerie wählen</Text>
            </TouchableOpacity>
            {cameraSupported && (
              <TouchableOpacity style={styles.option} onPress={takePhoto}>
                <Text style={styles.optionText}>Foto aufnehmen</Text>
              </TouchableOpacity>
            )}
            {photoUri && (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  setMenuVisible(false);
                  onChange(undefined);
                }}
              >
                <Text style={styles.optionTextDanger}>Foto entfernen</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.cancelOption} onPress={() => setMenuVisible(false)}>
              <Text style={styles.cancelText}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.surfaceSunken,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  sheetTitle: { color: colors.textMuted, fontSize: 13, fontWeight: '700', marginBottom: 12 },
  option: { paddingVertical: 14, borderTopWidth: 1, borderTopColor: colors.border },
  optionText: { color: colors.textPrimary, fontSize: 16, textAlign: 'center' },
  optionTextDanger: { color: colors.danger, fontSize: 16, textAlign: 'center' },
  cancelOption: { paddingVertical: 14, marginTop: 8 },
  cancelText: { color: colors.textSecondary, fontSize: 16, textAlign: 'center', fontWeight: '600' },
});
