import { View, Text, StyleSheet } from "react-native"
import { Button } from "../ui/elements/buttons/Button"

export const FactoryModal = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.smallText}>Вы уверены, что хотите сбросить сетевые настройки до заводских? </Text>
            <Text style={styles.smallText}>При сбросе данные о сохранённых пользовательских настройках удалятся, контроллер перейдёт на заводской IP-адрес указанный на плате. <Text style={[styles.smallText, styles.bold]}>Произойдет разрыв подключения.</Text></Text>
            <View style={styles.hr}></View>
            <Button 
                title='Сбросить'
                onPress={()=>{}}
                size="M"
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