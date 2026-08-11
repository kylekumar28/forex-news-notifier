import { refreshNotificationSchedule } from "@/services/notificationManager";
import { CURRENCIES, Currency, getNotificationSettings, saveNotificationSettings } from "@/services/notificationSettings";
import { getScheduledNewsNotificationCount } from "@/services/scheduledNotifications";
import { useEffect, useRef, useState } from "react";

export function useAlertSettings() {
  const [settingsLoaded, setSettingsLoaded] =
    useState(false);

  const [selectedCurrencies, setSelectedCurrencies] =
    useState<Currency[]>([]);

  const [beforeEnabled, setBeforeEnabled] =
    useState(false);

  const [beforeMinutes, setBeforeMinutes] =
    useState('10');

  const [afterEnabled, setAfterEnabled] =
    useState(false);

  const [afterMinutes, setAfterMinutes] =
    useState('8');

  const [scheduledCount, setScheduledCount] =
    useState(0);

  const initialLoadComplete = useRef(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings =
          await getNotificationSettings();

        setSelectedCurrencies(
          settings.selectedCurrencies,
        );

        setBeforeEnabled(
          settings.beforeEnabled,
        );

        setBeforeMinutes(
          settings.beforeMinutes,
        );

        setAfterEnabled(
          settings.afterEnabled,
        );

        setAfterMinutes(
          settings.afterMinutes,
        );

        const count =
          await getScheduledNewsNotificationCount();

        setScheduledCount(count);

        setSettingsLoaded(true);
      } catch (error) {
        console.error(
          'Failed to load notification settings:',
          error,
        );
      }
    }

    loadSettings();
  }, []);

  useEffect(() => {
    if (!settingsLoaded) {
      return;
    }

    // Don't immediately save/rebuild just because
    // the saved settings were loaded into state.
    if (!initialLoadComplete.current) {
      initialLoadComplete.current = true;
      return;
    }

    const timeout = setTimeout(() => {
      async function saveAndRefresh() {
        try {
          await saveNotificationSettings({
            selectedCurrencies,
            beforeEnabled,
            beforeMinutes,
            afterEnabled,
            afterMinutes,
          });

          console.log(
            'Notification settings saved',
          );

          const scheduled =
            await refreshNotificationSchedule();

          setScheduledCount(
            scheduled.length,
          );
        } catch (error) {
          console.error(
            'Failed to update notification settings:',
            error,
          );
        }
      }

      saveAndRefresh();
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    settingsLoaded,
    selectedCurrencies,
    beforeEnabled,
    beforeMinutes,
    afterEnabled,
    afterMinutes,
  ]);

  const toggleCurrency = (
    currency: Currency,
  ) => {
    setSelectedCurrencies((current) =>
      current.includes(currency)
        ? current.filter(
            (item) => item !== currency,
          )
        : [...current, currency],
    );
  };

  const selectAll = () => {
    setSelectedCurrencies([...CURRENCIES]);
  };

  const selectNone = () => {
    setSelectedCurrencies([]);
  };

  return {
    selectedCurrencies,
    setSelectedCurrencies,

    beforeEnabled,
    setBeforeEnabled,
    beforeMinutes,
    setBeforeMinutes,

    afterEnabled,
    setAfterEnabled,
    afterMinutes,
    setAfterMinutes,

    scheduledCount,
    setScheduledCount,

    toggleCurrency,
    selectAll,
    selectNone,
  };
}