/** biome-ignore-all assist/source/organizeImports: <bug> */
import type { EconomicEvent } from '@/services/economicCalendar';
import { styles } from '@/styles/home.styles';
import { formatEventTime } from '@/utils/homeCalendar';
import { Text, View } from 'react-native';

type Props = {
  event: EconomicEvent;
  past: boolean;
};

export function EconomicEventCard({ event, past }: Props) {
  return (
    <View style={[styles.card, past && styles.cardPast]}>
      <View style={styles.cardHeader}>
        <View style={[styles.currencyBadge, past && styles.currencyBadgePast]}>
          <Text style={[styles.currency, past && styles.textPast]}>
            {event.country}
          </Text>
        </View>

        <Text style={[styles.time, past && styles.textPast]}>
          {formatEventTime(event.date)}
        </Text>

        <View style={[styles.impactBadge, past && styles.impactBadgePast]}>
          <Text style={[styles.impact, past && styles.impactPast]}>HIGH</Text>
        </View>
      </View>

      <Text style={[styles.title, past && styles.titlePast]}>
        {event.title}
      </Text>

      <View style={styles.dataRow}>
        {event.actual ? (
          <Text style={[styles.data, past && styles.textPast]}>
            Actual: {event.actual}
          </Text>
        ) : null}

        <Text style={[styles.data, past && styles.textPast]}>
          Forecast: {event.forecast || '-'}
        </Text>

        <Text style={[styles.data, past && styles.textPast]}>
          Previous: {event.previous || '-'}
        </Text>
      </View>
    </View>
  );
}
