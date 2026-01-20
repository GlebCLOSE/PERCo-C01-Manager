import { View, Image, StyleSheet, Text } from "react-native"
import { useState } from "react"
import { useRouter } from "expo-router"

import { Button } from "../elements/buttons/Button"
import { attemptConnection } from "../../../utils/attemptConnection"
import { useController } from "../../../providers/ControllerContext"
import ErrorModal from "../status/ErrorModal"

export interface ExdevStateProps {
    number: 0 | 1,
    type: 'lock' | 'turnstyle' | 'gate' | 'double lock',
    acm: 'control' | 'open',
    status: 'unlocked' | 'locked' | 'break',
    pass: 'active' | 'normal'
}

export const ExdevState: React.FC<ExdevStateProps> = ({ number, type, acm, status, pass}) => {

    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter()

    let image 
    let exdevName
    //Изображение и название меняются при разных типах ИУ(type)
    switch (type){
        case 'lock':
            image = require('../../../assets/icons/controller.png')
            exdevName = 'Замок'
            break;
        case 'turnstyle':
            image = require('../../../assets/icons/controller.png')
            exdevName = 'Турникет'
            break;
        case 'gate':
            image = require('../../../assets/icons/controller.png')
            exdevName = 'Шлагбаум'
            break;
    }

    return (
      <>
        <View style={styles.container}>
          <View style={styles.block}>
            <Text>{(number + 1)}</Text>
            <View style={styles.vr}></View>
            <Image source={image} />
            <Text>{exdevName}</Text>
          </View>
          <View style={styles.block}>
            {/**  три блока */}
          </View>
        </View>
        <ErrorModal
          visible={isErrorModalVisible}
          message={errorMessage}
          onClose={() => setIsErrorModalVisible(false)}
        />
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