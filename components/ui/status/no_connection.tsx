import { View, Text, Image, StyleSheet } from 'react-native';




export const NoConnection: React.FC = () => {
  return (
    <View style={styles.status}>
        <Image source={require('../../../assets/status/no_connection.png')}/>
        <Text style={styles.text}>No controllers connected</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  status: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', 
  },
  text: {
    color: '#000670d0', // Цвет текста
    fontSize: 24,
    fontWeight: 100,
    fontFamily: 'inter',
    width: 185,
    textAlign: 'center',
  },
});