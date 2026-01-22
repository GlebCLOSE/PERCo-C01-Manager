import { Button } from '../../components/ui/elements/buttons/Button';
import { useRouter } from 'expo-router';
import { useController } from '../../providers/ControllerContext';

export default function ControllerScreen() {
  const router = useRouter();
  const { ipAddress, isConnected } = useController();

  return (
    <>
      <Button title="Команды" onPress={() => router.push('/controller/commands')} size='Long' />
      <Button title="События" onPress={() => router.push('/controller/events')} size='Long' />
      <Button title="Конфигурация" onPress={() => router.push('/controller/config')} size='Long'/>
      <Button title="Пользователи" onPress={() => router.push('/controller/users')} size='Long'/>
    </>
  );
}