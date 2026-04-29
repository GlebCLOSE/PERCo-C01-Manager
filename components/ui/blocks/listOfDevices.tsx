import { View, Text, StyleSheet } from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import { RememberedDevice } from './rememberedDevice';
import { Button } from '../elements/buttons/Button';
import { useRouter, useFocusEffect } from 'expo-router';
import { getDevices } from '../../../storage/deviceStorage';
import type { Device } from '../../../types/device';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    window: {
      width: '100%',
      borderWidth: 1,
      borderColor: p.listWindowBorder,
      backgroundColor: p.listWindowBg,
      borderRadius: 10,
      overflow: 'hidden',
      boxShadow: p.cardShadowSoft,
    },
    header: {
      backgroundColor: p.listSelectedBg,
      width: '100%',
      height: 34,
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: 7,
    },
    headerText: {
      fontSize: 16,
      color: p.listSelectedText,
    },
    list: {
      flexDirection: 'column',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 7,
      gap: 7,
    },
    emptyText: {
      alignSelf: 'stretch',
      textAlign: 'center',
      fontSize: 14,
      color: p.textSecondary,
      fontFamily: 'inter',
      paddingVertical: 4,
    },
  });
}

export const ListOfDevices = () => {
  const router = useRouter();
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const [firstDevice, setFirstDevice] = useState<Device | null | undefined>(
    undefined,
  );

  const refresh = useCallback(() => {
    void (async () => {
      const list = await getDevices();
      setFirstDevice(list[0] ?? null);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return (
    <View style={styles.window}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Запомненные устройства</Text>
      </View>
      <View style={styles.list}>
        {firstDevice === undefined ? null : firstDevice ? (
          <RememberedDevice
            name={firstDevice.name}
            ip={firstDevice.ip}
            password={firstDevice.password ?? ''}
            small={true}
          />
        ) : (
          <Text style={styles.emptyText}>Нет запомненных устройств</Text>
        )}
        <Button
          title="Список устройств →"
          onPress={() => router.push('/remembered')}
          size="S"
          customStyles={{
            backgroundColor: palette.listRowBg,
            borderWidth: 1,
            borderColor: palette.listRowBorder,
            borderRadius: 5,
            width: '100%',
          }}
          customTextStyles={{ color: palette.listRowText }}
        />
      </View>
    </View>
  );
};
