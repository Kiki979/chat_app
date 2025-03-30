import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/context/AuthContext';

import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name='HomeScreen'
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name='house.fill' color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='AdminChatScreen'
          options={{
            title: 'Chat',
            tabBarIcon: ({ color }) => (
              <Ionicons name='chatbubbles-outline' size={28} color='black' />
            ),
          }}
        />
        <Tabs.Screen
          name='CreateUserScreen'
          options={{
            title: 'Erstelle User',
            tabBarIcon: ({ color }) => (
              <Ionicons name='person-add-outline' size={28} color='black' />
            ),
          }}
        />
        <Tabs.Screen
          name='UserListScreen'
          options={{
            title: 'User Übersicht',
            tabBarIcon: ({ color }) => (
              <Ionicons name='list-outline' size={28} color='black' />
            ),
          }}
        />
        <Tabs.Screen
          name='index'
          options={{
            href: null,
          }}
        />
      </Tabs>
    </AuthProvider>
  );
}
