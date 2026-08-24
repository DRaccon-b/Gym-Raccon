import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle, Line, Text as SvgText } from 'react-native-svg';

type Props = {
  values: number[];
  width: number;
  height?: number;
  color?: string;
};

export default function LineChart({ values, width, height = 200, color = '#ff5a3c' }: Props) {
  const paddingX = 16;
  const paddingY = 24;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x =
      values.length === 1
        ? width / 2
        : paddingX + (i / (values.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((v - min) / range) * (height - paddingY * 2);
    return { x, y };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Line
          x1={paddingX}
          y1={height - paddingY}
          x2={width - paddingX}
          y2={height - paddingY}
          stroke="#2a2f3a"
          strokeWidth={1}
        />
        {values.length > 1 && (
          <Polyline points={polylinePoints} fill="none" stroke={color} strokeWidth={2.5} />
        )}
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={4} fill={color} />
        ))}
        <SvgText x={paddingX} y={14} fill="#9aa0ac" fontSize={11}>
          {max}
        </SvgText>
        <SvgText x={paddingX} y={height - 6} fill="#9aa0ac" fontSize={11}>
          {min}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
});
