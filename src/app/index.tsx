/** biome-ignore-all assist/source/organizeImports: <Executive decision> */
import { AppVersion } from '@/components/AppVersion';
import { NextNewsCard } from '@/components/NextNewsCard';
import { getHomeCurrencies, saveHomeCurrencies } from '@/services/homeCalendarSettings';
import { CURRENCIES, Currency } from '@/services/notificationSettings';
import { groupEventsByDay } from '@/utils/economicCalendar';
import { getNextNewsWindow } from '@/utils/newsWindow';
import { createNewsWindows } from '@/utils/newsWindows';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, SectionList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  type EconomicEvent,
  getEconomicCalendar,
  getEconomicCalendarUpdatedAt,
} from '../services/economicCalendar';
import { styles } from '../styles/index.styles';

export default function HomeScreen() {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarView, setCalendarView] = useState<'today' | 'week'>('today');
  const [selectedCurrencies, setSelectedCurrencies] = useState<Currency[]>(['USD']);
  const [currencyFilterOpen, setCurrencyFilterOpen] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        // const data = await getEconomicCalendar();
        const [data, calendarUpdatedAt, savedCurrencies] = await Promise.all([getEconomicCalendar(), getEconomicCalendarUpdatedAt(), getHomeCurrencies()]);

        const highImpactEvents = data.filter(
          (event) => event.impact === 'High',
        );

        setUpdatedAt(calendarUpdatedAt);
        setEvents(highImpactEvents);
        setSelectedCurrencies(savedCurrencies);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error ? error.message : 'Something went wrong',
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const filteredEvents = events.filter((event) => selectedCurrencies.includes(event.country as Currency));

  const sections = groupEventsByDay(filteredEvents);

  const todayEvents = filteredEvents.filter((event) => {
    const eventDate = new Date(event.date);
    const today = new Date();

    return (
      eventDate.getFullYear() === today.getFullYear() && eventDate.getMonth() === today.getMonth() && eventDate.getDate() === today.getDate()
    )
  });

  const todaySections = groupEventsByDay(todayEvents);

  const visibleSections = calendarView === 'today' ? todaySections : sections;

  const newsWindow = createNewsWindows(filteredEvents);

  const nextNews = getNextNewsWindow(newsWindow);

  const toggleCurrency = async (currency: Currency) => {
    let updatedCurrencies: Currency[];

    if (selectedCurrencies.includes(currency)) {
      updatedCurrencies = selectedCurrencies.filter((item) => item !== currency);

      // Never allow zero currencies
      if (updatedCurrencies.length === 0) {
        return;
      }
    } else {
      updatedCurrencies = [...selectedCurrencies, currency];
    }

    setSelectedCurrencies(updatedCurrencies);

    await saveHomeCurrencies(updatedCurrencies);
  }

  const getCurrencyFilterLabel = () => {
    if (selectedCurrencies.length <= 3) {
      return selectedCurrencies.join(' • ');
    }

    return `${selectedCurrencies.length} selected`
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size='large' />
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
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']} >
      <View style={styles.headingRow}>
        <Text style={styles.heading}>High Impact News</Text>

        {updatedAt && (<Text style={styles.updatedAt}>Updated {formatTime(updatedAt)}</Text>)}
      </View>

      <Text style={styles.subheading}>
        {calendarView === 'today' ? `${todayEvents.length} ${todayEvents.length === 1 ? 'event' : 'events'} today` : `${filteredEvents.length} ${filteredEvents.length === 1 ? 'event' : 'events'} this week`}
      </Text>

      {/* Selector */}
      <View style={styles.viewToggle}>
        <Pressable style={[styles.viewToggleButton, calendarView === 'today' && styles.viewToggleButtonActive]} onPress={() => setCalendarView('today')}>
          <Text style={[styles.viewToggleText, calendarView === 'today' && styles.viewToggleTextActive]}>Today</Text>
        </Pressable>

        <Pressable style={[styles.viewToggleButton, calendarView === 'week' && styles.viewToggleButtonActive]} onPress={() => setCalendarView('week')}>
          <Text style={[styles.viewToggleText, calendarView === 'week' && styles.viewToggleTextActive]}>Week</Text>
        </Pressable>
      </View>

      {/* Currency Toggle UI */}
      <View style={styles.filterHeader}>
        <Text style={styles.filterLabel}>News currencies</Text>

        <Pressable style={styles.filterButton} onPress={() => setCurrencyFilterOpen((current) => !current)}>
          <Text style={styles.filterButtonText}>
            {getCurrencyFilterLabel()}
          </Text>

          <Ionicons name={currencyFilterOpen ? 'chevron-up' : 'chevron-down'} size={14} color='#777' style={{marginLeft: 4}} />
        </Pressable>
      </View>

      {currencyFilterOpen && (
        <View style={styles.currencyFilter}>
          {CURRENCIES.map((currency) => {
            const selected = selectedCurrencies.includes(currency);

            return (
              <Pressable key={currency} style={[styles.currencyFilterButton, selected && styles.currencyFilterButtonSelected]} onPress={() => toggleCurrency(currency)}>
                <Text style={[styles.currencyFilterText, selected && styles.currencyFilterTextSelected]}>{currency}</Text>
              </Pressable>
            )
          })}
        </View>
      )}

      <NextNewsCard newsWindow={nextNews} />

      <SectionList
        sections={visibleSections}
        keyExtractor={(item) => `${item.country}-${item.title}-${item.date}`}
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <Text style={styles.dayHeading}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.currencyBadge}>
                <Text style={styles.currency}>{item.country}</Text>
              </View>
              <Text style={styles.time}>{formatTime(item.date)}</Text>

              <View style={styles.impactBadge}>
                <Text style={styles.impact}>HIGH</Text>
              </View>
            </View>

            <Text style={styles.title}>{item.title}</Text>

            <View style={styles.dataRow}>
              <Text style={styles.data}>Forecast: {item.forecast || '-'}</Text>
              <Text style={styles.data}>Previous: {item.previous || '-'}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={<AppVersion style={styles.versionText} />}
        ListEmptyComponent={calendarView === 'today' ? (
          <View style={styles.emptyToday}>
            <Text style={styles.emptyTodayTitle}>No high-impact news today</Text>

            <Text style={styles.emptyTodayText}>There are no scheduled high-impact events today.</Text>
          </View>
        ) : null}
      />
    </SafeAreaView>
  );
}
