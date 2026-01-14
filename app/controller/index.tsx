import { Button } from '../../components/ui/elements/buttons/Button';
import { useRouter } from 'expo-router';
import { useController } from '../../providers/ControllerContext';

export default function ControllerScreen() {
  const router = useRouter();
  const { ipAddress, isConnected } = useController();

  return (
    <>
      <Button title="Команды" onPress={() => router.push('/commands')} size='Long' />
      <Button title="События" onPress={() => router.push('/events')} size='Long' />
      <Button title="Веб-интерфейс" onPress={() => router.push('/web')} size='Long'/>
      <Button title="Сетевые настройки" onPress={() => router.push('/network')} size='Long'/>
    </>
  );
}