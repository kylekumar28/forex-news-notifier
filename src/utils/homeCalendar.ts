export const CALENDAR_STALE_AFTER_MS = 3 * 60 * 60 * 1000;

export function isPastEvent(dateString: string) {
  return new Date(dateString).getTime() < Date.now();
}

export function formatEventTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isCalendarStale(updatedAt: string | null) {
  if (!updatedAt) {
    return false;
  }

  const updatedTime = new Date(updatedAt).getTime();

  if (Number.isNaN(updatedTime)) {
    return false;
  }

  return Date.now() - updatedTime > CALENDAR_STALE_AFTER_MS;
}
