import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';

type Props = {
  visible: boolean;
  totalSeconds: number;
  onClose: () => void;
};

export default function RestTimerModal({ visible, totalSeconds, onClose }: Props) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!visible) return;
    setRemaining(totalSeconds);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          Vibration.vibrate([0, 300, 150, 300]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible, totalSeconds]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isDone = remaining === 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.label}>{isDone ? 'Pause vorbei!' : 'Satzpause'}</Text>
          <Text style={[styles.timer, isDone && styles.timerDone]}>
            {minutes}:{String(seconds).padStart(2, '0')}
          </Text>
          <TouchableOpacity
            style={[styles.button, isDone && styles.buttonDone]}
            onPress={() => {
              if (intervalRef.current) clearInterval(intervalRef.current);
              onClose();
            }}
          >
            <Text style={styles.buttonText}>{isDone ? 'Weiter' : 'Überspringen'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1b1e26',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: 'center',
    width: '80%',
  },
  label: { color: '#9aa0ac', fontSize: 16, marginBottom: 12 },
  timer: { color: '#fff', fontSize: 56, fontWeight: '700', fontVariant: ['tabular-nums'] },
  timerDone: { color: '#22c55e' },
  button: {
    marginTop: 28,
    backgroundColor: '#2a2f3a',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  buttonDone: { backgroundColor: '#22c55e' },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
