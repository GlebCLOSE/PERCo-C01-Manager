import { View, Image, StyleSheet, Text } from "react-native"

export const rememberedDevice: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.block}>
                <Image></Image>
                <View>
                    <Text>Имя: </Text>
                    <Text>IP: </Text>
                </View>
            </View>
            <View style={styles.block}>
                {/* здесь должны быть две маленькие кнопки, синяя и красная */ }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    padding: 7,
    backgroundColor: '#adc4ff31',
    borderWidth: 1,
    borderColor: '#00067057' 
  },
  block: {
    gap: 5,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});