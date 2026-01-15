import { View, Image, StyleSheet, Text } from "react-native"
import { useState } from "react"
import { useRouter } from "expo-router"

import { Button } from "../elements/buttons/Button"
import { attemptConnection } from "../../../utils/attemptConnection"
import { useController } from "../../../providers/ControllerContext"
import ErrorModal from "../status/ErrorModal"

export interface RememberedDeviceProps {
  name: string,
  ip: string,
  password: string,
  small?: boolean
}

export const RememberedDevice: React.FC<RememberedDeviceProps> = ({name, ip, password, small}) => {

    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter()
    const { setGlobalSocket, isConnected } = useController();

    const handleConnect = async () => {

        try {
          
          const connectionResult = await attemptConnection(ip, password);
    
          if(connectionResult.success) {
            setGlobalSocket(connectionResult.socket)
          }
    
          if (!connectionResult.success) {
            // Показываем модальное окно с ошибкой
            setErrorMessage(connectionResult.message || 'Не удалось подключиться к контроллеру C01');
            setIsErrorModalVisible(true);
            return;
          }
    
          // Успешное подключение — переход на экран управления
          router.push('/controller');
        } catch (error) {
          // Обработка сетевых ошибок и других исключений
          setErrorMessage('Произошла непредвиденная ошибка при подключении');
          setIsErrorModalVisible(true);
        }
    };

    return (
      <>
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
            <Button title='Подключить' onPress={handleConnect} size='S'/>
            </View>
        </View>
        <ErrorModal
          visible={isErrorModalVisible}
          message={errorMessage}
          onClose={() => setIsErrorModalVisible(false)}
        />
      </>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
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