import { TextInput, Button, View, Text } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function ConnectForm() {
  const [ip, setIp] = useState('');
  const [password, setPassword] = useState('');
  const [deviceName, setDeviceName] = useState('');

  const router = useRouter();

  const handleConnect = () => {
    // Логика подключения по WebSocket (например, вызов API)
    // При успешном подключении — перенаправление на экран управления
    router.push('/controller');
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>Подключение к контроллеру</Text>
      <TextInput
        placeholder="IP-адрес"
        value={ip}
        onChangeText={setIp}
        style={{ borderColor: '#ddd', borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Пароль (если требуется)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderColor: '#ddd', borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Имя контроллера"
        value={deviceName}
        onChangeText={setDeviceName}
        style={{ borderColor: '#ddd', borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button title="Подключиться" onPress={handleConnect} />
    </View>
  );
}