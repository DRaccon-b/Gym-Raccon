import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  value: number;
  onChange: (value: number) => void;
  step: number;
  min?: number;
  suffix: string;
  decimals?: number;
};

function formatValue(value: number, decimals: number): string {
  return decimals > 0 ? value.toFixed(decimals).replace(/\.0+$/, '') : String(value);
}

export default function NumberStepperInput({
  value,
  onChange,
  step,
  min = 0,
  suffix,
  decimals = 0,
}: Props) {
  function clamp(next: number): number {
    return Math.round(Math.max(min, next) * 100) / 100;
  }

  function handleTextChange(text: string) {
    const numeric = parseFloat(text.replace(',', '.'));
    onChange(Number.isFinite(numeric) ? clamp(numeric) : min);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.stepButton}
        onPress={() => onChange(clamp(value - step))}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.stepButtonText}>−</Text>
      </TouchableOpacity>

      <View style={styles.valueBox}>
        <TextInput
          style={styles.valueInput}
          keyboardType="decimal-pad"
          value={formatValue(value, decimals)}
          onChangeText={handleTextChange}
          selectTextOnFocus
        />
        <Text style={styles.suffix}>{suffix}</Text>
      </View>

      <TouchableOpacity
        style={styles.stepButton}
        onPress={() => onChange(clamp(value + step))}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.stepButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12151c',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#242833',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  stepButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#1f2430',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonText: { color: '#ff5a3c', fontSize: 20, fontWeight: '700', lineHeight: 22 },
  valueBox: { minWidth: 64, alignItems: 'center', justifyContent: 'center' },
  valueInput: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    minWidth: 40,
    paddingVertical: 0,
  },
  suffix: { color: '#6b7280', fontSize: 11, fontWeight: '600', marginTop: -2 },
});
