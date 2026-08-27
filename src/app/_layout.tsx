import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';

import { logDiagnosticEvent } from '@/services/diagnostics';
import { refreshNotificationSchedule } from '@/services/notificationManager';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function TabsLayout() {
  useEffect(() => {
    async function refreshSchedule() {
      try {
        const scheduled = await refreshNotificationSchedule();

        console.log(
          `Startup notification refresh complete: ${scheduled.length} notifications`,
        );
      } catch (error) {
        console.error(
          'Failed to refresh notification schedule on startup:',
          error,
        );
      }
    }

    refreshSchedule();
  }, []);

  useEffect(() => {
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      async (notification) => {
        await logDiagnosticEvent('notification_received', {
          identifier: notification.request.identifier,
          data: notification.request.content.data,
        });
      },
    );

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          await logDiagnosticEvent('notification_opened', {
            identifier: response.notification.request.identifier,
            data: response.notification.request.content.data,
          });
        },
      );

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  useEffect(() => {
    async function checkLastNotificationResponse() {
      const response = await Notifications.getLastNotificationResponseAsync();

      if (!response) {
        return;
      }

      await logDiagnosticEvent('notification_opened_from_cold_start', {
        identifier: response.notification.request.identifier,
        data: response.notification.request.content.data,
      });
    }

    checkLastNotificationResponse();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1c1c1e',
          borderTopColor: '#333',
        },
        tabBarItemStyle: {
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#777',
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='calendar-outline' size={size} color={color} />
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
