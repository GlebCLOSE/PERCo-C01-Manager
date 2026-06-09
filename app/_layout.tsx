import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { IntroVideoScreen } from '../components/IntroVideoScreen';
import { Header } from '../components/ui/header/header';
import { Main } from '../components/ui/main/main';
import { ControllerProvider } from '../providers/ControllerContext';
import { ThemeProvider, useTheme } from '../providers/ThemeContext';

const INTRO_VIDEO_SEEN_KEY = 'hasSeenIntroVideo';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash may already be hidden on fast reload.
});

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ControllerProvider>
        <AppBootstrap />
      </ControllerProvider>
    </ThemeProvider>
  );
}

function AppBootstrap() {
  const [showIntro, setShowIntro] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const seen = await AsyncStorage.getItem(INTRO_VIDEO_SEEN_KEY);
        if (isMounted) {
          setShowIntro(seen !== 'true');
        }
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleIntroComplete = useCallback(async () => {
    await AsyncStorage.setItem(INTRO_VIDEO_SEEN_KEY, 'true');
    setShowIntro(false);
  }, []);

  if (showIntro === null) {
    return null;
  }

  if (showIntro) {
    return <IntroVideoScreen onComplete={() => void handleIntroComplete()} />;
  }

  return <RootChrome />;
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
