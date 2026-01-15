import { View, Image, StyleSheet, Text } from "react-native"
import { Button } from "../elements/buttons/Button"

export interface RememberedDeviceProps {
  name: string,
  ip: string,
  password: string,
  small?: boolean
}

export const RememberedDevice: React.FC<RememberedDeviceProps> = ({name, ip, password, small}) => {
    return (
        <View style={styles.container}>
            <View style={styles.block}>
                <Image source={require('../../../assets/icons/controller.png')} />
                <View style={styles.nameIp}>
                    <Text style={styles.text}>Имя: {name}</Text>
                    <Text style={styles.text}>IP: {ip}</Text>
                </View>
            </View>
            <View style={styles.block}>
              {!small && <Button title='Удалить' onPress={()=>{}} size='S'/>}
              <Button title='Подключить' onPress={()=>{}} size='S'/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    padding: 7,
    backgroundColor: '#adc4ff31',
    borderWidth: 1,
    borderColor: '#00067057' 
  },
  block: {
    gap: 5,
    flexDirection: 'row',
  },
  nameIp: {
    flexDirection: 'column',
    gap: 5
  },
  text: {
    color: '#00067057',
    fontSize: 16,
    fontWeight: 'light',
  },
});