import { View, Text, StyleSheet } from "react-native"
import { Button } from "../ui/elements/buttons/Button"
import { useState } from "react";
import { useControllerConfig } from "../../hooks/useControllerConfig";
import ModalText from "../ui/status/ModalText";
export const FactoryModal = () => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [resultMessage, setResultMessage] = useState('');

    const { setDefaultNetwork } = useControllerConfig();

    const handleSetDefaultNetwork = async () => {
        try {
            const result = await setDefaultNetwork();
            if(result?.answer?.network==='ok') {    
                setResultMessage('Сброс успешно выполнен')
                setIsModalVisible(true)
            } else {
                setResultMessage('Ошибка при передаче данных')
                setIsModalVisible(true)
            }   
        } catch (e) {
            setResultMessage('Сетевая ошибка')
            setIsModalVisible(true)
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.smallText}>Вы уверены, что хотите сбросить сетевые настройки до заводских? </Text>
            <Text style={styles.smallText}>При сбросе данные о сохранённых пользовательских настройках удалятся, контроллер перейдёт на заводской IP-адрес указанный на плате. <Text style={[styles.smallText, styles.bold]}>Произойдет разрыв подключения.</Text></Text>
            <View style={styles.hr}></View>
            <Button 
                title='Сбросить'
                onPress={()=>handleSetDefaultNetwork()}
                size="S"
                isWarn={true}
            />
            <ModalText
                title={'Ответ'} 
                message={resultMessage}
                visible={isModalVisible}
                onClose={()=> setIsModalVisible(false)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { 
        width: '100%',
        gap: 7 
    },
    smallText: {
        fontFamily: 'inter',
        fontSize: 12,
        color: '#580000',
        fontWeight: '300'
    },
    bold: {
        fontWeight: '800'
    },
    hr: {
        height: 1,
        backgroundColor: '#580000'
    }
})