import { View, Text, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { IconButton } from '../elements/buttons/IconButton';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';
import { themedIcon } from '../../../constants/themedIcons';

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      alignSelf: 'stretch',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 7,
      backgroundColor: p.cardTint,
      borderWidth: 1,
      borderColor: p.cardBorder,
      boxShadow: p.cardShadowSoft,
      borderRadius: 5,
    },
    textBlock: {
      flex: 1,
      gap: 4,
      paddingRight: 8,
    },
    name: {
      fontFamily: 'inter',
      fontSize: 16,
      fontWeight: '400',
      color: p.textPrimary,
    },
    idLabel: {
      fontFamily: 'inter',
      fontSize: 12,
      fontWeight: '300',
      color: p.textSecondary,
    },
  });
}

export function AccessUserLine({
  fullName,
  identifier,
  onPress,
}: {
  fullName: string;
  identifier: string;
  onPress: () => void;
}) {
  const { palette, scheme } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const settingsIcon = useMemo(() => themedIcon('settings', scheme), [scheme]);

  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.name} numberOfLines={2}>
          {fullName}
        </Text>
        <Text style={styles.idLabel} numberOfLines={1}>
          ID: {identifier}
        </Text>
      </View>
      <IconButton hasBorder={false} icon={settingsIcon} size="s" onPress={onPress} />
    </View>
  );
}
