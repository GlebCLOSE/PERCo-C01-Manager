import type { ImageSourcePropType } from 'react-native';
import type { SchemeName } from './theme';

const ICONS = {
  addiu: {
    light: require('../assets/icons/addiu.png'),
    dark: require('../assets/icons/dark-theme/addiu-white.png'),
  },
  addReader: {
    light: require('../assets/icons/addReader.png'),
    dark: require('../assets/icons/dark-theme/addReader-white.png'),
  },
  arrowDropdown: {
    light: require('../assets/icons/arrow-dropdown-blue.png'),
    dark: require('../assets/icons/dark-theme/arrow-dropdown-white.png'),
  },
  close: {
    light: require('../assets/icons/close.png'),
    dark: require('../assets/icons/dark-theme/close-white.png'),
  },
  factory: {
    light: require('../assets/icons/factory.png'),
    dark: require('../assets/icons/dark-theme/factory-white.png'),
  },
  filter: {
    light: require('../assets/icons/Filter.png'),
    dark: require('../assets/icons/dark-theme/filter-white.png'),
  },
  log: {
    light: require('../assets/icons/log.png'),
    dark: require('../assets/icons/dark-theme/log-white.png'),
  },
  password: {
    light: require('../assets/icons/password.png'),
    dark: require('../assets/icons/dark-theme/password-white.png'),
  },
  refresh: {
    light: require('../assets/icons/refresh.png'),
    dark: require('../assets/icons/dark-theme/refresh.png'),
  },
  servers: {
    light: require('../assets/icons/servers.png'),
    dark: require('../assets/icons/dark-theme/servers-white.png'),
  },
  settings: {
    light: require('../assets/icons/settings.png'),
    dark: require('../assets/icons/dark-theme/settings-white.png'),
  },
  stats: {
    light: require('../assets/icons/Stats.png'),
    dark: require('../assets/icons/dark-theme/stats-white.png'),
  },
} as const satisfies Record<string, Record<SchemeName, ImageSourcePropType>>;

export type ThemedIconKey = keyof typeof ICONS;

export function themedIcon(
  key: ThemedIconKey,
  scheme: SchemeName,
): ImageSourcePropType {
  return ICONS[key][scheme];
}
