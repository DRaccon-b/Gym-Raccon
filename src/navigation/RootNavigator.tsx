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
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: '#0f1115' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700' as const },
};

function PlansStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Plans" component={PlansScreen} options={{ title: 'Trainingspläne' }} />
      <Stack.Screen
        name="CreatePlan"
        component={CreatePlanScreen}
        options={{ title: 'Neuer Plan' }}
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
        tabBarStyle: { backgroundColor: '#0f1115', borderTopColor: '#1b1e26' },
        tabBarActiveTintColor: '#ff5a3c',
        tabBarInactiveTintColor: '#6b7280',
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
    </Tab.Navigator>
  );
}
