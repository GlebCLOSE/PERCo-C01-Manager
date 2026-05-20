import { View } from 'react-native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Header } from '../components/ui/header/header';
import { Main } from '../components/ui/main/main';
import { ControllerProvider } from '../providers/ControllerContext';
import { ThemeProvider, useTheme } from '../providers/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ControllerProvider>
        <RootChrome />
      </ControllerProvider>
    </ThemeProvider>
  );
}

function RootChrome() {
  const { palette } = useTheme();
  const statusBarStyle = palette.scheme === 'dark' ? 'light' : 'dark';

  return (
    <>
      <StatusBar style={statusBarStyle} />
      <View style={{ flex: 1 }}>
        <Header />
        <Main>
          <Slot />
        </Main>
      </View>
    </>
  );
}
