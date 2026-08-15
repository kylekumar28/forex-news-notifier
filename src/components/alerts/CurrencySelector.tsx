import { Pressable, Text, View } from "react-native";

import { CURRENCIES, type Currency } from "@/services/notificationSettings";
import { styles } from "@/styles/alerts.styles";

type Props = {
  selectedCurrencies: Currency[];
  onToggle: (currency: Currency) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
};

export function CurrencySelector({
  selectedCurrencies,
  onToggle,
  onSelectAll,
  onSelectNone,
}: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Currencies</Text>

        <Text style={styles.selectedCount}>
          {selectedCurrencies.length}/{CURRENCIES.length}
        </Text>
      </View>

      <Text style={styles.description}>
        Choose which currencies you want high-impact news alerts for.
      </Text>

      <View style={styles.currencyGrid}>
        {CURRENCIES.map((currency) => {
          const selected = selectedCurrencies.includes(currency);

          return (
            <Pressable
              key={currency}
              onPress={() => onToggle(currency)}
              style={[
                styles.currencyButton,
                selected && styles.currencyButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.currencyText,
                  selected && styles.currencyTextSelected,
                ]}
              >
                {currency}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.actions}>
        <Pressable onPress={onSelectAll} style={styles.actionButton}>
          <Text style={styles.actionText}>Select All</Text>
        </Pressable>

        <Pressable onPress={onSelectNone} style={styles.actionButton}>
          <Text style={styles.actionText}>Select None</Text>
        </Pressable>
      </View>
    </View>
  );
}
