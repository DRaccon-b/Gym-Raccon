import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AccentKey, ACCENT_THEMES, Colors } from '../theme';
import { useSettings } from '../context/SettingsContext';

type Props = {
  value: AccentKey;
  onChange: (key: AccentKey) => void;
};

const ORDER: AccentKey[] = ['orange', 'blue', 'green', 'yellow', 'red', 'purple', 'pink', 'teal'];

export default function AccentColorPicker({ value, onChange }: Props) {
  const { colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.row}>
      {ORDER.map((key) => {
        const theme = ACCENT_THEMES[key];
        const selected = key === value;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => onChange(key)}
            style={[styles.swatch, { backgroundColor: theme.swatch }, selected && styles.selected]}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            {selected && <View style={styles.checkDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
    swatch: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: 'transparent',
    },
    selected: {
      borderColor: colors.textPrimary,
    },
    checkDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.textPrimary,
    },
  });
}
