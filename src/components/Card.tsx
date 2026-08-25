import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { radius, spacing, Colors } from '../theme';
import { useSettings } from '../context/SettingsContext';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  highlighted?: boolean;
};

export default function Card({ children, style, highlighted }: Props) {
  const { accent, colors, shadow } = useSettings();
  const styles = useMemo(() => makeStyles(colors, shadow.card), [colors, shadow]);
  return (
    <View
      style={[styles.card, highlighted && { borderColor: accent.color }, style]}
    >
      {children}
    </View>
  );
}

function makeStyles(colors: Colors, cardShadow: object) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...cardShadow,
    },
  });
}
