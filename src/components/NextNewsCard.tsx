import { styles } from "@/styles/nextNews.styles";
import { NewsWindow } from "@/utils/newsWindows";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

type Props = {
  newsWindow: NewsWindow | null;
}

export function NextNewsCard({ newsWindow }: Props) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  if (!newsWindow) {
    return (
      <View style={styles.clearCard}>
        <Ionicons name='checkmark-circle-outline' size={18} color='#777' />
        <Text style={styles.clearText}>No more high-impact news this week</Text>
      </View>
    )
  }

  const eventTime = new Date(newsWindow.date);

  const title = newsWindow.events.length === 1 ? newsWindow.events[0].title : `${newsWindow.events.length} high-impact releases`

  const formatEventTime = (date: Date) => {
    const day = date.toLocaleDateString([], {
      weekday: 'short'
    })

    const time = date.toLocaleDateString([], {
      hour: '2-digit',
      minute: '2-digit'
    })

    return `${day} • ${time}`;
  };

  const formatCountdown = (milliseconds: number) => {
    if (milliseconds <= 0) return 'Now';

    const totalMinutes = Math.ceil(milliseconds / 60_000);

    if (totalMinutes < 60) {
      return totalMinutes === 1 ? '1 minute' : `${totalMinutes} minutes`
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (minutes === 0) {
      return hours === 1 ? '1 hour' : `${hours} hours`
    }

    return `${hours}h ${minutes}m`
  }

  return (
    <View style={styles.card}>
      <Text style={styles.label}>NEXT HIGH-IMPACT NEWS</Text>

      <View style={styles.headerRow}>
        <View>
          <Text style={styles.currency}>{newsWindow.currency}</Text>

          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.impactBadge}>
          <Text style={styles.impact}>HIGH</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.date}>{formatEventTime(eventTime)}</Text>

        <Text style={styles.countdown}>{formatCountdown(eventTime.getTime() - now)}</Text>
      </View>
    </View>
  )
}