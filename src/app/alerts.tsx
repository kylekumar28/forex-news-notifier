/** biome-ignore-all assist/source/organizeImports: <Executive decision> */
import {
  CURRENCIES,
  getNotificationSettings,
  saveNotificationSettings,
  type Currency,
} from '@/services/notificationSettings';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import {
  InputAccessoryView,
  Keyboard,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './alerts.styles';

const MINUTES_INPUT_ACCESSORY_ID = 'minutes-input-accessory';

export default function AlertsScreen() {
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  const [selectedCurrencies, setSelectedCurrencies] = useState<Currency[]>([]);

  const [beforeEnabled, setBeforeEnabled] = useState(false);
  const [beforeMinutes, setBeforeMinutes] = useState('10');

  const [afterEnabled, setAfterEnabled] = useState(false);
  const [afterMinutes, setAfterMinutes] = useState('8');

  useEffect(() => {
    async function loadSettings() {
      const settings = await getNotificationSettings();

      setSelectedCurrencies(settings.selectedCurrencies);
      setBeforeEnabled(settings.beforeEnabled);
      setBeforeMinutes(settings.beforeMinutes);
      setAfterEnabled(settings.afterEnabled);
      setAfterMinutes(settings.afterMinutes);
      setSettingsLoaded(true);
    }

    loadSettings();
  }, []);

  useEffect(() => {
    if (!settingsLoaded) {
      return;
    }

    saveNotificationSettings({
      selectedCurrencies,
      beforeEnabled,
      beforeMinutes,
      afterEnabled,
      afterMinutes,
    });
  }, [
    settingsLoaded,
    selectedCurrencies,
    beforeEnabled,
    beforeMinutes,
    afterEnabled,
    afterMinutes,
  ]);

  const requestNotificationPermissions = async () => {
    const currentPermissions = await Notifications.getPermissionsAsync();

    if (currentPermissions.status === 'granted') {
      return true;
    }

    const requestedPermissions = await Notifications.requestPermissionsAsync();

    return requestedPermissions.status === 'granted';
  };

  const sendTestNotification = async () => {
    const hasPermission = await requestNotificationPermissions();

    if (!hasPermission) {
      console.log('Notification permission denied');
      return;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔴 GBP High-Impact News',
        body: 'Test notification - imagine GBP news is approaching',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10,
      },
    });

    console.log('Notification scheduled:', notificationId);
  };

  const toggleCurrency = (currency: Currency) => {
    setSelectedCurrencies((current) => {
      if (current.includes(currency)) {
        return current.filter((item) => item !== currency);
      }

      return [...current, currency];
    });
  };

  const selectAll = () => {
    setSelectedCurrencies([...CURRENCIES]);
  };

  const selectNone = () => {
    setSelectedCurrencies([]);
  };

  const testScheduler = async () => {
    const eventTime = new Date(Date.now() + 2 * 60 * 1000);

    const fakeEvent = {
      title: 'Test CPI',
      country: 'USD',
      date: eventTime.toISOString(),
      impact: 'High' as const,
      forecast: '0.3%',
      previous: '0.2%',
    };

    const settings = await getNotificationSettings();

    console.log('Fake event:', fakeEvent);
    console.log('Notification settings:', settings);

    console.log('Scheduled notifications:');
  };

  return (
    <SafeAreaView style={styles.container}>
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
                  onPress={() => toggleCurrency(currency)}
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
            <Pressable onPress={selectAll} style={styles.actionButton}>
              <Text style={styles.actionText}>Select All</Text>
            </Pressable>

            <Pressable onPress={selectNone} style={styles.actionButton}>
              <Text style={styles.actionText}>Select None</Text>
            </Pressable>
          </View>
        </View>

        {/* Before news */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.settingHeader}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Before News</Text>

                <Text style={styles.settingDescription}>
                  Warn me before high-impact news.
                </Text>
              </View>

              <Switch value={beforeEnabled} onValueChange={setBeforeEnabled} />
            </View>

            <View
              style={[styles.intervalRow, !beforeEnabled && styles.disabled]}
            >
              <Text style={styles.intervalLabel}>Notify me</Text>

              <TextInput
                value={beforeMinutes}
                onChangeText={setBeforeMinutes}
                inputAccessoryViewID={MINUTES_INPUT_ACCESSORY_ID}
                keyboardType='number-pad'
                editable={beforeEnabled}
                style={styles.minutesInput}
                maxLength={3}
              />

              <Text style={styles.intervalSuffix}>minutes before</Text>
            </View>

            <View style={styles.preview}>
              <Text style={styles.previewLabel}>Example</Text>

              <Text style={styles.previewTitle}>
                🔴 USD High-Impact News in {beforeMinutes || '0'} Minutes
              </Text>

              <Text style={styles.previewBody}>
                High-impact USD news is approaching.
              </Text>
            </View>
          </View>
        </View>

        {/* After news */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.settingHeader}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>After News</Text>

                <Text style={styles.settingDescription}>
                  Notify me when my post-news waiting period ends.
                </Text>
              </View>

              <Switch value={afterEnabled} onValueChange={setAfterEnabled} />
            </View>

            <View
              style={[styles.intervalRow, !afterEnabled && styles.disabled]}
            >
              <Text style={styles.intervalLabel}>Notify me</Text>

              <TextInput
                value={afterMinutes}
                onChangeText={setAfterMinutes}
                inputAccessoryViewID={MINUTES_INPUT_ACCESSORY_ID}
                keyboardType='number-pad'
                editable={afterEnabled}
                style={styles.minutesInput}
                maxLength={3}
              />

              <Text style={styles.intervalSuffix}>minutes before</Text>
            </View>

            <View style={styles.preview}>
              <Text style={styles.previewLabel}>Example</Text>

              <Text style={styles.previewTitle}>🟢 USD News Buffer Ended</Text>

              <Text style={styles.previewBody}>
                Your {afterMinutes || '0'}-minute post-news waiting period has
                ended.
              </Text>
            </View>
          </View>
        </View>

        {/* Test notification */}
        <View style={styles.testSection}>
          <Text style={styles.testTitle}>Notification Testing</Text>

          <Text style={styles.testDescription}>
            Schedule a test notification for 10 seconds from now.
          </Text>

          <Pressable style={styles.testButton} onPress={sendTestNotification}>
            <Text style={styles.testButtonText}>
              Test Notification - 10 Seconds
            </Text>
          </Pressable>
        </View>

        <View style={styles.testSection}>
          <Text style={styles.testTitle}>Scheduler Testing</Text>

          <Text style={styles.testDescription}>
            Creates a fake USD high-impact event 2 minutes from now.
          </Text>

          <Pressable style={styles.testButton} onPress={testScheduler}>
            <Text style={styles.testButtonText}>Test Scheduler</Text>
          </Pressable>
        </View>
      </ScrollView>
      {/* </Pressable> */}

      {/* Inupt accessory */}
      <InputAccessoryView nativeID={MINUTES_INPUT_ACCESSORY_ID}>
        <View style={styles.keyboardToolbar}>
          <Pressable onPress={Keyboard.dismiss}>
            <Text style={styles.keyboardDone}>Done</Text>
          </Pressable>
        </View>
      </InputAccessoryView>
    </SafeAreaView>
  );
}
