import AsyncStorage from '@react-native-async-storage/async-storage';
import { get, ref } from 'firebase/database';
import { database } from './firebase';

// const API_URL =
//   'https://nfs.faireconomy.media/ff_calendar_thisweek.json?version=cfd9a298b1227ac550d26e47b069b8a4';

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
  try {
    const snapshot = await get(ref(database, 'economicCalendar/events'));

    if (!snapshot.exists()) {
      throw new Error('No economic calendar data found in Firebase');
    }

    const data = snapshot.val();

    const events: EconomicEvent[] = Array.isArray(data)
      ? data
      : Object.values(data);

    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(events));

    console.log(`Loaded ${events.length} economic events from firebase`);

    return events;
  } catch (error) {
    console.error(`Failed to load calendar from Firebase:`, error);

    const cached = await AsyncStorage.getItem(CACHE_KEY);

    if (cached) {
      console.log('Using cached economic calendar fallback');

      return JSON.parse(cached) as EconomicEvent[];
    }

    throw error;
  }
}

// export async function getEconomicCalendar(): Promise<EconomicEvent[]> {
//   const cached = await AsyncStorage.getItem(CACHE_KEY);

//   if (cached) {
//     console.log('Using cached economic calendar');

//     const events: EconomicEvent[] = JSON.parse(cached);

//     return events;
//   }

//   console.log('No cache found - fetching Faireconomy');

//   const response = await fetch(API_URL);

//   if (!response.ok) {
//     throw new Error(`Calendar API returned ${response.status}`);
//   }

//   const events: EconomicEvent[] = await response.json();

//   await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(events));

//   return events;
// }
