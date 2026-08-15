import {
	MAX_NOTIFICATION_MINUTES,
	MIN_NOTIFICATION_MINUTES,
} from "@/constants/notifications";

export function sanitiseMinuteInput(value: string) {
	return value.replace(/[^0-9]/g, "");
}

export function normaliseMinutes(value: string) {
	const parsed = Number(value);

	if (!Number.isFinite(parsed)) {
		return String(MIN_NOTIFICATION_MINUTES);
	}

	return String(
		Math.min(
			MAX_NOTIFICATION_MINUTES,
			Math.max(MIN_NOTIFICATION_MINUTES, parsed),
		),
	);
}
