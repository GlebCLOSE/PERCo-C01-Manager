import { View, Text, Image, Button } from 'react-native';
import checkIcon from '../../assets/status/connected.png'; // иконка успешного подключения
import { useRouter } from 'expo-router';

export default function ControllerScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Image source={checkIcon} style={{ width: 30, height: 30 }} />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>C01 Firmware v1.0.7</Text>
          <Text style={{ fontSize: 14 }}>IP: 192.168.2.75</Text>
        </View>
      </View>
      <Button title="Сетевые настройки" onPress={() => router.push('/network')} />
      <Button title="Команды" onPress={() => router.push('/commands')} />
      <Button title="События" onPress={() => router.push('/events')} />
      <Button title="Веб-интерфейс" onPress={() => router.push('/web')} />
    </View>
  );
}