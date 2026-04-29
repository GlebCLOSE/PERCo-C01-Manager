import { NoConnection } from '../components/ui/status/no_connection';
import { ButtonIcon } from '../components/ui/elements/buttons/ButtonIcon';
import { useRouter } from 'expo-router';
import { ListOfDevices } from '../components/ui/blocks/listOfDevices';

export default function App() {

  const router = useRouter();

  return (
    <>
      <ListOfDevices/>
      <NoConnection />
      <ButtonIcon 
        title='Подключиться'
        onPress={() => router.push('/connect')}
        icon={require('../assets/icons/connect_button.png')}
      />
    </>
  );
}
