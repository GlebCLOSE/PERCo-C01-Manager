import { View, Text, Image, StyleSheet } from 'react-native';
import { Button, BorderRadiusStyle } from '../../components/ui/elements/buttons/Button';
import checkIcon from '../../assets/status/connected.png';
import { useRouter } from 'expo-router';
import { useController } from '../../providers/ControllerContext';
import { Slot } from 'expo-router';
import { useMemo } from 'react';
import { useTheme } from '../../providers/ThemeContext';
import type { AppPalette } from '../../constants/theme';

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    divider: {
      height: 1,
      width: '100%',
      backgroundColor: p.textPrimary,
    },
  });
}

export default function ControllerScreen() {
  const router = useRouter();
  const { ipAddress, isConnected } = useController();
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <View style={{ flex: 1, gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Image source={checkIcon} style={{ width: 75, height: 72 }} />
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: palette.textPrimary,
            }}
          >
            Контроллер: {ipAddress ?? 'Не определен'}{' '}
          </Text>
          <Text style={{ fontSize: 14, color: palette.textSecondary }}>
            Статус: {isConnected ? 'В сети' : 'Оффлайн'}
          </Text>
          <Button
            title="Состояние"
            onPress={() => router.push('/controller/state')}
            size="S"
            borderRadiusStyle={BorderRadiusStyle.SHARP}
            customStyles={{
              backgroundColor: palette.listRowBg,
              borderWidth: 1,
              borderColor: palette.listRowBorder,
            }}
            customTextStyles={{ color: palette.listRowText }}
          />
        </View>
      </View>
      <View style={styles.divider} />
      <Slot />
    </View>
  );
}
