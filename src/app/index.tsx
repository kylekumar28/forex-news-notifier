/** biome-ignore-all assist/source/organizeImports: <Executive decision> */
import { rebuildWeeklyNotificationSchedule } from '@/services/notificationScheduler';
import { getNotificationSettings } from '@/services/notificationSettings';
import { groupEventsByDay } from '@/utils/economicCalendar';
import { createNewsWindows } from '@/utils/newsWindows';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SectionList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  type EconomicEvent,
  getEconomicCalendar,
} from '../services/economicCalendar';
import { styles } from './index.styles';

export default function HomeScreen() {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getEconomicCalendar();

        const windows = createNewsWindows(data);

        console.log('NEWS WINDOWS');
        console.log(windows);

        const settings = await getNotificationSettings();

        const scheduled = await rebuildWeeklyNotificationSchedule(
          windows,
          settings,
        );

        console.log('Scheduled:', scheduled);

        const highImpactEvents = data.filter(
          (event) => event.impact === 'High',
        );

        console.log(highImpactEvents);

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
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>High Impact News</Text>

      <Text style={styles.subheading}>{events.length} events this week</Text>

      <SectionList
        sections={sections}
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
      />

      {/* <FlatList
        data={events}
        keyExtractor={(item, index) =>
          `${item.country}-${item.title}-${item.date}-${index}`
        }
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.topRow}>
              <View style={styles.currencyBadge}>
                <Text style={styles.currency}>{item.country}</Text>
              </View>

              <View style={styles.impactBadge}>
                <Text style={styles.impact}>HIGH</Text>
              </View>
            </View>

            <Text style={styles.title}>{item.title}</Text>

            <Text style={styles.date}>{formatDate(item.date)}</Text>

            <View style={styles.dataRow}>
              <Text style={styles.data}>Forecast: {item.forecast || '-'}</Text>

              <Text style={styles.data}>Previous: {item.previous || '-'}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No high impact events this week.</Text>
        }
      /> */}
    </SafeAreaView>
  );
}
