import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ResizeMode, Video, type AVPlaybackStatus } from 'expo-av';

type IntroVideoScreenProps = {
  onComplete: () => void;
};

export function IntroVideoScreen({ onComplete }: IntroVideoScreenProps) {
  const handlePlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        return;
      }

      if (status.didJustFinish) {
        onComplete();
      }
    },
    [onComplete],
  );

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/Preview.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isMuted
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onError={onComplete}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Пропустить заставку"
        onPress={onComplete}
        style={styles.skipButton}
      >
        <Text style={styles.skipText}>Пропустить</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1628',
  },
  video: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  skipText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
