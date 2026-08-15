import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { Tabs } from "expo-router";
import { useEffect } from "react";

import { refreshNotificationSchedule } from "@/services/notificationManager";

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
          "Failed to refresh notification schedule on startup:",
          error,
        );
      }
    }

    refreshSchedule();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1c1c1e",
          borderTopColor: "#333",
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#777",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
