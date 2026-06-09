import Constants from 'expo-constants';
import { PermissionsAndroid, Platform } from 'react-native';

export const BG_RECEIVE_PREF_KEY = '@perco_controller_bg_receive_v2';

const APP_SCHEME =
  (Constants.expoConfig?.scheme as string | undefined) ??
  (Array.isArray(Constants.expoConfig?.scheme)
    ? Constants.expoConfig.scheme[0]
    : undefined) ??
  'c01manager';

/**
 * Удерживает JS/UI-процесс активнее при свёрнутом приложении на Android через foreground notification.
 * Требует dev-client / prebuild и зависимость `react-native-background-actions`.
 */
let running = false;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Запрашивает разрешение на уведомления (Android 13+). */
export async function ensureAndroidBgPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  if (typeof Platform.Version === 'number' && Platform.Version < 33) return true;

  try {
    const alreadyGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (alreadyGranted) return true;

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch (e) {
    console.warn('PERCo-C01: не удалось запросить разрешение на уведомления', e);
    return false;
  }
}

export async function startAndroidReceiveKeepAlive(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  if (running) return true;

  const permissionsOk = await ensureAndroidBgPermissions();
  if (!permissionsOk) return false;

  try {
    const BackgroundService = require('react-native-background-actions').default;
    if (!BackgroundService?.start) {
      console.warn('PERCo-C01: react-native-background-actions недоступен');
      return false;
    }

    const task = async (args?: { delay: number }) => {
      const delay = args?.delay ?? 15_000;
      while (BackgroundService.isRunning()) {
        await sleep(delay);
      }
    };

    const options = {
      taskName: 'PERCoC01Receive',
      taskTitle: 'C01 Manager',
      taskDesc: 'Приём событий с контроллера PERCo C01',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: '#2e86ab',
      linkingURI: `${APP_SCHEME}://`,
      foregroundServiceType: ['dataSync'],
      parameters: { delay: 15_000 },
    };

    await BackgroundService.start(task, options);
    running = true;
    return true;
  } catch (e) {
    console.warn('PERCo-C01: не удалось запустить фоновый режим приёма', e);
    running = false;
    return false;
  }
}

export async function stopAndroidReceiveKeepAlive(): Promise<void> {
  if (Platform.OS !== 'android') return;
  try {
    const BackgroundService = require('react-native-background-actions').default;
    if (BackgroundService?.isRunning?.()) {
      await BackgroundService.stop();
    }
  } catch (e) {
    console.warn('PERCo-C01: остановка фонового режима', e);
  } finally {
    running = false;
  }
}
