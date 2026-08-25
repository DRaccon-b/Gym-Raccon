import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients, radius, shadow, typography, colors } from '../theme';
import { useSettings } from '../context/SettingsContext';

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'accent' | 'success';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export default function GradientButton({
  label,
  onPress,
  variant = 'accent',
  style,
  disabled,
}: Props) {
  const { accent } = useSettings();
  const colorsSet = variant === 'success' ? gradients.success : accent.gradient;
  const glowColor = variant === 'success' ? colors.success : accent.color;
  const webGlow: StyleProp<ViewStyle> =
    Platform.OS === 'web'
      ? ({ boxShadow: `0 6px 20px ${hexToRgba(glowColor, 0.5)}` } as unknown as ViewStyle)
      : null;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[
        styles.wrapper,
        { shadowColor: glowColor },
        webGlow,
        disabled && styles.disabled,
        style,
      ]}
    >
      <LinearGradient
        colors={colorsSet}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.lg,
    ...shadow.glow,
  },
  disabled: { opacity: 0.5 },
  gradient: {
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...typography.button, color: colors.textPrimary },
});
