import { View, Text, Image } from 'react-native';
import { Button } from '../../components/ui/elements/buttons/Button';
import checkIcon from '../../assets/status/connected.png'; // иконка успешного подключения
import { useRouter } from 'expo-router';
import { useController } from '../../providers/ControllerContext';
import { Slot } from 'expo-router';

export default function ControllerScreen() {
  const router = useRouter();
  const { ipAddress, isConnected } = useController();

  return (
    <View style={{ flex: 1, padding: 20, gap: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <Image source={checkIcon} style={{ width: 75, height: 72 }} />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Контроллер: {ipAddress ?? 'Не определен'} </Text>
          <Text style={{ fontSize: 14 }}>Статус: {isConnected ? 'В сети' : 'Оффлайн'}</Text>
          <Button title='Состояние' onPress={() => router.push('/controller/state')} size='S' borderRadiusStyle='sharp' customStyles={{ backgroundColor: '#ffffffe0', borderWidth: 1, borderColor: '#1A2253'}} customTextStyles={{color: '#1A2253'}}></Button>
        </View>
      </View>
      <Slot />
    </View>
  );
}