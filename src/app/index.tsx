/** biome-ignore-all assist/source/organizeImports: <Executive decision> */
import { AppVersion } from '@/components/AppVersion';
import { NextNewsCard } from '@/components/NextNewsCard';
import { groupEventsByDay } from '@/utils/economicCalendar';
import { getNextNewsWindow } from '@/utils/newsWindow';
import { createNewsWindows } from '@/utils/newsWindows';
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

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        // const data = await getEconomicCalendar();
        const [data, calendarUpdatedAt] = await Promise.all([getEconomicCalendar(), getEconomicCalendarUpdatedAt()]);

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

  const sections = groupEventsByDay(events);

  const todayEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const today = new Date();

    return (
      eventDate.getFullYear() === today.getFullYear() && eventDate.getMonth() === today.getMonth() && eventDate.getDate() === today.getDate()
    )
  });

  const todaySections = groupEventsByDay(todayEvents);

  const visibleSections = calendarView === 'today' ? todaySections : sections;

  const newsWindow = createNewsWindows(events);

  const nextNews = getNextNewsWindow(newsWindow);

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
        {calendarView === 'today' ? `${todayEvents.length} events today` : `${events.length} events this week`}
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
