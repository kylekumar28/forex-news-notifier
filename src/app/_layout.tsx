import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { Tabs } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1c1c1e',
          borderTopColor: '#333',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#777',
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home' size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='alerts'
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='notifications' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
