import { Text, View, StyleSheet, FlatList } from 'react-native';
import { InlineLoading } from '../../components/ui/status/InlineLoading';
import { useFocusEffect } from 'expo-router';
import { ButtonSquare } from '../../components/ui/elements/buttons/buttonSquare';
import { ModalChildren } from '../../components/ui/status/ModalChildren';
import { AccessUserEditModal } from '../../components/modal-content/accessUserEditModal';
import { AccessUserLine } from '../../components/ui/blocks/accessUserLine';
import { useState, useCallback, useMemo } from 'react';
import { useTheme } from '../../providers/ThemeContext';
import type { AppPalette } from '../../constants/theme';
import { themedIcon } from '../../constants/themedIcons';
import type { LocalAccessUser } from '../../types/accessUser';
import { listLocalAccessUsers } from '../../utils/controller/localAccessUsersDb';

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    container: {
      gap: 5,
      justifyContent: 'flex-start',
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

type ModalState = { kind: 'closed' } | { kind: 'create' } | { kind: 'edit'; user: LocalAccessUser };

export default function UsersScreen() {
  const { palette, scheme } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const addIcon = useMemo(() => themedIcon('addUser', scheme), [scheme]);

  const [modal, setModal] = useState<ModalState>({ kind: 'closed' });
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<LocalAccessUser[]>([]);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await listLocalAccessUsers();
      setUserList(list);
    } catch (e) {
      console.error('Ошибка загрузки пользователей:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadUsers();
      return () => {};
    }, [loadUsers]),
  );

  const closeModal = () => setModal({ kind: 'closed' });

  const ItemSeparator = () => (
    <View style={{ height: 10, backgroundColor: 'transparent' }} />
  );

  const modalTitle =
    modal.kind === 'create'
      ? 'Новый пользователь'
      : modal.kind === 'edit'
        ? 'Редактирование'
        : '';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Пользователи</Text>
      <View style={{ gap: 5 }}>
        <Text style={styles.subtitle}>
          Локальный список для авторазблокировки ИУ по событию «Предъявление карты»
        </Text>
        <FlatList
          data={userList}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={({ item }) => (
            <AccessUserLine
              fullName={item.fullName}
              identifier={item.identifier}
              onPress={() => setModal({ kind: 'edit', user: item })}
            />
          )}
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
            title="Добавить пользователя"
            onPress={() => setModal({ kind: 'create' })}
            icon={addIcon}
          />
        </View>
      </View>
      <ModalChildren title={modalTitle} visible={modal.kind !== 'closed'} onClose={closeModal}>
        {modal.kind === 'create' ? (
          <AccessUserEditModal
            mode="create"
            user={null}
            onClose={closeModal}
            onSaved={() => void loadUsers()}
          />
        ) : null}
        {modal.kind === 'edit' ? (
          <AccessUserEditModal
            mode="edit"
            user={modal.user}
            onClose={closeModal}
            onSaved={() => void loadUsers()}
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
