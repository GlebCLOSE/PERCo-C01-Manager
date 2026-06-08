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

const EMPTY_CROSS: CrossParams = {
  source: 'activating input',
  source_number: 0,
  source_direction: 0,
  destination: 'activated output',
  destination_number: 0,
  destination_direction: 0,
  time_criteria: 'work time',
  time_reaction: 0,
};

function dedupeCrossByNumber(list: CrossParams[]): CrossParams[] {
  const byNumber = new Map<number, CrossParams>();
  for (const item of list) {
    byNumber.set(item.number ?? 0, item);
  }
  return Array.from(byNumber.values()).sort(
    (a, b) => (a.number ?? 0) - (b.number ?? 0),
  );
}

function suggestNextCrossNumber(list: CrossParams[]): number {
  const used = new Set(list.map((item) => item.number ?? 0));
  for (let i = 0; i <= 999; i += 1) {
    if (!used.has(i)) return i;
  }
  return 0;
}

type ModalState =
  | { kind: 'closed' }
  | { kind: 'create'; draft: CrossParams }
  | { kind: 'edit'; cross: CrossParams };

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

  const [modal, setModal] = useState<ModalState>({ kind: 'closed' });
  const [isLoading, setIsLoading] = useState(false);
  const [crossList, setCrossList] = useState<CrossParams[]>([]);

  const handleGetCrossList = useCallback(async () => {
    setIsLoading(true);
    try {
      const responses: unknown = await getInfo('cref', 'all');
      const crossArray = dedupeCrossByNumber(
        (responses as { cref?: CrossParams }[])
          .map((item) => item.cref)
          .filter((c): c is CrossParams => c !== undefined),
      );

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
    setModal({ kind: 'closed' });
  };

  const openCreateModal = () => {
    setModal({
      kind: 'create',
      draft: {
        ...EMPTY_CROSS,
        number: suggestNextCrossNumber(crossList),
      },
    });
  };

  const modalTitle =
    modal.kind === 'create'
      ? 'Новая реакция'
      : modal.kind === 'edit'
        ? 'Внутренняя реакция'
        : '';

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
          keyExtractor={(item, index) => `cross-${item.number ?? index}-${index}`}
          renderItem={({ item }) => (
            <CrossLine
              number={item.number ?? 0}
              source={item.source ?? 'activating input'}
              destination={item.destination ?? 'activated output'}
              onPress={() => setModal({ kind: 'edit', cross: item })}
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
            onPress={openCreateModal}
            icon={addIcon}
          />
        </View>
      </View>
      <ModalChildren
        title={modalTitle}
        visible={modal.kind !== 'closed'}
        onClose={closeModal}
      >
        {modal.kind === 'create' ? (
          <CrossDetails
            data={modal.draft}
            mode="create"
            onSaved={() => void handleGetCrossList()}
          />
        ) : null}
        {modal.kind === 'edit' ? (
          <CrossDetails
            data={modal.cross}
            mode="edit"
            onSaved={() => void handleGetCrossList()}
          />
        ) : null}
      </ModalChildren>
      {isLoading ? (
        <View style={styles.loadingOverlay}>
          <InlineLoading />
        </View>
      ) : null}
    </View>
  );
}
