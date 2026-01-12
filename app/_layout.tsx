import { Slot } from 'expo-router';
import { Header } from '../components/ui/header/header';
import { Main } from '../components/ui/main/main';
import { ControllerProvider } from '../providers/ControllerContext'

export default function RootLayout() {
  return (
    <ControllerProvider>
        <Header />
        <Main>
          <Slot /> {/* Здесь будет отображаться текущий экран */}
        </Main>
    </ControllerProvider>
  );
};