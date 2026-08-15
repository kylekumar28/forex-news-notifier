import AsyncStorage from "@react-native-async-storage/async-storage";
import { get, ref } from "firebase/database";
import { database } from "./firebase";

const CACHE_KEY = "economic_calendar";
const UPDATED_AT_CACHE_KEY = "economic_calendar_updated_at";

export type EconomicEvent = {
	title: string;
	country: string;
	date: string;
	impact: "High" | "Medium" | "Low" | "Holiday";
	forecast: string;
	previous: string;
};

export async function getEconomicCalendar(): Promise<EconomicEvent[]> {
	try {
		const snapshot = await get(ref(database, "economicCalendar/events"));

		if (!snapshot.exists()) {
			throw new Error("No economic calendar data found in Firebase");
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
			console.log("Using cached economic calendar fallback");

			return JSON.parse(cached) as EconomicEvent[];
		}

		throw error;
	}
}

export async function getEconomicCalendarUpdatedAt(): Promise<string | null> {
	try {
		const snapshot = await get(ref(database, "economicCalendar/updatedAt"));

		if (!snapshot.exists()) {
			const cachedUpdatedAt = await AsyncStorage.getItem(UPDATED_AT_CACHE_KEY);

			return cachedUpdatedAt;
		}

		const updatedAt = String(snapshot.val());

		await AsyncStorage.setItem(UPDATED_AT_CACHE_KEY, updatedAt);

		return updatedAt;
	} catch (error) {
		console.error("Failed to get calendar updated time from Firebase", error);

		const cachedUpdatedAt = await AsyncStorage.getItem(UPDATED_AT_CACHE_KEY);

		if (cachedUpdatedAt) {
			console.log("Using cached updated time fallback");

			return cachedUpdatedAt;
		}

		return null;
	}
}
