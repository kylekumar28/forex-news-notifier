/** biome-ignore-all assist/source/organizeImports: <bug> */
import { AppVersion } from '@/components/AppVersion';
import { EconomicEventCard } from '@/components/EconomicEventCard';
import {
  getNotificationSettings,
  type Currency,
} from '@/services/notificationSettings';
import { groupEventsByDay } from '@/utils/economicCalendar';
import {
  formatEventTime,
  isCalendarStale,
  isPastEvent,
} from '@/utils/homeCalendar';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getEconomicCalendar,
  getEconomicCalendarUpdatedAt,
  type EconomicEvent,
} from '../services/economicCalendar';
import { styles } from '../styles/home.styles';

export default function HomeScreen() {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertCurrencies, setAlertCurrencies] = useState<Currency[]>([]);
  const [newsFilter, setNewsFilter] = useState<'alerts' | 'all'>('alerts');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const [data, calendarUpdatedAt] = await Promise.all([
          getEconomicCalendar(),
          getEconomicCalendarUpdatedAt(),
        ]);

        const highImpactEvents = data.filter(
          (event) => event.impact === 'High',
        );

        setUpdatedAt(calendarUpdatedAt);
        setEvents(highImpactEvents);
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

  useFocusEffect(
    useCallback(() => {
      async function loadAlertCurrencies() {
        const settings = await getNotificationSettings();

        setAlertCurrencies(settings.selectedCurrencies);
      }

      loadAlertCurrencies();
    }, []),
  );

  const filteredEvents =
    newsFilter === 'all'
      ? events
      : events.filter((event) =>
          alertCurrencies.includes(event.country as Currency),
        );

  const sections = groupEventsByDay(filteredEvents);

  const calendarStale = isCalendarStale(updatedAt);

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
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headingRow}>
        <Text style={styles.heading}>High Impact News</Text>

        {updatedAt && (
          <View style={styles.updatedAtRow}>
            {calendarStale && (
              <Ionicons name='warning-outline' size={12} color='#d6a84b' />
            )}

            <Text
              style={[styles.updatedAt, calendarStale && styles.updatedAtStale]}
            >
              Updated {formatEventTime(updatedAt)}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.subheading}>
        {filteredEvents.length}{' '}
        {filteredEvents.length === 1 ? 'event' : 'events'} this week
      </Text>

      {/* News filter */}
      <View style={styles.newsFilter}>
        <Pressable
          style={[
            styles.newsFilterButton,
            newsFilter === 'alerts' && styles.newsFilterButtonActive,
          ]}
          onPress={() => setNewsFilter('alerts')}
        >
          <Text
            style={[
              styles.newsFilterText,
              newsFilter === 'alerts' && styles.newsFilterTextActive,
            ]}
          >
            My Alerts
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.newsFilterButton,
            newsFilter === 'all' && styles.newsFilterButtonActive,
          ]}
          onPress={() => setNewsFilter('all')}
        >
          <Text
            style={[
              styles.newsFilterText,
              newsFilter === 'all' && styles.newsFilterTextActive,
            ]}
          >
            All News
          </Text>
        </Pressable>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => `${item.country}-${item.title}-${item.date}`}
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <Text style={styles.dayHeading}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <EconomicEventCard event={item} past={isPastEvent(item.date)} />
        )}
        ListFooterComponent={<AppVersion style={styles.versionText} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
              No high-impact news this week
            </Text>

            {newsFilter === 'alerts' && (
              <Text style={styles.emptyStateText}>
                No events match your alert currencies
              </Text>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}
