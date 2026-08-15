import AsyncStorage from "@react-native-async-storage/async-storage";
import { CURRENCIES, type Currency } from "./notificationSettings";

const HOME_CURRENCIES_KEY = "home_calendar_currencies";

const DEFAULT_HOME_CURRENCIES: Currency[] = ["USD"];

export async function getHomeCurrencies(): Promise<Currency[]> {
	try {
		const stored = await AsyncStorage.getItem(HOME_CURRENCIES_KEY);

		if (!stored) {
			return DEFAULT_HOME_CURRENCIES;
		}

		const parsed = JSON.parse(stored) as Currency[];

		const validCurrencies = parsed.filter((currency) =>
			CURRENCIES.includes(currency),
		);

		return validCurrencies.length > 0
			? validCurrencies
			: DEFAULT_HOME_CURRENCIES;
	} catch (error) {
		console.error("Failed to load home currencies:", error);

		return DEFAULT_HOME_CURRENCIES;
	}
}

export async function saveHomeCurrencies(currencies: Currency[]) {
	await AsyncStorage.setItem(HOME_CURRENCIES_KEY, JSON.stringify(currencies));
}
