import { Text, StyleSheet, ScrollView, View, FlatList, ActivityIndicator } from "react-native";
import { WarningText } from "../../../components/ui/blocks/warningText";
import { PadLine } from "../../../components/ui/blocks/padLine";
import { PadDetails } from "../../../components/modal-content/padDetails";
import { ModalChildren } from "../../../components/ui/status/ModalChildren";
import { useState, useCallback } from "react";
import { useFocusEffect } from 'expo-router';
import { useControllerConfig } from "../../../hooks/useControllerConfig";
import { PadParams } from "../../../hooks/useControllerConfig";
import { IconButton } from "../../../components/ui/elements/buttons/IconButton";

export default function PadsScreen() {

    const { getInfo } = useControllerConfig()
    const [activePad, setActivePad] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [padList, setPadList] = useState([])
    
    const refreshIcon = require("../../../assets/icons/refresh.png")

    const handleGetPadInfo = useCallback(async () => {
        setIsLoading(true);
        try {
            // Теперь data — это массив ответов: [{"answer":..., "pad":...}, {...}]
            const responses: any = await getInfo('pad', 'all');
            
            // Извлекаем только объекты pad из каждого ответа
            const padArray = responses
                .map((item: any) => item.pad)
                .filter((pad: any) => pad !== undefined);

            // Сортируем по номеру
            padArray.sort((a, b) => a.number - b.number);

            setPadList(padArray);
        } catch (error) {
            console.error("Ошибка:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            handleGetPadInfo();

            return () => {};
        }, [handleGetPadInfo])
    );

    const closeModal = () => {
        setActivePad('')
    }

    const ItemSeparator = () => (
        <View style={{ height: 10, backgroundColor: 'transparent' }} /> // Adjust height for vertical gap
    );


    return (
        <>
            <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 10 }}>
                <View style={styles.titleBlock}>
                    <Text style={styles.title}>Физические контакты</Text>
                    <IconButton 
                        onPress={handleGetPadInfo}
                        icon={refreshIcon}
                        hasBorder={false}
                    />
                </View>
                <WarningText text="Необдуманные действия в этом разделе могут привести к некорректной работе контроллера"/>
                <View>
                    <FlatList
                        data={padList}
                        style={{gap: 10}}
                        renderItem={({item})=><PadLine number={item.number} type={item.function}  onPress={()=>{setActivePad(item)}}/>}
                        ItemSeparatorComponent={ItemSeparator}
                    /> 
                </View>
                <ModalChildren title={'Вход'} visible={activePad !== ''} onClose={closeModal}>
                    <PadDetails data={activePad}/>
                </ModalChildren>
                {isLoading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text style={{ marginTop: 10, color: '#fff' }}>Загрузка данных...</Text>
                    </View>
                )}
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    titleBlock: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    title: {
        fontFamily: 'inter',
        fontSize: 24,
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