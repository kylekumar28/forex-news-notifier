import { Text, View } from "react-native";

import type { Currency } from "@/services/notificationSettings";

import { styles } from "@/styles/alerts.styles";

type Props = {
  active: boolean;
  selectedCurrencies: Currency[];
  scheduledCount: number;
};

export function AlertStatusCard({
  active,
  selectedCurrencies,
  scheduledCount,
}: Props) {
  return (
    <View style={styles.statusCard}>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Notifications</Text>

        <Text
          style={[
            styles.statusValue,
            active ? styles.statusActive : styles.statusInactive,
          ]}
        >
          {active ? "Active" : "Inactive"}
        </Text>
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Currencies</Text>

        <Text style={styles.statusValue}>
          {selectedCurrencies.length} selected
        </Text>
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Scheduled alerts</Text>

        <Text style={styles.statusValue}>{scheduledCount}</Text>
      </View>
    </View>
  );
}
