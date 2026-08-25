import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients, radius, shadow, typography, colors } from '../theme';
import { useSettings } from '../context/SettingsContext';

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
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[
        styles.wrapper,
        variant !== 'success' && { shadowColor: accent.color },
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
