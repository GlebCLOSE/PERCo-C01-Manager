import { Slot } from 'expo-router';
import { Header } from '../components/ui/header/header';
import { Main } from '../components/ui/main/main';

export default function RootLayout() {
  return (
    <>
        <Header />
        <Main>
          <Slot /> {/* Здесь будет отображаться текущий экран */}
        </Main>
    </>
  );
}