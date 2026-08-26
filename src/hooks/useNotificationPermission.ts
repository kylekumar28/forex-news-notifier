/** biome-ignore-all assist/source/organizeImports: <bug> */
import { updateDiagnosticState } from '@/services/diagnostics';
import { refreshNotificationSchedule } from '@/services/notificationManager';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking } from 'react-native';

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

  const updatePermission = useCallback(
    async (status: Exclude<NotificationPermission, 'loading'>) => {
      setPermission(status);

      await updateDiagnosticState({
        notificationPermission: status,
      });
    },
    [],
  );

  const checkPermission = useCallback(async () => {
    const result = await Notifications.getPermissionsAsync();

    await updatePermission(result.status);

    return result.status;
  }, [updatePermission]);

  const enableNotifications = useCallback(async () => {
    const current = await Notifications.getPermissionsAsync();

    if (current.status === 'granted') {
      await updatePermission('granted');
      return;
    }

    if (current.status === 'denied') {
      await updatePermission('denied');
      await Linking.openSettings();
      return;
    }

    const requested = await Notifications.requestPermissionsAsync();

    await updatePermission(requested.status);

    if (requested.status === 'granted') {
      const scheduled = await refreshNotificationSchedule();

      onScheduleRefreshed?.(scheduled.length);

      return;
    }

    setPermission('denied');
  }, [onScheduleRefreshed, updatePermission]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (state) => {
      if (state !== 'active') {
        return;
      }

      const status = await checkPermission();

      if (status === 'granted') {
        const scheduled = await refreshNotificationSchedule();

        onScheduleRefreshed?.(scheduled.length);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [checkPermission, onScheduleRefreshed]);

  return {
    permission,
    enableNotifications,
    checkPermission,
  };
}
