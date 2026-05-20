import { Platform } from 'react-native';

export const BG_RECEIVE_PREF_KEY = '@perco_controller_bg_receive_v1';

/**
 * Удерживает JS/UI-процесс активнее при свёрнутом приложении на Android через foreground notification.
 * Требует dev-client / prebuild и зависимость `react-native-background-actions`.
 */
let running = false;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function startAndroidReceiveKeepAlive(): Promise<void> {
  if (Platform.OS !== 'android' || running) return;
  try {
    const BackgroundService = require('react-native-background-actions').default;

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
      linkingURI: 'exp+c01-manager://',
      parameters: { delay: 15_000 },
    };

    await BackgroundService.start(task, options);
    running = true;
  } catch (e) {
    console.warn('PERCo-C01: не удалось запустить фоновый режим приёма', e);
  }
}

export async function stopAndroidReceiveKeepAlive(): Promise<void> {
  if (Platform.OS !== 'android') return;
  try {
    const BackgroundService = require('react-native-background-actions').default;
    if (BackgroundService.isRunning()) {
      await BackgroundService.stop();
    }
  } catch (e) {
    console.warn('PERCo-C01: остановка фонового режима', e);
  } finally {
    running = false;
  }
}
