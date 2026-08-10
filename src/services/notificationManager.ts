/** biome-ignore-all assist/source/organizeImports: <giugiu> */
import * as Notifications from "expo-notifications";
import { createNewsWindows } from '../utils/newsWindows';
import { getEconomicCalendar } from './economicCalendar';
import { rebuildWeeklyNotificationSchedule } from './notificationScheduler';
import { getNotificationSettings } from './notificationSettings';

export async function refreshNotificationSchedule() {
  const permissions = await Notifications.getPermissionsAsync();

  if (permissions.status !== "granted") {
    console.log(`Notification schedule skipped: permission is ${permissions.status}`)

    return [];
  }

  const events = await getEconomicCalendar();
  const settings = await getNotificationSettings();
  const newsWindows = createNewsWindows(events);

  const scheduled = await rebuildWeeklyNotificationSchedule(
    newsWindows,
    settings,
  );

  console.log(
    `Notification schedule refreshed: ${scheduled.length} notifications`,
  );

  return scheduled;
}
