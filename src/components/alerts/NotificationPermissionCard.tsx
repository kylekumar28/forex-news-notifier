import { Pressable, Text, View } from "react-native";

import type { NotificationPermission } from "@/hooks/useNotificationPermission";
import { styles } from "@/styles/alerts.styles";

type Props = {
  permission: NotificationPermission;
  onEnable: () => void;
};

export function NotificationPermissionCard({ permission, onEnable }: Props) {
  if (permission === "loading" || permission === "granted") {
    return null;
  }

  return (
    <View style={styles.permissionCard}>
      <Text style={styles.permissionTitle}>Notifications are disabled</Text>

      <Text style={styles.permissionDescription}>
        Enable notifications to receive your high-impact news warnings and
        post-news alerts.
      </Text>

      <Pressable style={styles.permissionButton} onPress={onEnable}>
        <Text style={styles.permissionButtonText}>
          {permission === "denied"
            ? "Open Notification Settings"
            : "Enable Notifications"}
        </Text>
      </Pressable>
    </View>
  );
}
