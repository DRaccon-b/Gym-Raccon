import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme';
import { useSettings } from '../context/SettingsContext';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  highlighted?: boolean;
};

export default function Card({ children, style, highlighted }: Props) {
  const { accent } = useSettings();
  return (
    <View
      style={[styles.card, highlighted && { borderColor: accent.color }, style]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
});
