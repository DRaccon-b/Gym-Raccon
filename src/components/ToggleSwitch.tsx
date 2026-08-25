import React, { useMemo } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Colors } from '../theme';
import { useSettings } from '../context/SettingsContext';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export default function ToggleSwitch({ value, onValueChange }: Props) {
  const { accent, colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.track, value && { backgroundColor: accent.color }]}
      onPress={() => onValueChange(!value)}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <View style={[styles.thumb, value && styles.thumbOn]} />
    </TouchableOpacity>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    track: {
      width: 48,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 2,
      justifyContent: 'center',
    },
    thumb: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.textPrimary,
    },
    thumbOn: {
      transform: [{ translateX: 20 }],
    },
  });
}
