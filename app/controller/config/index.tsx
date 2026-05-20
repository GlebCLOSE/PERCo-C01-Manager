import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "../../../components/ui/elements/buttons/Button";


export default function ConfigScreen() {

    const router = useRouter();

    return (
        <View style={{ flex: 1, width: '100%', gap: 10 }}>
            <Button title="Сеть" onPress={() => router.push('/controller/config/network')} size='Long' />
            <Button title="Исполн. устр-ва" onPress={() => router.push('/controller/config/exdev')} size='Long' />
            <Button title="Считыватели" onPress={() => router.push('/controller/config/readers')} size='Long'/>
            <Button title="Физические контакты" onPress={() => router.push('/controller/config/pads')} size='Long'/>
            <Button title="Внутренние реакции" onPress={() => router.push('/controller/config/crefs')} size='Long'/>
        </View>
    );
}