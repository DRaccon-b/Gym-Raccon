import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Vibration, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { colors, radius, shadow } from '../theme';

const notificationsSupported = Platform.OS !== 'web';

if (notificationsSupported) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

type Props = {
  visible: boolean;
  totalSeconds: number;
  onClose: () => void;
};

export default function RestTimerModal({ visible, totalSeconds, onClose }: Props) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notificationIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setRemaining(totalSeconds);

    if (notificationsSupported) {
      (async () => {
        try {
          const { status } = await Notifications.getPermissionsAsync();
          const granted =
            status === 'granted' ||
            (await Notifications.requestPermissionsAsync()).status === 'granted';
          if (!granted) return;
          notificationIdRef.current = await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Satzpause vorbei! 💪',
              body: 'Zeit für den nächsten Satz.',
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: totalSeconds,
            },
          });
        } catch {
          // Benachrichtigungen sind optional – Timer läuft im Vordergrund trotzdem weiter.
        }
      })();
    }

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

  function cancelPendingNotification() {
    if (notificationsSupported && notificationIdRef.current) {
      Notifications.cancelScheduledNotificationAsync(notificationIdRef.current).catch(() => {});
      notificationIdRef.current = null;
    }
  }

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
          {!isDone && notificationsSupported && (
            <Text style={styles.hint}>Du bekommst eine Erinnerung, wenn die App im Hintergrund läuft.</Text>
          )}
          {!isDone && !notificationsSupported && (
            <Text style={styles.hint}>Lass die Seite geöffnet, damit der Timer weiterläuft.</Text>
          )}
          <TouchableOpacity
            style={[styles.button, isDone && styles.buttonDone]}
            onPress={() => {
              if (intervalRef.current) clearInterval(intervalRef.current);
              cancelPendingNotification();
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
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: 'center',
    width: '80%',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  label: { color: colors.textSecondary, fontSize: 16, marginBottom: 12, fontWeight: '600' },
  timer: {
    color: colors.textPrimary,
    fontSize: 56,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  timerDone: { color: colors.success },
  hint: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
  button: {
    marginTop: 28,
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonDone: { backgroundColor: colors.success, borderColor: colors.success },
  buttonText: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
});
