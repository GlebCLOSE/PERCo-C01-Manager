import { View } from 'react-native';
import { Slot } from 'expo-router';
import { Header } from '../components/ui/header/header';
import { Main } from '../components/ui/main/main';
import { ControllerProvider } from '../providers/ControllerContext';

export default function RootLayout() {
  const shell = (
    <View style={{ flex: 1 }}>{[<Header key="header" />, <Main key="main"><Slot /></Main>]}</View>
  );

  return <ControllerProvider>{shell}</ControllerProvider>;
}
