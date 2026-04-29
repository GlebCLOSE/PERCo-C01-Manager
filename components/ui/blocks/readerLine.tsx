import { View, Text, Image, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { IconButton } from '../elements/buttons/IconButton';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';

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

export const ReaderLine = ({
  number = 0,
  type = 'Wiegand',
  exdevNumber = 1,
  exdevDirNumber = 0,
  onPress,
}: {
  number?: number;
  type?: string;
  exdevNumber?: number;
  exdevDirNumber?: number;
  onPress: () => void;
}) => {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  let readerIcon = require('../../../assets/icons/reader.png');
  let readerInterface = 'no-info';

  switch (type) {
    case 'Wiegand':
      readerIcon = require('../../../assets/icons/reader.png');
      readerInterface = 'Wiegand';
      break;
    case 'Barcode':
      readerIcon = require('../../../assets/icons/barcode.png');
      readerInterface = 'Сканер-QR';
      break;
  }

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
        <Image source={readerIcon} style={{ height: 38, width: 13 }} />
        <Text style={styles.label}>{readerInterface}</Text>
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>ИУ:</Text>
        <Image source={exdevIcon} style={{ height: 28, width: 21 }} />
        <Text style={styles.label}>{exdevName}</Text>
        <Text style={styles.label}>{exdevDirNumber === 0 ? 'Вход' : 'Выход'}</Text>
      </View>
      <IconButton hasBorder={false} icon={settingsIcon} size="s" onPress={onPress} />
    </View>
  );
};
