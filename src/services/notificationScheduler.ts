/** biome-ignore-all assist/source/organizeImports: <executive decision> */
import type { NewsWindow } from '@/utils/newsWindows';
import * as Notifications from 'expo-notifications';
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

export async function scheduleNewsWindowNotifications(
  newsWindow: NewsWindow,
  settings: NotificationSettings,
): Promise<ScheduledNewsNotification[]> {
  const { currency, date, events } = newsWindow;

  if (!settings.selectedCurrencies.includes(currency)) {
    return [];
  }

  const eventTime = new Date(date);

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
            title: `🔴 ${currency} High-Impact News in ${beforeMinutes}`,
            body: createBeforeBody(events),
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
            body: `Your ${afterMinutes}-${minuteLabel(
              afterMinutes,
            )} post-news waiting period has ended.`,
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
      }
    }
  }

  return scheduled;
}

function createBeforeBody(events: NewsWindow['events']) {
  if (events.length === 1) {
    return `${events[0].title} is approaching.`;
  }

  return `${events.length} high-impact releases are scheduled at the same time.`;
}

function minuteLabel(minutes: number) {
  return minutes === 1 ? 'minute' : 'minutes';
}

export async function scheduleWeeklyNotifications(
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
  newsWindow: NewsWindow[],
  settings: NotificationSettings,
) {
  console.log('Rebuilding notification schedule....');

  await cancelScheduledNewsNotifications();

  const scheduled = await scheduleWeeklyNotifications(newsWindow, settings);

  const ids = scheduled.map((notification) => notification.notificationId);

  await saveScheduledNotificationIds(ids);

  console.log(`Scheduled ${scheduled.length} news notifications`);

  return scheduled;
}
