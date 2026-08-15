import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const SCHEDULED_NOTIFICATIONS_KEY = "scheduled_news_notifications";

export async function getScheduledNewsNotificationCount() {
	const notifications = await Notifications.getAllScheduledNotificationsAsync();

	return notifications.length;
}

export async function getScheduledNotificationIds(): Promise<string[]> {
	const stored = await AsyncStorage.getItem(SCHEDULED_NOTIFICATIONS_KEY);

	if (!stored) {
		return [];
	}

	try {
		return JSON.parse(stored) as string[];
	} catch {
		return [];
	}
}

export async function saveScheduledNotificationIds(
	ids: string[],
): Promise<void> {
	await AsyncStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify(ids));
}

export async function cancelScheduledNewsNotifications(): Promise<void> {
	const ids = await getScheduledNotificationIds();

	for (const id of ids) {
		try {
			await Notifications.cancelScheduledNotificationAsync(id);
		} catch (error) {
			console.warn(`Failed to cancel notification ${id}`, error);
		}
	}

	await AsyncStorage.removeItem(SCHEDULED_NOTIFICATIONS_KEY);
}
