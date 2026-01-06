import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Modal, Image } from 'react-native';
import { useState } from 'react';
import { CustomButton } from '../components/CustomButton'
import { Header } from '../components/ui/header/header';
import { Main } from '../components/ui/main/main';
import { NoConnection } from '../components/ui/status/no_connection';
import { ButtonIcon } from '../components/ui/elements/buttons/ButtonIcon';
import { useRouter } from 'expo-router';

export default function App() {

  const router = useRouter();

  return (
    <>
        <NoConnection />
        <ButtonIcon 
            title='connect'
            onPress={() => router.push('/connect')}
            icon={require('../assets/icons/connect_button.png')}
        />
    </>
  );
};
