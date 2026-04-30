import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '../ui/elements/buttons/Button';
import InputField from '../ui/elements/input/InputField';
import DropdownInput from '../ui/elements/input/DropdownInput';
import {
  CrossParams,
  useControllerConfig,
} from '../../hooks/useControllerConfig';
import ModalText from '../ui/status/ModalText';
import { useTheme } from '../../providers/ThemeContext';
import type { AppPalette } from '../../constants/theme';

interface CrossDetailsProps {
  data: CrossParams;
}

const SOURCE_ITEMS: { value: NonNullable<CrossParams['source']>; label: string }[] =
  [
    { value: 'activating input', label: 'Активизация входа' },
    { value: 'unlocking exdev', label: 'Разблокировка ИУ' },
    { value: 'opening exdev', label: 'Открывание ИУ' },
    { value: 'get card', label: 'Предъявление идентификатора' },
    { value: 'command', label: 'Команда от сервера' },
    { value: 'breaking exdev', label: 'Несанкционированная разблокировка ИУ' },
    {
      value: 'long time opening exdev',
      label: 'Недопустимо долгое открытие ИУ',
    },
    { value: 'cover on', label: 'Датчик вскрытия корпуса' },
    { value: 'activating fire alarm input', label: 'Активизация входа FireAlarm' },
    {
      value: 'normalizing fire alarm input',
      label: 'Нормализация входа FireAlarm',
    },
  ];

const DEST_ITEMS: {
  value: NonNullable<CrossParams['destination']>;
  label: string;
}[] = [
  { value: 'mask input', label: 'Маскируемый вход' },
  { value: 'activated output', label: 'Активизируемый выход' },
  { value: 'normalized output', label: 'Нормализуемый выход' },
];

const TIME_CRITERIA_ITEMS: {
  value: NonNullable<CrossParams['time_criteria']>;
  label: string;
}[] = [
  { value: 'work time', label: 'Время срабатывания' },
  { value: 'absolute time', label: 'Абсолютное время' },
  { value: 'after work time', label: 'Время после срабатывания' },
];

const NUM_0_6 = [0, 1, 2, 3, 4, 5, 6].map((n) => ({
  label: String(n + 1),
  value: n as 0 | 1 | 2 | 3 | 4 | 5 | 6,
}));

const DIR_ITEMS: { label: string; value: 0 | 1 }[] = [
  { label: 'Вход', value: 0 },
  { label: 'Выход', value: 1 },
];

function as01(v: unknown): 0 | 1 {
  const n = typeof v === 'number' ? v : Number(v);
  return n === 1 ? 1 : 0;
}

function as06(v: unknown): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
  const n = typeof v === 'number' ? v : Number(v);
  if (n >= 0 && n <= 6) return n as 0 | 1 | 2 | 3 | 4 | 5 | 6;
  return 0;
}

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    container: {
      width: '100%',
      gap: 7,
    },
    smallText: {
      fontFamily: 'inter',
      fontSize: 12,
      color: p.modalFormInk,
      fontWeight: '300',
    },
    hr: {
      height: 1,
      backgroundColor: p.modalFormRule,
    },
    horizontalBlock: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    flex1: {
      flex: 1,
    },
  });
}

