import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type Props = {
  photoUri?: string;
  onChange: (uri: string | undefined) => void;
  size?: number;
};

export default function ExercisePhotoPicker({ photoUri, onChange, size = 56 }: Props) {
  async function pickFromLibrary() {
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

  function handlePress() {
    Alert.alert('Übungsfoto', undefined, [
      { text: 'Aus Galerie wählen', onPress: pickFromLibrary },
      { text: 'Foto aufnehmen', onPress: takePhoto },
      ...(photoUri
        ? [{ text: 'Foto entfernen', style: 'destructive' as const, onPress: () => onChange(undefined) }]
        : []),
      { text: 'Abbrechen', style: 'cancel' as const },
    ]);
  }

  return (
    <TouchableOpacity
      style={[styles.container, { width: size, height: size, borderRadius: size / 4 }]}
      onPress={handlePress}
    >
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={[styles.image, { borderRadius: size / 4 }]} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={{ fontSize: size * 0.4 }}>📷</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden', backgroundColor: '#0f1115' },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
