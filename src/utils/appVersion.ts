import * as Application from 'expo-application';

export function getAppVersion() {
  return Application.nativeApplicationVersion ?? 'dev';
}