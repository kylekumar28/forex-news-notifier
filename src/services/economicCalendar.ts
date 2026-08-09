import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL =
  'https://nfs.faireconomy.media/ff_calendar_thisweek.json?version=cfd9a298b1227ac550d26e47b069b8a4';

const CACHE_KEY = 'economic_calendar';

export type EconomicEvent = {
  title: string;
  country: string;
  date: string;
  impact: 'High' | 'Medium' | 'Low' | 'Holiday';
  forecast: string;
  previous: string;
};

export async function getEconomicCalendar(): Promise<EconomicEvent[]> {
  const cached = await AsyncStorage.getItem(CACHE_KEY);

  if (cached) {
    console.log('Using cached economic calendar');

    const events: EconomicEvent[] = JSON.parse(cached);

    return events;
  }

  console.log('No cache found - fetching Faireconomy');

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Calendar API returned ${response.status}`);
  }

  const events: EconomicEvent[] = await response.json();

  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(events));

  return events;
}
