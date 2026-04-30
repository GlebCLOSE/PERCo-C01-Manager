import { View, Text, Image, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { IconButton } from '../elements/buttons/IconButton';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';
import { themedIcon } from '../../../constants/themedIcons';
import { mapCrossDestination, mapCrossSource } from '../../../types/maps';

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      alignSelf: 'stretch',
      justifyContent: 'space-between',
      padding: 7,
      backgroundColor: p.cardTint,
      borderWidth: 1,
      borderColor: p.cardBorder,
      boxShadow: p.cardShadowSoft,
      borderRadius: 5,
    },
    vr: {
      height: '100%',
      width: 1,
      backgroundColor: p.cardBorder,
    },
    block: {
      gap: 6,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    label: {
      color: p.textSecondary,
      fontSize: 12,
    },
    summary: {
      color: p.textSecondary,
      fontSize: 11,
      flexShrink: 1,
    },
  });
}

export const CrossLine = ({
  number = 0,
  source = 'activating input',
  destination = 'activated output',
  onPress,
}: {
  number?: number;
  source?: string;
  destination?: string;
  onPress: () => void;
}) => {
  const { palette, scheme } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const settingsIcon = useMemo(
    () => themedIcon('settings', scheme),
    [scheme],
  );
  const linkIcon = useMemo(() => themedIcon('servers', scheme), [scheme]);

  const sourceLabel = mapCrossSource.get(source) ?? source;
  const destLabel = mapCrossDestination.get(destination) ?? destination;

  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <Text style={styles.label}>{number}</Text>
        <View style={styles.vr} />
        <Image source={linkIcon} style={{ height: 28, width: 28 }} resizeMode="contain" />
        <Text style={styles.summary} numberOfLines={2}>
          {sourceLabel} → {destLabel}
        </Text>
      </View>
      <IconButton hasBorder={false} icon={settingsIcon} size="s" onPress={onPress} />
    </View>
  );
};
