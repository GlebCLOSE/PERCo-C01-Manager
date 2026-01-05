import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Modal, Image } from 'react-native';
import { useState } from 'react';
import { CustomButton } from './components/CustomButton'
import { Header } from './components/ui/header/header';
import { Main } from './components/ui/main/main';
import { NoConnection } from './components/ui/status/no_connection';
import { ButtonIcon } from './components/ui/elements/buttons/ButtonIcon';

export default function App() {

  const [state, setState] = useState(false) 
  function openModal() { setState(true); }  
  function closeModal() { setState(false) } 

  return (
    <>
      <Header />
      <Main>
        <NoConnection />
        <ButtonIcon 
          title='connect'
          onPress={openModal}
          icon={require('./assets/icons/connect_button.png')}
        />
      </Main>
    </>
  );
};
