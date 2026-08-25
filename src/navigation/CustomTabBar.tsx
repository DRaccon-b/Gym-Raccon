import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { spacing, Colors } from '../theme';
import { useSettings } from '../context/SettingsContext';

const TAB_WIDTH = 92;

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { accent, colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = (options.title ?? route.name) as string;
          const focused = state.index === index;
          const color = focused ? accent.color : colors.textMuted;

          function handlePress() {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={handlePress}
              style={styles.tab}
              activeOpacity={0.7}
            >
              {options.tabBarIcon?.({ color, focused, size: 20 })}
              <Text style={[styles.label, { color }]} numberOfLines={1}>
                {label}
              </Text>
              {focused && <View style={[styles.indicator, { backgroundColor: accent.color }]} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    wrapper: {
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    content: { paddingHorizontal: spacing.sm },
    tab: {
      width: TAB_WIDTH,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 10,
      paddingBottom: 8,
      gap: 4,
    },
    label: { fontSize: 11, fontWeight: '600' },
    indicator: {
      position: 'absolute',
      bottom: 0,
      width: 24,
      height: 3,
      borderRadius: 2,
    },
  });
}
