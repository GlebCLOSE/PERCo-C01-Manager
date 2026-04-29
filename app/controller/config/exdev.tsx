import { Text, StyleSheet, View, FlatList, ActivityIndicator } from "react-native";
import { ButtonSquare } from "../../../components/ui/elements/buttons/buttonSquare";
import { ExdevLine } from "../../../components/ui/blocks/exdevLine";
import { useState, useCallback } from 'react'
import { ModalChildren } from "../../../components/ui/status/ModalChildren";
import { ExdevDetails } from "../../../components/modal-content/exdevDetails";
import { useFocusEffect } from "expo-router";
import { useControllerConfig } from "../../../hooks/useControllerConfig";
import { mapExdevNames } from "../../../types/maps";

export default function ExdevScreen() {

    const { getInfo } = useControllerConfig()

    const [activeExdev, setActiveExdev] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [exdevList, setExdevList] = useState([])

    const arrayExdevs: Array<Object> = [
        {
            number: 0,
            type: 'lock'
        },
        {
            number: 1,
            type: 'lock'
        }
    ]

    const handleGetExdevInfo = useCallback(async () => {
        setIsLoading(true);
        try {
            // Теперь data — это массив ответов: [{"answer":..., "Exdev":...}, {...}]
            const responses: any = await getInfo('exdev', 'all');
            
            // Извлекаем только объекты exdev из каждого ответа
            const exdevArray = responses
                .map((item: any) => item.exdev)
                .filter((exdev: any) => exdev !== undefined);

            // Сортируем по номеру
            exdevArray.sort((a, b) => a.number - b.number);

            setExdevList(exdevArray);
        } catch (error) {
            console.error("Ошибка:", error);
        } finally {
            setIsLoading(false);
        }
    }, [getInfo]);

    useFocusEffect(
        useCallback(() => {
            handleGetExdevInfo();

            return () => {};
        }, [handleGetExdevInfo])
    );

    function closeModal(){
        setActiveExdev('')
    }

    const ItemSeparator = () => (
        <View style={{ height: 10, backgroundColor: 'transparent' }} /> // Adjust height for vertical gap
    );

    const exdevTitle = mapExdevNames.get(activeExdev["type"])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Исполнительные устройства</Text>
            <View style={{gap: 5}}>
                <Text style={styles.subtitle}>Список устройств</Text>
                <FlatList
                    data={exdevList}
                    style={{gap: 10}}
                    renderItem={({item})=><ExdevLine number={item.number} type={item.type}  onPress={()=>{setActiveExdev(item)}}/>}
                    ItemSeparatorComponent={ItemSeparator}
                /> 
            </View>
            <ModalChildren title={exdevTitle} visible={activeExdev !== ''} onClose={closeModal}>
                <ExdevDetails data={activeExdev}/>
            </ModalChildren>
            <ButtonSquare title='Добавить ИУ' onPress={()=>{}} icon={require('../../../assets/icons/addiu.png')}/>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={{ marginTop: 10, color: '#fff' }}>Загрузка данных...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 20,
        justifyContent: 'flex-start'
    },
    title: {
        fontFamily: 'inter',
        fontSize: 24,
        fontWeight: '400',
        color: '#1A2253'
    },
    subtitle: {
        fontFamily: 'inter',
        fontSize: 16,
        fontWeight: '400',
        color: '#1A2253'
    },
    blockButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject, // Растягивает на весь экран
        backgroundColor: 'rgba(255, 255, 255, 0.21)', // Полупрозрачный фон
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, // Чтобы быть поверх всех элементов
    },
})