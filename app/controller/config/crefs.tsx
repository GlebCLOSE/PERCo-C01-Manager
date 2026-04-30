import { Text, StyleSheet, View, FlatList } from 'react-native';
import { InlineLoading } from '../../../components/ui/status/InlineLoading';
import { ButtonSquare } from '../../../components/ui/elements/buttons/buttonSquare';
import { CrossLine } from '../../../components/ui/blocks/crossLine';
import { useState, useCallback, useMemo, useRef } from 'react';
import { ModalChildren } from '../../../components/ui/status/ModalChildren';
import { CrossDetails } from '../../../components/modal-content/crossDetails';
import { useFocusEffect } from 'expo-router';
import {
  useControllerConfig,
  type CrossParams,
} from '../../../hooks/useControllerConfig';
import { useController } from '../../../providers/ControllerContext';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';
import { themedIcon } from '../../../constants/themedIcons';

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    container: {
      gap: 20,
      justifyContent: 'flex-start',
      flex: 1,
    },
    title: {
      fontFamily: 'inter',
      fontSize: 24,
      fontWeight: '400',
      color: p.sectionHeading,
    },
    subtitle: {
      fontFamily: 'inter',
      fontSize: 16,
      fontWeight: '400',
      color: p.textTertiary,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: p.loadingOverlayBg,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
  });
}

export default function CrefsScreen() {
  const { getInfo } = useControllerConfig();
  const { configRevision } = useController();
  const lastRevisionRef = useRef(configRevision);
  const { palette, scheme } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const addIcon = useMemo(() => themedIcon('addReader', scheme), [scheme]);

  const [activeCross, setActiveCross] = useState<CrossParams | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [crossList, setCrossList] = useState<CrossParams[]>([]);

  const handleGetCrossList = useCallback(async () => {
    setIsLoading(true);
    try {
      const responses: unknown = await getInfo('cross', 'all');
      const crossArray = (responses as { cross?: CrossParams }[])
        .map((item) => item.cross)
        .filter((c): c is CrossParams => c !== undefined);

      crossArray.sort((a, b) => (a.number ?? 0) - (b.number ?? 0));

      setCrossList(crossArray);
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getInfo]);

  useFocusEffect(
    useCallback(() => {
      const isConfigJustChanged = lastRevisionRef.current !== configRevision;
      lastRevisionRef.current = configRevision;

      const timeout = setTimeout(() => {
        handleGetCrossList();
      }, isConfigJustChanged ? 250 : 0);

      return () => clearTimeout(timeout);
    }, [handleGetCrossList, configRevision]),
  );

  const closeModal = () => {
    setActiveCross('');
  };

  const ItemSeparator = () => (
    <View style={{ height: 10, backgroundColor: 'transparent' }} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Внутренние реакции</Text>
      <View style={{ gap: 5, flex: 1 }}>
        <Text style={styles.subtitle}>Список реакций</Text>
        <FlatList
          data={crossList}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 16 }}
          keyExtractor={(item, index) =>
            item.number !== undefined ? `cross-${item.number}` : `cross-i-${index}`
          }
          renderItem={({ item }) => (
            <CrossLine
              number={item.number ?? 0}
              source={item.source ?? 'activating input'}
              destination={item.destination ?? 'activated output'}
              onPress={() => setActiveCross(item)}
            />
          )}
          ItemSeparatorComponent={ItemSeparator}
        />
        <View
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            marginTop: 10,
          }}
        >
          <ButtonSquare
            title="Добавить реакцию"
            onPress={() => {}}
            icon={addIcon}
          />
        </View>
      </View>
      <ModalChildren
        title="Внутренняя реакция"
        visible={activeCross !== ''}
        onClose={closeModal}
      >
        {activeCross !== '' ? <CrossDetails data={activeCross} /> : null}
      </ModalChildren>
      {isLoading ? (
        <View style={styles.loadingOverlay}>
          <InlineLoading />
        </View>
      ) : null}
    </View>
  );
}
