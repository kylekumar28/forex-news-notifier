import type { EconomicEvent } from "@/services/economicCalendar";
import type { Currency } from "@/services/notificationSettings";

export type NewsWindow = {
	currency: Currency;
	date: string;
	events: EconomicEvent[];
};

export function createNewsWindows(events: EconomicEvent[]): NewsWindow[] {
	const windows = new Map<string, NewsWindow>();

	for (const event of events) {
		if (event.impact !== "High") {
			continue;
		}

		const currency = event.country as Currency;

		const eventTime = new Date(event.date);

		if (Number.isNaN(eventTime.getTime())) {
			continue;
		}

		// Normalise timestamp
		const timestamp = eventTime.toISOString();

		const key = `${currency}-${timestamp}`;

		const existingWindow = windows.get(key);

		if (existingWindow) {
			existingWindow.events.push(event);
			continue;
		}

		windows.set(key, {
			currency,
			date: timestamp,
			events: [event],
		});
	}

	return Array.from(windows.values()).sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
	);
}

export function getNextNewsWindow(
	windows: NewsWindow[],
	now = new Date(),
): NewsWindow | null {
	return (
		windows.find((window) => new Date(window.date).getTime() > now.getTime()) ??
		null
	);
}
