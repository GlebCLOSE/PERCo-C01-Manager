import { View, Text, Image, StyleSheet } from 'react-native'
import { IconButton } from '../elements/buttons/IconButton';

export const ExdevLine = ({number = 0, type = 'lock'}) => {

    const settingsIcon = require('../../../assets/icons/settings.png')
    let exdevName = 'Замок'
    let exdevIcon = require('../../../assets/icons/lock.png')
    switch (type){
        case 'lock':
        case 'double lock':
            exdevIcon = require('../../../assets/icons/lock.png')
            exdevName = 'Замок'
            break;
        case 'turnstyle':
            exdevIcon = require('../../../assets/icons/turnstyle.png')
            exdevName = 'Турникет'
            break;
        case 'gate':
            exdevIcon = require('../../../assets/icons/gate.png')
            exdevName = 'Шлагбаум'
            break;
    }
    //Функция позволяющая по номеру ИУ, узнать его тип


    return (
            <>
              <View style={styles.container}>
                <View style={styles.block}>
                  <Text>{(number + 1)}</Text>
                  <View style={styles.vr}></View>
                  <Image source={exdevIcon} style={{height: 36, width: 27}}/>
                  <Text>{exdevName}</Text>
                </View>
                <IconButton hasBorder={false} icon={settingsIcon} size='s' onPress={()=>{}}/>
              </View>
            </>
          )
      };
      
      const styles = StyleSheet.create({
        container: {
          width: '100%',
          flexDirection: 'row',
          alignSelf: 'stretch',
          justifyContent: 'space-between',
          padding: 7,
          backgroundColor: '#adc4ff31',
          borderWidth: 1,
          borderColor: '#00067057',
          boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.1)',
          borderRadius: 5
        },
        vr: {
          height: '100%',
          width: 1,
          backgroundColor: '#00067057'
        },
        block: {
          gap: 6,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        },
        nameIp: {
          flexDirection: 'column',
          gap: 5
        },
        text: {
          color: '#00067057',
          fontSize: 12,
          fontWeight: 'light',
        },
    });