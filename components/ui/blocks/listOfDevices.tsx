import { View, Text, StyleSheet } from "react-native"
import { RememberedDevice, RememberedDeviceProps } from "./rememberedDevice"
import { Button } from "../elements/buttons/Button"
import { useRouter } from "expo-router"

export const ListOfDevices = () => {
    
    const router = useRouter();

    const d = {
        name: 'Device',
        ip: '172.17.2.10',
        password: ''
    };

    return (
        <View style={styles.window}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Запомненные устройства</Text>
            </View>
            <View style={styles.list}>
                <RememberedDevice name={d.name} ip={d.ip} password={d.password} small={true}/>
                                <Button
                  title='Список устройств ->'
                  onPress={() => router.push('/remembered')}
                  size='S'
                  borderRadiusStyle='sharp'
                  customStyles={{ backgroundColor: '#ffffffe0', borderWidth: 1, borderColor: '#1A2253', width: '100%'}}
                  customTextStyles={{color: '#1A2253'}}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    window: {
        width: '100%',
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