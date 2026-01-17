import { View, Text, StyleSheet, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/elements/buttons/Button";
import { RememberedDevice } from "../components/ui/blocks/rememberedDevice";
import { Device } from "../types/device";
import { getDevices, saveDevice } from "../storage/deviceStorage";

export default function RememberedScreen() {

    const [devices, setDevices] = useState<Device[]>([]);

    useEffect(() => {
        loadDevices();
    }, []);

    // тестовая функция добавления 
    const handleAddDevice = async () => {
        const success = await saveDevice('Новый сервер', '192.168.1.100', 'secret');
        if (success) {
        await loadDevices(); // Обновляем список
        }
    };

    const loadDevices = async () => {
        const loadedDevices = await getDevices();
        setDevices(loadedDevices);
    };

    const d = {
        name: 'Device',
        ip: '172.17.2.10',
        password: ''
    };

    const renderItem = ({ item }: { item: Device }) => (
        <RememberedDevice name={item.name} ip={item.ip} password={item.password}/>
  );

    return (
        <View style={styles.window}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Запомненные устройства</Text>
            </View>
            <View style={styles.list}>
                <RememberedDevice name={d.name} ip={d.ip} password={d.password} small={true}/>
                <FlatList
                    data={devices}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<Text>Нет устройств</Text>}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    window: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#00067033',
        backgroundColor: '#e8f8ff73',
        borderRadius: 10,
        overflow: 'hidden'
    },
    header: { 
        backgroundColor: '#0A3A99',
        width: '100%',
        height: 34,
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 7
    },
    headerText: {
        fontSize: 16,
        color: '#ffffffe0'
    },
    list: {
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        justifyContent:'center',
        padding: 7,
        gap: 7
    },

})