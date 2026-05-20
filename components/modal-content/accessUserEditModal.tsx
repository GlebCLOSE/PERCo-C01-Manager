import { View, StyleSheet, Text } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import InputField from '../ui/elements/input/InputField';
import { Button } from '../ui/elements/buttons/Button';
import ModalText from '../ui/status/ModalText';
import { useTheme } from '../../providers/ThemeContext';
import type { AppPalette } from '../../constants/theme';
import type { LocalAccessUser } from '../../types/accessUser';
import { formatIdentifierForQr, parseUint24Identifier } from '../../utils/accessUserIdentifierQr';
import {
  deleteLocalAccessUser,
  insertLocalAccessUser,
  updateLocalAccessUser,
} from '../../utils/controller/localAccessUsersDb';
import QRCode from 'react-native-qrcode-svg';

interface AccessUserEditModalProps {
  mode: 'create' | 'edit';
  user: LocalAccessUser | null;
  onClose: () => void;
  onSaved: () => void;
}

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    container: {
      width: '100%',
      gap: 12,
    },
    hint: {
      fontFamily: 'inter',
      fontSize: 12,
      color: p.modalFormInk,
      fontWeight: '300',
    },
    row: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
    },
    confirmBox: {
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: p.modalFormRule,
      gap: 8,
    },
    confirmText: {
      fontFamily: 'inter',
      fontSize: 14,
      color: p.modalFormInk,
    },
    qrBlock: {
      alignItems: 'center',
      gap: 8,
      paddingVertical: 4,
    },
    qrCaption: {
      fontFamily: 'inter',
      fontSize: 12,
      color: p.modalFormInk,
      fontWeight: '300',
      textAlign: 'center',
    },
    qrWrap: {
      padding: 10,
      borderRadius: 8,
      backgroundColor: p.modalSurface,
      borderWidth: 1,
      borderColor: p.modalFormRule,
    },
    qrHintMuted: {
      fontFamily: 'inter',
      fontSize: 12,
      color: p.modalFormInk,
      fontWeight: '300',
      fontStyle: 'italic',
    },
  });
}

export function AccessUserEditModal({
  mode,
  user,
  onClose,
  onSaved,
}: AccessUserEditModalProps) {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [pendingDelete, setPendingDelete] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [infoVisible, setInfoVisible] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFullName(user.fullName);
      setIdentifier(user.identifier);
    } else {
      setFullName('');
      setIdentifier('');
    }
    setPendingDelete(false);
  }, [mode, user]);

  const qrPayload = useMemo(() => {
    const t = identifier.trim();
    const n = parseUint24Identifier(t);
    if (n === null) return null;
    return formatIdentifierForQr(n, 10);
  }, [identifier]);

  const showQrInvalidHint = identifier.trim().length > 0 && qrPayload === null;

  const showInfo = (title: string, message: string) => {
    setInfoTitle(title);
    setInfoMessage(message);
    setInfoVisible(true);
  };

  const handleSave = async () => {
    if (mode === 'create') {
      const r = await insertLocalAccessUser(fullName, identifier);
      if (r.ok) {
        onSaved();
        onClose();
      } else {
        showInfo('Ошибка', r.message);
      }
      return;
    }
    if (user) {
      const r = await updateLocalAccessUser(user.id, fullName, identifier);
      if (r.ok) {
        onSaved();
        onClose();
      } else {
        showInfo('Ошибка', r.message);
      }
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    try {
      await deleteLocalAccessUser(user.id);
      onSaved();
      onClose();
    } catch {
      showInfo('Ошибка', 'Не удалось удалить запись');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>
        При предъявлении карты с указанным идентификатором на связанном ИУ будет автоматически отправлена
        однократная разблокировка (если есть подключение к контроллеру).
      </Text>
      <InputField label="ФИО" value={fullName} onChangeText={setFullName} placeholder="Иванов Иван Иванович" />
      <InputField
        label="Идентификатор"
        value={identifier}
        onChangeText={setIdentifier}
        placeholder="Номер карты / кода (для QR: только цифры 0–16777215)"
      />

      {qrPayload ? (
        <View style={styles.qrBlock}>
          <Text style={styles.qrCaption}>QR-код кодирует 10 цифр (uint24 с ведущими нулями): {qrPayload}</Text>
          <View style={styles.qrWrap}>
            <QRCode
              value={qrPayload}
              size={180}
              color={palette.textPrimary}
              backgroundColor={palette.modalSurface}
            />
          </View>
        </View>
      ) : null}
      {showQrInvalidHint ? (
        <Text style={styles.qrHintMuted}>
          Для отображения QR укажите число от 0 до 16777215, только цифры (ведущие нули допускаются).
        </Text>
      ) : null}

      <View style={styles.row}>
        <Button title="Сохранить" onPress={() => void handleSave()} size="M" />
        <Button title="Отмена" onPress={onClose} size="M" />
      </View>

      {mode === 'edit' && user ? (
        pendingDelete ? (
          <View style={styles.confirmBox}>
            <Text style={styles.confirmText}>Удалить этого пользователя из списка?</Text>
            <View style={styles.row}>
              <Button title="Да, удалить" onPress={() => void handleDelete()} size="M" isWarn />
              <Button title="Отмена" onPress={() => setPendingDelete(false)} size="M" />
            </View>
          </View>
        ) : (
          <Button title="Удалить" onPress={() => setPendingDelete(true)} size="M" isWarn />
        )
      ) : null}

      <ModalText
        title={infoTitle}
        visible={infoVisible}
        message={infoMessage}
        onClose={() => setInfoVisible(false)}
      />
    </View>
  );
}
