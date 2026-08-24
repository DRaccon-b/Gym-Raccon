import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import PlansScreen from '../screens/PlansScreen';
import CreatePlanScreen from '../screens/CreatePlanScreen';
import PlanDetailScreen from '../screens/PlanDetailScreen';
import StartWorkoutScreen from '../screens/StartWorkoutScreen';
import ActiveWorkoutScreen from '../screens/ActiveWorkoutScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProgressScreen from '../screens/ProgressScreen';
import StreakScreen from '../screens/StreakScreen';
import SettingsScreen from '../screens/SettingsScreen';
import type { RootStackParamList } from './types';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.textPrimary,
  headerTitleStyle: { fontWeight: '700' as const },
  headerShadowVisible: false,
};

function PlansStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Plans" component={PlansScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="CreatePlan"
        component={CreatePlanScreen}
        options={({ route }) => ({
          title: route.params?.planId ? 'Plan bearbeiten' : 'Neuer Plan',
        })}
      />
      <Stack.Screen name="PlanDetail" component={PlanDetailScreen} options={{ title: 'Plan' }} />
      <Stack.Screen
        name="StartWorkout"
        component={StartWorkoutScreen}
        options={{ title: 'Workout vorbereiten' }}
      />
      <Stack.Screen
        name="ActiveWorkout"
        component={ActiveWorkoutScreen}
        options={{ title: 'Workout', gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 64,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' as const },
      }}
    >
      <Tab.Screen
        name="PlansTab"
        component={PlansStack}
        options={{
          title: 'Pläne',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🏋️</Text>,
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryScreen}
        options={{
          title: 'Verlauf',
          headerShown: true,
          headerStyle: screenOptions.headerStyle,
          headerTintColor: screenOptions.headerTintColor,
          headerTitleStyle: screenOptions.headerTitleStyle,
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📊</Text>,
        }}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressScreen}
        options={{
          title: 'Fortschritt',
          headerShown: true,
          headerStyle: screenOptions.headerStyle,
          headerTintColor: screenOptions.headerTintColor,
          headerTitleStyle: screenOptions.headerTitleStyle,
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📈</Text>,
        }}
      />
      <Tab.Screen
        name="StreakTab"
        component={StreakScreen}
        options={{
          title: 'Streak',
          headerShown: true,
          headerStyle: screenOptions.headerStyle,
          headerTintColor: screenOptions.headerTintColor,
          headerTitleStyle: screenOptions.headerTitleStyle,
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🔥</Text>,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          title: 'Einstellungen',
          headerShown: true,
          headerStyle: screenOptions.headerStyle,
          headerTintColor: screenOptions.headerTintColor,
          headerTitleStyle: screenOptions.headerTitleStyle,
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
