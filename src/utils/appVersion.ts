import * as Application from 'expo-application';
import Constants from 'expo-constants';

export function getAppVersion() {
  const expoConfigVersion = Constants.expoConfig?.version;

  if (Constants.appOwnership === 'expo') {
    return expoConfigVersion ?? 'dev';
  }

  return Application.nativeApplicationVersion ?? 'dev';
}