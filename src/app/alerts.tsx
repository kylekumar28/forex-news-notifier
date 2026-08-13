/** biome-ignore-all assist/source/organizeImports: <Executive decision> */
import { AlertStatusCard } from '@/components/alerts/AlertStatusCard';
import { AlertTimingCard } from '@/components/alerts/AlertTimingCard';
import { CurrencySelector } from '@/components/alerts/CurrencySelector';
import { NotificationPermissionCard } from '@/components/alerts/NotificationPermissionCard';
import { AppVersion } from '@/components/AppVersion';
import { MINUTES_INPUT_ACCESSORY_ID } from '@/constants/notifications';
import { useAlertSettings } from '@/hooks/useAlertSettings';
import { useNotificationPermission } from '@/hooks/useNotificationPermission';
import { normaliseMinutes } from '@/utils/notificationInputs';
import {
  InputAccessoryView,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/alerts.styles';

type NotificationPermission =
  | 'loading'
  | 'granted'
  | 'denied'
  | 'undetermined';

export default function AlertsScreen() {
  const {selectedCurrencies, beforeEnabled, setBeforeEnabled, beforeMinutes, setBeforeMinutes, afterEnabled, setAfterEnabled, afterMinutes, setAfterMinutes, scheduledCount, setScheduledCount, toggleCurrency, selectAll, selectNone} = useAlertSettings();

  const {permission, enableNotifications} = useNotificationPermission(setScheduledCount);

  const alertsActive = permission === 'granted' && selectedCurrencies.length > 0 && (beforeEnabled || afterEnabled);

  const finishEditingMinutes = () => {
    setBeforeMinutes(normaliseMinutes(beforeMinutes));
    setAfterMinutes(normaliseMinutes(afterMinutes));

    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}> */}
      <ScrollView
        keyboardShouldPersistTaps='handled'
        keyboardDismissMode='on-drag'
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Alerts</Text>

        <Text style={styles.subheading}>
          Configure your economic news notifications.
        </Text>

        <NotificationPermissionCard permission={permission} onEnable={enableNotifications} />

        <CurrencySelector selectedCurrencies={selectedCurrencies} onToggle={toggleCurrency} onSelectAll={selectAll} onSelectNone={selectNone} />

        <AlertTimingCard
          type='before'
          enabled={beforeEnabled}
          minutes={beforeMinutes}
          onEnabledChange={setBeforeEnabled}
          onMinutesChange={setBeforeMinutes}
        />

        <AlertTimingCard
          type='after'
          enabled={afterEnabled}
          minutes={afterMinutes}
          onEnabledChange={setAfterEnabled}
          onMinutesChange={setAfterMinutes}
        />

        <AlertStatusCard active={alertsActive} selectedCurrencies={selectedCurrencies} scheduledCount={scheduledCount} />

        <AppVersion style={styles.versionText} />
      </ScrollView>
      {/* </Pressable> */}

      {/* Inupt accessory */}
      <InputAccessoryView nativeID={MINUTES_INPUT_ACCESSORY_ID}>
        <View style={styles.keyboardToolbar}>
          <Pressable onPress={finishEditingMinutes}>
            <Text style={styles.keyboardDone}>Done</Text>
          </Pressable>
        </View>
      </InputAccessoryView>
    </SafeAreaView>
  );
}
