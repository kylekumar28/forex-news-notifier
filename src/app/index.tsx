import { AppVersion } from "@/components/AppVersion";
import { NextNewsCard } from "@/components/NextNewsCard";
import {
	getHomeCurrencies,
	saveHomeCurrencies,
} from "@/services/homeCalendarSettings";
import { CURRENCIES, type Currency } from "@/services/notificationSettings";
import { groupEventsByDay } from "@/utils/economicCalendar";
import { getNextNewsWindow } from "@/utils/newsWindow";
import { createNewsWindows } from "@/utils/newsWindows";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	SectionList,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	type EconomicEvent,
	getEconomicCalendar,
	getEconomicCalendarUpdatedAt,
} from "../services/economicCalendar";
import { styles } from "../styles/index.styles";

export default function HomeScreen() {
	const [events, setEvents] = useState<EconomicEvent[]>([]);
	const [updatedAt, setUpdatedAt] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedCurrencies, setSelectedCurrencies] = useState<Currency[]>([
		"USD",
	]);
	const [currencyFilterOpen, setCurrencyFilterOpen] = useState(false);

	useEffect(() => {
		const loadEvents = async () => {
			try {
				setLoading(true);
				setError(null);

				// const data = await getEconomicCalendar();
				const [data, calendarUpdatedAt, savedCurrencies] = await Promise.all([
					getEconomicCalendar(),
					getEconomicCalendarUpdatedAt(),
					getHomeCurrencies(),
				]);

				const highImpactEvents = data.filter(
					(event) => event.impact === "High",
				);

				setUpdatedAt(calendarUpdatedAt);
				setEvents(highImpactEvents);
				setSelectedCurrencies(savedCurrencies);
			} catch (error) {
				console.error(error);

				setError(
					error instanceof Error ? error.message : "Something went wrong",
				);
			} finally {
				setLoading(false);
			}
		};

		loadEvents();
	}, []);

	const filteredEvents = events.filter((event) =>
		selectedCurrencies.includes(event.country as Currency),
	);

	const sections = groupEventsByDay(filteredEvents);

	const newsWindow = createNewsWindows(filteredEvents);

	const nextNews = getNextNewsWindow(newsWindow);

	const isPastEvent = (dateString: string) => {
		return new Date(dateString).getTime() < Date.now();
	};

	const toggleCurrency = async (currency: Currency) => {
		let updatedCurrencies: Currency[];

		if (selectedCurrencies.includes(currency)) {
			updatedCurrencies = selectedCurrencies.filter(
				(item) => item !== currency,
			);

			// Never allow zero currencies
			if (updatedCurrencies.length === 0) {
				return;
			}
		} else {
			updatedCurrencies = [...selectedCurrencies, currency];
		}

		setSelectedCurrencies(updatedCurrencies);

		await saveHomeCurrencies(updatedCurrencies);
	};

	const getCurrencyFilterLabel = () => {
		if (selectedCurrencies.length <= 3) {
			return selectedCurrencies.join(" • ");
		}

		return `${selectedCurrencies.length} selected`;
	};

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);

		return date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const isCalendarStale = (updatedAt: string | null) => {
		if (!updatedAt) return false;

		const updatedTime = new Date(updatedAt).getTime();

		if (Number.isNaN(updatedTime)) return false;

		const STALE_AFTER_MS = 3 * 60 * 60 * 1000;

		return Date.now() - updatedTime > STALE_AFTER_MS;
	};

	const calendarStale = isCalendarStale(updatedAt);

	if (loading) {
		return (
			<SafeAreaView style={styles.center}>
				<ActivityIndicator size="large" />
				<Text style={styles.loadingText}>Loading economic calendar...</Text>
			</SafeAreaView>
		);
	}

	if (error) {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={styles.error}>Error: {error}</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
			<View style={styles.headingRow}>
				<Text style={styles.heading}>High Impact News</Text>

				{updatedAt && (
					<View style={styles.updatedAtRow}>
						{calendarStale && (
							<Ionicons name="warning-outline" size={12} color="#d6a84b" />
						)}

						<Text
							style={[styles.updatedAt, calendarStale && styles.updatedAtStale]}
						>
							Updated {formatTime(updatedAt)}
						</Text>
					</View>
				)}
			</View>

			<Text style={styles.subheading}>
				{filteredEvents.length}{" "}
				{filteredEvents.length === 1 ? "event" : "events"} this week
			</Text>

			{/* Currency Toggle UI */}
			<View style={styles.filterHeader}>
				<Text style={styles.filterLabel}>News currencies</Text>

				<Pressable
					style={styles.filterButton}
					onPress={() => setCurrencyFilterOpen((current) => !current)}
				>
					<Text style={styles.filterButtonText}>
						{getCurrencyFilterLabel()}
					</Text>

					<Ionicons
						name={currencyFilterOpen ? "chevron-up" : "chevron-down"}
						size={14}
						color="#777"
						style={{ marginLeft: 4 }}
					/>
				</Pressable>
			</View>

			{currencyFilterOpen && (
				<View style={styles.currencyFilter}>
					{CURRENCIES.map((currency) => {
						const selected = selectedCurrencies.includes(currency);

						return (
							<Pressable
								key={currency}
								style={[
									styles.currencyFilterButton,
									selected && styles.currencyFilterButtonSelected,
								]}
								onPress={() => toggleCurrency(currency)}
							>
								<Text
									style={[
										styles.currencyFilterText,
										selected && styles.currencyFilterTextSelected,
									]}
								>
									{currency}
								</Text>
							</Pressable>
						);
					})}
				</View>
			)}

			<NextNewsCard newsWindow={nextNews} />

			<SectionList
				sections={sections}
				keyExtractor={(item) => `${item.country}-${item.title}-${item.date}`}
				contentContainerStyle={styles.list}
				stickySectionHeadersEnabled={false}
				renderSectionHeader={({ section }) => (
					<Text style={styles.dayHeading}>{section.title}</Text>
				)}
				renderItem={({ item, index, section }) => {
					const isFirstEvent = section === sections[0] && index === 0;

					const past = isFirstEvent ? false : isPastEvent(item.date);

					return (
						<View style={[styles.card, past && styles.cardPast]}>
							<View style={styles.cardHeader}>
								<View
									style={[
										styles.currencyBadge,
										past && styles.currencyBadgePast,
									]}
								>
									<Text style={[styles.currency, past && styles.textPast]}>
										{item.country}
									</Text>
								</View>
								<Text style={[styles.time, past && styles.textPast]}>
									{formatTime(item.date)}
								</Text>

								<View
									style={[styles.impactBadge, past && styles.impactBadgePast]}
								>
									<Text style={[styles.impact, past && styles.impactPast]}>
										HIGH
									</Text>
								</View>
							</View>

							<Text style={[styles.title, past && styles.titlePast]}>
								{item.title}
							</Text>

							<View style={styles.dataRow}>
								<Text style={[styles.data, past && styles.textPast]}>
									Forecast: {item.forecast || "-"}
								</Text>
								<Text style={[styles.data, past && styles.textPast]}>
									Previous: {item.previous || "-"}
								</Text>
							</View>
						</View>
					);
				}}
				ListFooterComponent={<AppVersion style={styles.versionText} />}
				ListEmptyComponent={
					<View style={styles.emptyState}>
						<Text style={styles.emptyStateTitle}>
							No high-impact news this week
						</Text>

						<Text style={styles.emptyStateText}>
							No events match your selected currencies
						</Text>
					</View>
				}
			/>
		</SafeAreaView>
	);
}
