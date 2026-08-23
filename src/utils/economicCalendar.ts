import type { EconomicEvent } from '../services/economicCalendar';

export type EconomicEventSection = {
  title: string;
  data: EconomicEvent[];
};

export function groupEventsByDay(
  events: EconomicEvent[],
): EconomicEventSection[] {
  const grouped = new Map<string, EconomicEvent[]>();

  for (const event of events) {
    const date = new Date(event.date);

    const dayKey = date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const existing = grouped.get(dayKey) ?? [];

    existing.push(event);

    grouped.set(dayKey, existing);
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => {
      const [dayA, monthA, yearA] = a.split('/');
      const [dayB, monthB, yearB] = b.split('/');

      const dateA = new Date(Number(yearA), Number(monthA) - 1, Number(dayA));

      const dateB = new Date(Number(yearB), Number(monthB) - 1, Number(dayB));

      return dateA.getTime() - dateB.getTime();
    })
    .map(([dayKey, dayEvents]) => {
      const firstEvent = dayEvents[0];

      const date = new Date(firstEvent.date);

      return {
        title: formatSectionDate(date),
        data: dayEvents.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ),
      };
    });
}

function formatSectionDate(date: Date) {
  const weekDay = date.toLocaleDateString('en-GB', {
    weekday: 'long',
  });

  const day = date.getDate();

  const month = date.toLocaleDateString('en-GB', { month: 'long' });

  return `${weekDay} ${day}${getOrdinal(day)} ${month}`;
}

function getOrdinal(day: number) {
  if (day >= 11 && day <= 13) {
    return 'th';
  }

  switch (day % 10) {
    case 1:
      return 'st';

    case 2:
      return 'nd';

    case 3:
      return 'rd';

    default:
      return 'th';
  }
}
