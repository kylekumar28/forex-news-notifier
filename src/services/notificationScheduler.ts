/** biome-ignore-all assist/source/organizeImports: <executive decision> */
import type { NewsWindow } from '@/utils/newsWindows';
import * as Notifications from 'expo-notifications';
import { logDiagnosticEvent, updateDiagnosticState } from './diagnostics';
import type { Currency, NotificationSettings } from './notificationSettings';
import {
  cancelScheduledNewsNotifications,
  saveScheduledNotificationIds,
} from './scheduledNotifications';

export type ScheduledNewsNotification = {
  notificationId: string;
  currency: Currency;
  type: 'before' | 'after';
  scheduledFor: Date;
};

async function scheduleNewsWindowNotifications(
  newsWindow: NewsWindow,
  settings: NotificationSettings,
): Promise<ScheduledNewsNotification[]> {
  const { currency, date, events } = newsWindow;

  if (!settings.selectedCurrencies.includes(currency)) {
    return [];
  }

  const eventTime = new Date(date);
  const eventTimeLabel = eventTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (Number.isNaN(eventTime.getTime())) {
    console.error('Invalid economic event date:', date);
    return [];
  }

  const scheduled: ScheduledNewsNotification[] = [];

  if (settings.beforeEnabled) {
    const beforeMinutes = Number(settings.beforeMinutes);

    if (beforeMinutes > 0) {
      const notificationTime = new Date(
        eventTime.getTime() - beforeMinutes * 60_000,
      );

      if (notificationTime.getTime() > Date.now()) {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: `🔴 ${currency} News in ${beforeMinutes} min`,
            body: createBeforeBody(events, eventTimeLabel),
            sound: true,
            data: {
              type: 'before-news',
              currency,
              eventDate: date,
            },
          },

          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: notificationTime,
          },
        });

        scheduled.push({
          notificationId,
          currency,
          type: 'before',
          scheduledFor: notificationTime,
        });

        await logDiagnosticEvent('notification_scheduled', {
          notificationId,
          currency,
          notificationType: 'before',
          scheduledFor: notificationTime.toISOString(),
          eventDate: date,
        });
      }
    }
  }

  if (settings.afterEnabled) {
    const afterMinutes = Number(settings.afterMinutes);

    if (afterMinutes > 0) {
      const notificationTime = new Date(
        eventTime.getTime() + afterMinutes * 60_000,
      );

      if (notificationTime.getTime() > Date.now()) {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: `🟢 ${currency} News Buffer Ended`,
            body: `${eventTimeLabel} event • ${afterMinutes}-min post-news wait complete`,
            sound: true,
            data: {
              type: 'after-news',
              currency,
              eventDate: date,
            },
          },

          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: notificationTime,
          },
        });

        scheduled.push({
          notificationId,
          currency,
          type: 'after',
          scheduledFor: notificationTime,
        });

        await logDiagnosticEvent('notification_scheduled', {
          notificationId,
          currency,
          notificationType: 'after',
          scheduledFor: notificationTime.toISOString(),
          eventDate: date,
        });
      }
    }
  }

  return scheduled;
}

function createBeforeBody(
  events: NewsWindow['events'],
  eventTimeLabel: string,
) {
  if (events.length === 1) {
    return `${eventTimeLabel} • ${events[0].title}`;
  }

  return `${eventTimeLabel} • ${events.length} high-impact releases`;
}

async function scheduleWeeklyNotifications(
  newsWindows: NewsWindow[],
  settings: NotificationSettings,
) {
  const scheduled: ScheduledNewsNotification[] = [];

  for (const newsWindow of newsWindows) {
    const result = await scheduleNewsWindowNotifications(newsWindow, settings);

    scheduled.push(...result);
  }

  return scheduled;
}

export async function rebuildWeeklyNotificationSchedule(
  newsWindows: NewsWindow[],
  settings: NotificationSettings,
) {
  console.log('Rebuilding notification schedule....');

  try {
    await cancelScheduledNewsNotifications();

    const scheduled = await scheduleWeeklyNotifications(newsWindows, settings);

    const ids = scheduled.map((notification) => notification.notificationId);

    const nextScheduled = scheduled.reduce<ScheduledNewsNotification | null>(
      (earliest, notification) => {
        if (!earliest) {
          return notification;
        }

        return notification.scheduledFor.getTime() <
          earliest.scheduledFor.getTime()
          ? notification
          : earliest;
      },
      null,
    );

    await saveScheduledNotificationIds(ids);

    await updateDiagnosticState({
      selectedCurrencies: settings.selectedCurrencies,
      beforeEnabled: settings.beforeEnabled,
      beforeMinutes: settings.beforeMinutes,
      afterEnabled: settings.afterEnabled,
      afterMinutes: settings.afterMinutes,
      scheduledCount: scheduled.length,
      nextScheduledAt: nextScheduled?.scheduledFor.toISOString() ?? null,
      lastScheduleRefreshAt: new Date().toISOString(),
      lastScheduleResult: 'success',
    });

    await logDiagnosticEvent('schedule_rebuilt', {
      scheduledCount: scheduled.length,
      nextScheduledAt: nextScheduled?.scheduledFor.toISOString() ?? null,
    });

    console.log(`Scheduled ${scheduled.length} news notifications`);

    return scheduled;
  } catch (error) {
    await updateDiagnosticState({
      lastScheduleRefreshAt: new Date().toISOString(),
      lastScheduleResult: 'failed',
    });

    await logDiagnosticEvent('schedule_failed', {
      message:
        error instanceof Error ? error.message : 'Unknown scheduling error',
    });

    throw error;
  }
}
