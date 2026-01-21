import { View, Image, StyleSheet, Text } from "react-native"
import { useState } from "react"
import { useRouter } from "expo-router"

import { Button } from "../elements/buttons/Button"
import { attemptConnection } from "../../../utils/attemptConnection"
import { useController } from "../../../providers/ControllerContext"
import ErrorModal from "../status/ErrorModal"
import { SmallStateBlock } from "../elements/smallStateBlock"

export interface ExdevStateProps {
    number: 0 | 1,
    type: 'lock' | 'turnstyle' | 'gate' | 'double lock',
    acm: 'control' | 'open',
    status: 'unlocked' | 'locked' | 'break',
    pass: 'active' | 'normal'
}

export const ExdevState: React.FC<ExdevStateProps> = ({ number, type, acm, status, pass}) => {

    const router = useRouter()

    let colorAcm = '#000'
    switch(acm){
      case 'control':
        colorAcm = '#ff6600d5'
      case 'open':
        colorAcm = '#3bb200c2'
    }
    let colorPass = '#000'
    switch(pass){
      case 'active':
        colorPass = '#ff9100b7'
      case 'normal':
        colorPass = '#0048ffc2'
    }
    let colorStatus = '#000'
    switch(status){
      case 'unlocked':
        colorStatus = '#3bb200c2'
      case 'locked':
        colorStatus = '#070157ce'
      case 'break':
        colorStatus = '#ff0000cc'
    }

    let image = require('../../../assets/icons/controller.png')
    let exdevName = 'Замок'
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
            <SmallStateBlock 
              title={'режим'}
              value={acm}
              bottomBlockStyle={{backgroundColor: colorAcm}}
            />
            <SmallStateBlock 
              title={'датчик'}
              value={pass}
              bottomBlockStyle={{backgroundColor: colorPass}}
            />
            <SmallStateBlock 
              title={'статус'}
              value={status}
              bottomBlockStyle={{backgroundColor: colorStatus}}
            />
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