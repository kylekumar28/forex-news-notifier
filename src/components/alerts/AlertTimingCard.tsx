import { Switch, Text, TextInput, View } from "react-native";

import { MINUTES_INPUT_ACCESSORY_ID } from "@/constants/notifications";
import { styles } from "@/styles/alerts.styles";
import {
  normaliseMinutes,
  sanitiseMinuteInput,
} from "@/utils/notificationInputs";

type Props = {
  type: "before" | "after";
  enabled: boolean;
  minutes: string;
  onEnabledChange: (enabled: boolean) => void;
  onMinutesChange: (minutes: string) => void;
};

export function AlertTimingCard({
  type,
  enabled,
  minutes,
  onEnabledChange,
  onMinutesChange,
}: Props) {
  const before = type === "before";

  const title = before ? "Before News" : "After News";

  const description = before
    ? "Warn me before high-impact news."
    : "Notify me when my post-news waiting period ends.";

  return (
    <View style={styles.section}>
      <View style={styles.card}>
        <View style={styles.settingHeader}>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>{title}</Text>

            <Text style={styles.settingDescription}>{description}</Text>
          </View>

          <Switch value={enabled} onValueChange={onEnabledChange} />
        </View>

        <View style={[styles.intervalRow, !enabled && styles.disabled]}>
          <Text style={styles.intervalLabel}>Notify me</Text>

          <TextInput
            value={minutes}
            onChangeText={(value) =>
              onMinutesChange(sanitiseMinuteInput(value))
            }
            onEndEditing={() => onMinutesChange(normaliseMinutes(minutes))}
            selectTextOnFocus
            inputAccessoryViewID={MINUTES_INPUT_ACCESSORY_ID}
            keyboardType="number-pad"
            editable={enabled}
            style={styles.minutesInput}
            maxLength={3}
          />

          <Text style={styles.intervalSuffix}>
            minutes {before ? "before" : "after"}
          </Text>
        </View>

        <View style={styles.preview}>
          <Text style={styles.previewLabel}>Example</Text>

          {before ? (
            <>
              <Text style={styles.previewTitle}>
                🔴 USD News in {minutes || "0"} min
              </Text>

              <Text style={styles.previewBody}>
                13:30 • Core CPI m/m
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.previewTitle}>🟢 USD News Buffer Ended</Text>

              <Text style={styles.previewBody}>
                13:30 event • {minutes || '0'}-min post-news wait complete
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}
