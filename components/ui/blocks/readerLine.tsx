import { View, Text, Image } from 'react-native'

export const ReaderLine = ({number, type, exdev}) => {
    return (
            <>
              <View style={styles.container}>
                <View style={styles.block}>
                  <Text>{(number + 1)}</Text>
                  <View style={styles.vr}></View>
                  <Image source={image} style={{height: 43, width: 33}}/>
                  <Text>{exdevName}</Text>
                </View>
                <View style={styles.block}>
                </View>
              </View>
            </>
          )
      }
      
      const styles = StyleSheet.create({
        container: {
          width: '100%',
          flexDirection: 'row',
          alignSelf: 'stretch',
          justifyContent: 'space-between',
          padding: 7,
          backgroundColor: '#adc4ff31',
          borderWidth: 1,
          borderColor: '#00067057',
          boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.1)',
          borderRadius: 5
        },
        vr: {
          height: '100%',
          width: 1,
          backgroundColor: '#00067057'
        },
        block: {
          gap: 5,
          flexDirection: 'row',
          alignItems: 'center'
        },
        nameIp: {
          flexDirection: 'column',
          gap: 5
        },
        text: {
          color: '#00067057',
          fontSize: 12,
          fontWeight: 'light',
        },
    });