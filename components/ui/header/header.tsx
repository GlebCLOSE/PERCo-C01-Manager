import React, { useMemo, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Linking,
  Pressable,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';
import { ModalChildren } from '../status/ModalChildren';

const APP_DISPLAY_NAME = 'C01 Manager';
const APP_DESCRIPTION =
  'Мобильное приложение для управления контроллером PERCo C01 через открытый API: подключение по WebSocket, команды, настройка сети и получение событий.';
const GITHUB_URL = 'https://github.com/GlebCLOSE/PERCo-C01-Manager';
const DEVELOPER_NAME = 'GlebCLOSE';

const appVersion =
  Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '—';

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 30,
      paddingBottom: 15,
      paddingHorizontal: 20,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    themeButton: {
      padding: 8,
      minWidth: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    themeButtonText: {
      fontSize: 22,
    },
    infoButton: {
      padding: 4,
    },
    infoIcon: {
      width: 28,
      height: 28,
      tintColor: p.headerIconTint,
    },
    headerText: {
      color: p.textOnHeader,
      fontSize: 32,
      fontWeight: 'bold',
      fontFamily: 'inter',
      flexShrink: 1,
      marginRight: 8,
    },
    aboutModalBody: {
      width: '100%',
      alignSelf: 'stretch',
      marginTop: 8,
      maxHeight: 420,
    },
    modalScroll: {
      flexGrow: 0,
    },
    row: {
      marginBottom: 14,
    },
    rowLast: {
      marginBottom: 0,
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      color: p.modalMuted,
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      fontFamily: 'inter',
    },
    value: {
      fontSize: 16,
      color: p.modalPrimaryText,
      fontFamily: 'inter',
    },
    valueMultiline: {
      lineHeight: 22,
    },
    link: {
      fontSize: 15,
      color: p.modalLink,
      textDecorationLine: 'underline',
      fontFamily: 'inter',
    },
  });
}

export const Header: React.FC = () => {
  const [aboutVisible, setAboutVisible] = useState(false);
  const { palette, toggleScheme } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const themeEmoji = palette.scheme === 'dark' ? '☀️' : '🌙';

  return (
    <>
      <LinearGradient
        colors={[...palette.headerGradient]}
        style={styles.header}
      >
        <Text style={styles.headerText}>{APP_DISPLAY_NAME}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={toggleScheme}
            style={styles.themeButton}
            accessibilityRole="button"
            accessibilityLabel={
              palette.scheme === 'dark'
                ? 'Включить светлую тему'
                : 'Включить тёмную тему'
            }
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.themeButtonText}>{themeEmoji}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setAboutVisible(true)}
            style={styles.infoButton}
            accessibilityRole="button"
            accessibilityLabel="Информация о приложении"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Image
              source={require('../../../assets/icons/info.png')}
              style={styles.infoIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ModalChildren
        title="О приложении"
        visible={aboutVisible}
        onClose={() => setAboutVisible(false)}
      >
        <View style={styles.aboutModalBody}>
          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            <InfoRow
              label="Название"
              value={APP_DISPLAY_NAME}
              palette={palette}
            />
            <InfoRow label="Версия" value={appVersion} palette={palette} />
            <InfoRow
              label="Описание"
              value={APP_DESCRIPTION}
              multiline
              palette={palette}
            />
            <View style={styles.row}>
              <Text style={styles.label}>GitHub</Text>
              <Pressable onPress={() => Linking.openURL(GITHUB_URL)}>
                <Text style={styles.link}>{GITHUB_URL}</Text>
              </Pressable>
            </View>
            <InfoRow
              label="Разработчик"
              value={DEVELOPER_NAME}
              isLast
              palette={palette}
            />
          </ScrollView>
        </View>
      </ModalChildren>
    </>
  );
};

function InfoRow({
  label,
  value,
  multiline,
  isLast,
  palette,
}: {
  label: string;
  value: string;
  multiline?: boolean;
  isLast?: boolean;
  palette: AppPalette;
}) {
  const styles = useMemo(() => createStyles(palette), [palette]);
  return (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, multiline && styles.valueMultiline]}>
        {value}
      </Text>
    </View>
  );
}
