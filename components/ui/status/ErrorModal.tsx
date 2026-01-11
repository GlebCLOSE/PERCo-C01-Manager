import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ErrorModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export default function ErrorModal({ visible, message, onClose }: ErrorModalProps) {
    
// можно вместо message принимать errorCode, а внутри функции написать условия, в зависимости от которых при разных ошибках будет разный текст message
// если код 404 - вывести сообщение(ошибка 404, устройство по указанному IP-адресу не найдено)
// если код 500 - 

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Ошибка подключения</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Понятно</Text>
          </TouchableOpacity>
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
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
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