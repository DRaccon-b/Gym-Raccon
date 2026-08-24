import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle, Line } from 'react-native-svg';

export type ChartSeries = {
  values: number[];
  color: string;
};

type Props = {
  series: ChartSeries[];
  width: number;
  height?: number;
};

function toPoints(values: number[], width: number, height: number, paddingX: number, paddingY: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return values.map((v, i) => {
    const x =
      values.length === 1
        ? width / 2
        : paddingX + (i / (values.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((v - min) / range) * (height - paddingY * 2);
    return { x, y };
  });
}

export default function LineChart({ series, width, height = 200 }: Props) {
  const paddingX = 16;
  const paddingY = 16;

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
        {series.map((s, si) => {
          if (s.values.length === 0) return null;
          const points = toPoints(s.values, width, height, paddingX, paddingY);
          const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
          return (
            <React.Fragment key={si}>
              {points.length > 1 && (
                <Polyline points={polylinePoints} fill="none" stroke={s.color} strokeWidth={2.5} />
              )}
              {points.map((p, i) => (
                <Circle key={i} cx={p.x} cy={p.y} r={4} fill={s.color} />
              ))}
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
});
