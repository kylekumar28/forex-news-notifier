import AsyncStorage from '@react-native-async-storage/async-storage';

export const CURRENCIES = [
  'AUD',
  'CAD',
  'CHF',
  'CNY',
  'EUR',
  'GBP',
  'JPY',
  'NZD',
  'USD',
] as const;

export type Currency = (typeof CURRENCIES)[number];

export type NotificationSettings = {
  selectedCurrencies: Currency[];

  beforeEnabled: boolean;
  beforeMinutes: string;

  afterEnabled: boolean;
  afterMinutes: string;
};

const SETTINGS_KEY = 'notification_settings';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  selectedCurrencies: ['USD'],
  beforeEnabled: true,
  beforeMinutes: '10',
  afterEnabled: true,
  afterMinutes: '8',
};

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const stored = await AsyncStorage.getItem(SETTINGS_KEY);

  if (!stored) {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }

  try {
    return JSON.parse(stored) as NotificationSettings;
  } catch (error) {
    console.error('Failed to parse notification settings:', error);

    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export async function saveNotificationSettings(
  settings: NotificationSettings,
): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