export const CrossDetails: React.FC<CrossDetailsProps> = ({ data }) => {
  const { setCrossConfig } = useControllerConfig();
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const [source, setSource] = useState<NonNullable<CrossParams['source']>>(
    data.source ?? 'activating input',
  );
  const [sourceNumber, setSourceNumber] = useState<
    NonNullable<CrossParams['source_number']>
  >(data.source_number ?? 0);
  const [sourceDirection, setSourceDirection] = useState<
    NonNullable<CrossParams['source_direction']>
  >(data.source_direction ?? 0);
  const [destination, setDestination] = useState<
    NonNullable<CrossParams['destination']>
  >(data.destination ?? 'activated output');
  const [destinationNumber, setDestinationNumber] = useState<
    NonNullable<CrossParams['destination_number']>
  >(data.destination_number ?? 0);
  const [destinationDirection, setDestinationDirection] = useState<
    NonNullable<CrossParams['destination_direction']>
  >(data.destination_direction ?? 0);
  const [timeCriteria, setTimeCriteria] = useState<
    NonNullable<CrossParams['time_criteria']>
  >(data.time_criteria ?? 'work time');
  const [timeReaction, setTimeReaction] = useState<string>(
    String(data.time_reaction ?? 0),
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  useEffect(() => {
    setSource(data.source ?? 'activating input');
    setSourceNumber(data.source_number ?? 0);
    setSourceDirection(data.source_direction ?? 0);
    setDestination(data.destination ?? 'activated output');
    setDestinationNumber(data.destination_number ?? 0);
    setDestinationDirection(data.destination_direction ?? 0);
    setTimeCriteria(data.time_criteria ?? 'work time');
    setTimeReaction(String(data.time_reaction ?? 0));
  }, [data]);

  const handleSave = async () => {
    let tr = Math.floor(Number(timeReaction));
    if (!Number.isFinite(tr)) tr = 0;
    tr = Math.min(1_000_000, Math.max(0, tr));

    const payload: CrossParams = {
      number: data.number,
      source,
      source_number: sourceNumber,
      source_direction: sourceDirection,
      destination,
      destination_number: destinationNumber,
      destination_direction: destinationDirection,
      time_criteria: timeCriteria,
      time_reaction: tr,
    };

    try {
      const result: unknown = await setCrossConfig(payload);
      const isOk =
        result &&
        typeof result === 'object' &&
        result !== null &&
        (result as { answer?: { cross?: string } }).answer?.cross === 'ok';
      setResultMessage(
        isOk ? 'Конфигурация успешно установлена' : 'Ошибка при передаче данных',
      );
    } catch {
      setResultMessage('Сетевая ошибка');
    }
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.smallText}>
        Внутренняя реакция, номер {data.number ?? 0} (0–999)
      </Text>
      <View style={styles.hr} />
      <DropdownInput
        label="Источник реакции"
        items={SOURCE_ITEMS}
        value={source}
        onChange={(v) =>
          setSource(
            (typeof v === 'string' ? v : String(v)) as NonNullable<
              CrossParams['source']
            >,
          )
        }
        size="s"
      />
      <View style={styles.horizontalBlock}>
        <View style={styles.flex1}>
          <DropdownInput
            label="Номер источника"
            items={NUM_0_6}
            value={sourceNumber}
            onChange={(v) => setSourceNumber(as06(v))}
            size="s"
          />
        </View>
        <View style={styles.flex1}>
          <DropdownInput
            label="Направление источника"
            items={DIR_ITEMS}
            value={sourceDirection}
            onChange={(v) => setSourceDirection(as01(v))}
            size="s"
          />
        </View>
      </View>
      <DropdownInput
        label="Объект реакции"
        items={DEST_ITEMS}
        value={destination}
        onChange={(v) =>
          setDestination(
            (typeof v === 'string' ? v : String(v)) as NonNullable<
              CrossParams['destination']
            >,
          )
        }
        size="s"
      />
      <View style={styles.horizontalBlock}>
        <View style={styles.flex1}>
          <DropdownInput
            label="Номер объекта"
            items={NUM_0_6}
            value={destinationNumber}
            onChange={(v) => setDestinationNumber(as06(v))}
            size="s"
          />
        </View>
        <View style={styles.flex1}>
          <DropdownInput
            label="Направление объекта"
            items={DIR_ITEMS}
            value={destinationDirection}
            onChange={(v) => setDestinationDirection(as01(v))}
            size="s"
          />
        </View>
      </View>
      <DropdownInput
        label="Временная характеристика"
        items={TIME_CRITERIA_ITEMS}
        value={timeCriteria}
        onChange={(v) =>
          setTimeCriteria(
            (typeof v === 'string' ? v : String(v)) as NonNullable<
              CrossParams['time_criteria']
            >,
          )
        }
        size="s"
      />
      <InputField
        label="Время реакции, мс (0–1000000)"
        size="s"
        placeholder="0"
        value={timeReaction}
        onChangeText={setTimeReaction}
        keyboardType="numeric"
      />
      <Button title="Сохранить" onPress={handleSave} size="M" />
      <ModalText
        title="Ответ"
        message={resultMessage}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};
