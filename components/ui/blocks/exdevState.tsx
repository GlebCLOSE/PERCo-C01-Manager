import { View, Image, StyleSheet, Text } from 'react-native';
import { useMemo } from 'react';

import { SmallStateBlock } from '../elements/smallStateBlock';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';

export interface ExdevStateProps {
  number: 0 | 1;
  type: 'lock' | 'turnstyle' | 'gate' | 'double lock';
  acm: 'control' | 'open';
  status: 'unlocked' | 'lock' | 'break';
  pass: 'active' | 'normal';
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
      gap: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    label: {
      color: p.textSecondary,
      fontSize: 13,
    },
  });
}

export const ExdevState: React.FC<ExdevStateProps> = ({
  number,
  type,
  acm,
  status,
  pass,
}) => {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  let colorAcm = '#000';
  switch (acm) {
    case 'control':
      colorAcm = '#ff6600d5';
      break;
    case 'open':
      colorAcm = '#3bb200c2';
      break;
  }
  let colorPass = '#000';
  switch (pass) {
    case 'active':
      colorPass = '#ff9100b7';
      break;
    case 'normal':
      colorPass = '#0048ffc2';
      break;
  }
  let colorStatus = '#000';
  switch (status) {
    case 'unlocked':
      colorStatus = '#3bb200c2';
      break;
    case 'lock':
      colorStatus = '#070157ce';
      break;
    case 'break':
      colorStatus = '#ff0000cc';
      break;
  }

  let image = require('../../../assets/icons/controller.png');
  let exdevName = 'Замок1';
  switch (type) {
    case 'lock':
    case 'double lock':
      image = require('../../../assets/icons/lock.png');
      exdevName = 'Замок';
      break;
    case 'turnstyle':
      image = require('../../../assets/icons/turnstyle.png');
      exdevName = 'Турникет';
      break;
    case 'gate':
      image = require('../../../assets/icons/gate.png');
      exdevName = 'Шлагбаум';
      break;
  }

  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <Text style={styles.label}>{number + 1}</Text>
        <View style={styles.vr} />
        <Image source={image} style={{ height: 43, width: 33 }} />
        <Text style={styles.label}>{exdevName}</Text>
      </View>
      <View style={styles.block}>
        <SmallStateBlock
          title={'режим'}
          value={acm}
          bottomBlockStyle={{ backgroundColor: colorAcm }}
        />
        <SmallStateBlock
          title={'датчик'}
          value={pass}
          bottomBlockStyle={{ backgroundColor: colorPass }}
        />
        <SmallStateBlock
          title={'статус'}
          value={status}
          bottomBlockStyle={{ backgroundColor: colorStatus }}
        />
      </View>
    </View>
  );
};
