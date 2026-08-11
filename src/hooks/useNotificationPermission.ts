import { refreshNotificationSchedule } from "@/services/notificationManager";
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from "react";
import { AppState, Linking } from "react-native";

export type NotificationPermission =
  | 'loading'
  | 'granted'
  | 'denied'
  | 'undetermined';

export function useNotificationPermission(
  onScheduleRefreshed?: (count: number) => void,
) {
  const [permission, setPermission] =
    useState<NotificationPermission>('loading');

  const checkPermission = useCallback(async () => {
    const result =
      await Notifications.getPermissionsAsync();

    if (result.status === 'granted') {
      setPermission('granted');
      return;
    }

    if (result.status === 'undetermined') {
      setPermission('undetermined');
      return;
    }

    setPermission('denied');
  }, []);

  const enableNotifications = useCallback(async () => {
    const current =
      await Notifications.getPermissionsAsync();

    if (current.status === 'granted') {
      setPermission('granted');
      return;
    }

    if (current.status === 'denied') {
      await Linking.openSettings();
      return;
    }

    const requested =
      await Notifications.requestPermissionsAsync();

    if (requested.status === 'granted') {
      setPermission('granted');

      const scheduled =
        await refreshNotificationSchedule();

      onScheduleRefreshed?.(scheduled.length);

      return;
    }

    setPermission('denied');
  }, [onScheduleRefreshed]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (state) => {
        if (state === 'active') {
          checkPermission();
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [checkPermission]);

  return {
    permission,
    enableNotifications,
    checkPermission,
  };
}