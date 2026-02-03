import React, { Children } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconButton } from '../elements/buttons/IconButton';
import { BlurView } from 'expo-blur';

interface ErrorModalProps {
  title: string;
  visible: boolean;
  isWarn?: boolean;
  onClose: () => void;
  children?: React.ReactNode; 
}

export const ModalChildren = ({ title, visible, isWarn=false, onClose, children }: ErrorModalProps) => {
   
  const iconClose = require('../../../assets/icons/close.png')
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalWrapper}>
          <BlurView 
            intensity={60}
            tint="light"
            experimentalBlurMethod={'dimezisBlurView'}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.modalContainer}>
            <View style={{flexDirection: 'row', width:'100%', justifyContent:'space-between', alignItems: 'center'}}>
                <Text style={styles.modalTitle}>{title}</Text>
                <IconButton hasBorder={false} onPress={onClose} size={'s'} icon={iconClose}/>
            </View>
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalWrapper: {
    width: '90%',
    backgroundColor: '#ffffffb4',
    borderRadius: 20,
    borderColor: '#ffffff86',
    borderWidth: 1,
    overflow: 'hidden'
  },
  wrapperWarn: {
    backgroundColor: '#fff1e99c',
    borderRadius: 20,
    borderColor: '#ffffff86',
  },
  modalContainer: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000670e1',
  },
  titleWarn: {
    color: '#580000e1',
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#4d4d4d',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});