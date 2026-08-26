import AsyncStorage from '@react-native-async-storage/async-storage';
import { push, ref, set, update } from 'firebase/database';
import { Platform } from 'react-native';

import { getAppVersion } from '@/utils/appVersion';
import { database } from './firebase';

const DEVICE_ID_KEY = 'tradefence_diagnostic_device_id';

async function getDiagnosticsDeviceId() {
  const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);

  if (existing) return existing;

  const id = `tf_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  await AsyncStorage.setItem(DEVICE_ID_KEY, id);

  return id;
}

export async function updateDiagnosticState(data: Record<string, unknown>) {
  try {
    const deviceId = await getDiagnosticsDeviceId();

    await update(ref(database, `diagnostics/devices/${deviceId}`), {
      ...data,
      platform: Platform.OS,
      appVersion: getAppVersion(),
      lastSeenAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Failed to update diagnostics:`, error);
  }
}

export async function logDiagnosticEvent(
  type: string,
  data: Record<string, unknown> = {},
) {
  try {
    const deviceId = await getDiagnosticsDeviceId();

    const eventRef = push(ref(database, `diagnostics/events/${deviceId}`));

    await set(eventRef, {
      type,
      ...data,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log diagnostic event:', error);
  }
}
