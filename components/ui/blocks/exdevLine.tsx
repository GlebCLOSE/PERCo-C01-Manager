import { View, Text, Image, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { IconButton } from '../elements/buttons/IconButton';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';

interface ExdevLineProps {
  number: number;
  type: 'lock' | 'double lock' | 'turnstyle' | 'gate';
  onPress: () => void;
}

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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      color: p.textSecondary,
      fontSize: 12,
    },
  });
}

export const ExdevLine: React.FC<ExdevLineProps> = ({
  number = 0,
  type = 'lock',
  onPress,
}) => {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const settingsIcon = require('../../../assets/icons/settings.png');
  let exdevName = 'Замок';
  let exdevIcon = require('../../../assets/icons/lock.png');
  switch (type) {
    case 'lock':
    case 'double lock':
      exdevIcon = require('../../../assets/icons/lock.png');
      exdevName = 'Замок';
      break;
    case 'turnstyle':
      exdevIcon = require('../../../assets/icons/turnstyle.png');
      exdevName = 'Турникет';
      break;
    case 'gate':
      exdevIcon = require('../../../assets/icons/gate.png');
      exdevName = 'Шлагбаум';
      break;
  }

  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <Text style={styles.label}>{number + 1}</Text>
        <View style={styles.vr} />
        <Image source={exdevIcon} style={{ height: 36, width: 27 }} />
        <Text style={styles.label}>{exdevName}</Text>
      </View>
      <IconButton hasBorder={false} icon={settingsIcon} size="s" onPress={onPress} />
    </View>
  );
};
