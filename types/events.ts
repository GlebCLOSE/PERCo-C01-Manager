type DeviceNumber = 0 | 1;
type Direction = 0 | 1;
type CommandSource = 'server' | 'remote_control';
type BanSource = CommandSource | 'sensor_fault';

interface BaseDeviceEvent {
  number: DeviceNumber;
  direction: Direction;
}

interface PersonalEvent extends BaseDeviceEvent {
  id: string;
  remove_card: boolean;
}

// Описание каждого типа события
export type PercoEvent =

  | { event: 'card'; card: PersonalEvent } //Предъявление карты, number - номер ИУ, direction - направление ИУ, id - id карты
  | { event: 'pass_personal'; pass_personal: PersonalEvent } //Проход персональный, number - номер ИУ, direction - направление ИУ, id - id карты, remove_card - признак изъятия карты
  | { 
      event: 'pass_impersonal'; 
      pass_impersonal: BaseDeviceEvent & { command_source: CommandSource } //Проход обезличенный(по команде от сервера или ПДУ), number - номер ИУ, direction - направление ИУ, command_source - источник команды(server - от сервера, remote_control - от ПДУ)
    }

  | { event: 'refusal_personal'; refusal_personal: PersonalEvent } //Отказ прохода персональный, number - номер ИУ, direction - направление ИУ, id - id карты, remove_card - признак изъятия карты
  | { 
      event: 'refusal_impersonal'; 
      refusal_impersonal: BaseDeviceEvent & { command_source: CommandSource } //Отказ прохода обезличенный(по команде от сервера или ПДУ), number - номер ИУ, direction - направление ИУ, command_source - источник команды
    }

  | { 
      event: 'pass_ban_personal'; 
      pass_ban_personal: PersonalEvent & { command_source: BanSource } //Блокировка прохода персональный, number - номер ИУ, direction - направление ИУ, id - id карты, remove_card - признак изъятия карты, command_source - источник команды(server - от сервера, remote_control - от ПДУ, sensor_fault - по причине сбоя датчика)
    }
  | { 
      event: 'pass_ban_impersonal'; 
      pass_ban_impersonal: BaseDeviceEvent & { command_source: BanSource } //Блокировка прохода обезличенный(по команде от сервера или ПДУ), number - номер ИУ, direction - направление ИУ, command_source - источник команды(server - от сервера, remote_control - от ПДУ, sensor_fault - по причине сбоя датчика)
    }

  | { event: 'break'; break: BaseDeviceEvent } //Взлом ИУ, number - номер ИУ, direction - направление ИУ
  | { event: 'exdev_long_open'; exdev_long_open: BaseDeviceEvent } //Недопустимо длительное открытие ИУ, number - номер ИУ, direction - направление ИУ
  | { 
      event: 'exdev_unlock'; 
      exdev_unlock: BaseDeviceEvent & { unlock: boolean } //Разблокировка ИУ, number - номер ИУ, direction - направление ИУ, unlock - true - разблокировка, false - блокировка
    }

  | { 
      event: 'input'; 
      input: { 
        number: number; // 0-7 - номер входа
        on: boolean; //true - активизация, false - нормализация
        function: 'input' | 'fire alarm input' //input - входной сигнал, fire alarm input - сигнал пожарной тревоги
      } 
    }
  | { 
      event: 'output'; 
      output: { 
        number: number; // 0-7 - номер выхода
        on: boolean; //true - активизация, false - нормализация 
        function: 'output' | 'exdev output' | 'fire alarm output' | 'remove card output' | 'remote control output' //output - выходной сигнал, exdev output - сигнал управления ИУ, fire alarm output - сигнал пожарной тревоги, remove card output - сигнал изъятия карты, remote control output - сигнал индикации ПДУ    
      } 
    };

/** Краткая подпись типа события для списка (одна строка). */
export const shortEventLabel = (data: PercoEvent): string => {
  switch (data.event) {
    case 'card':
      return 'Предъявление карты';
    case 'pass_personal':
      return 'Проход по карте';
    case 'pass_impersonal':
      return 'Проход обезличенный';
    case 'refusal_personal':
      return 'Отказ по карте';
    case 'refusal_impersonal':
      return 'Отказ обезличенный';
    case 'pass_ban_personal':
      return 'Блокировка по карте';
    case 'pass_ban_impersonal':
      return 'Блокировка обезличенная';
    case 'break':
      return 'Взлом ИУ';
    case 'exdev_long_open':
      return 'Долгое открытие ИУ';
    case 'exdev_unlock':
      return data.exdev_unlock.unlock ? 'Разблокировка ИУ' : 'Блокировка ИУ';
    case 'input':
      return 'Входной сигнал';
    case 'output':
      return 'Выходной сигнал';
  }
};

export type EventDetailRow = { label: string; value: string };

/** Структурированные поля для экрана деталей (ИУ, направление, ID и т.д.). */
export const getEventDetailRows = (data: PercoEvent): EventDetailRow[] => {
  const dir = (d: 0 | 1) => (d === 0 ? 'Вход' : 'Выход');

  switch (data.event) {
    case 'card':
      return [
        { label: 'ИУ', value: String(data.card.number + 1) },
        { label: 'Направление', value: dir(data.card.direction) },
        { label: 'Идентификатор карты', value: data.card.id },
      ];
    case 'pass_personal':
      return [
        { label: 'ИУ', value: String(data.pass_personal.number + 1) },
        { label: 'Направление', value: dir(data.pass_personal.direction) },
        { label: 'Идентификатор карты', value: data.pass_personal.id },
        { label: 'Изъятие карты', value: data.pass_personal.remove_card ? 'Да' : 'Нет' },
      ];
    case 'pass_impersonal':
      return [
        { label: 'ИУ', value: String(data.pass_impersonal.number + 1) },
        { label: 'Направление', value: dir(data.pass_impersonal.direction) },
        { label: 'Источник команды', value: data.pass_impersonal.command_source },
      ];
    case 'refusal_personal':
      return [
        { label: 'ИУ', value: String(data.refusal_personal.number + 1) },
        { label: 'Направление', value: dir(data.refusal_personal.direction) },
        { label: 'Идентификатор карты', value: data.refusal_personal.id },
        { label: 'Изъятие карты', value: data.refusal_personal.remove_card ? 'Да' : 'Нет' },
      ];
    case 'refusal_impersonal':
      return [
        { label: 'ИУ', value: String(data.refusal_impersonal.number + 1) },
        { label: 'Направление', value: dir(data.refusal_impersonal.direction) },
        { label: 'Источник команды', value: data.refusal_impersonal.command_source },
      ];
    case 'pass_ban_personal':
      return [
        { label: 'ИУ', value: String(data.pass_ban_personal.number + 1) },
        { label: 'Направление', value: dir(data.pass_ban_personal.direction) },
        { label: 'Идентификатор карты', value: data.pass_ban_personal.id },
        { label: 'Изъятие карты', value: data.pass_ban_personal.remove_card ? 'Да' : 'Нет' },
        { label: 'Источник команды', value: data.pass_ban_personal.command_source },
      ];
    case 'pass_ban_impersonal':
      return [
        { label: 'ИУ', value: String(data.pass_ban_impersonal.number + 1) },
        { label: 'Направление', value: dir(data.pass_ban_impersonal.direction) },
        { label: 'Источник команды', value: data.pass_ban_impersonal.command_source },
      ];
    case 'break':
      return [
        { label: 'ИУ', value: String(data.break.number + 1) },
        { label: 'Направление', value: dir(data.break.direction) },
      ];
    case 'exdev_long_open':
      return [
        { label: 'ИУ', value: String(data.exdev_long_open.number + 1) },
        { label: 'Направление', value: dir(data.exdev_long_open.direction) },
      ];
    case 'exdev_unlock':
      return [
        { label: 'ИУ', value: String(data.exdev_unlock.number + 1) },
        { label: 'Направление', value: dir(data.exdev_unlock.direction) },
        {
          label: 'Действие',
          value: data.exdev_unlock.unlock ? 'Разблокировка' : 'Блокировка',
        },
      ];
    case 'input':
      return [
        { label: 'Вход №', value: String(data.input.number + 1) },
        { label: 'Состояние', value: data.input.on ? 'Активизация' : 'Нормализация' },
        { label: 'Функция', value: data.input.function },
      ];
    case 'output':
      return [
        { label: 'Выход №', value: String(data.output.number + 1) },
        { label: 'Состояние', value: data.output.on ? 'Активизация' : 'Нормализация' },
        { label: 'Функция', value: data.output.function },
      ];
  }
};

// Пример использования (Type Guard)
export const handleEvent = (data: PercoEvent) => {
    let eventName = ''
  switch (data.event) {
    case 'card':
      eventName = 'Предъявление карты: ' + data.card.id + ' ИУ ' + (data.card.number + 1) + ' направление ' + (data.card.direction === 0 ? 'Вход' : 'Выход')
      break;
    case 'pass_personal':
      eventName = 'Проход по карте:' + data.pass_personal.id + ' ИУ ' + (data.pass_personal.number + 1) + ' направление ' + (data.pass_personal.direction === 0 ? 'Вход' : 'Выход') + ' изъятие карты ' + data.pass_personal.remove_card  
      break;
    case 'pass_impersonal':
      eventName = 'Проход обезличенный, ИУ ' + data.pass_impersonal.number + ' направление: ' + (data.pass_impersonal.direction === 0 ? 'Вход' : 'Выход') + ' источник команды ' + data.pass_impersonal.command_source
      break;
    case 'refusal_personal':
      eventName = 'Отказ прохода по карте: ' + data.refusal_personal.id + ' ИУ ' + (data.refusal_personal.number + 1) + ' направление ' + (data.refusal_personal.direction === 0 ? 'Вход' : 'Выход') + ' изъятие карты ' + data.refusal_personal.remove_card  
      break;
    case 'refusal_impersonal':
      eventName = 'Отказ прохода обезличенный, ИУ ' + data.refusal_impersonal.number + ' направление ' + (data.refusal_impersonal.direction === 0 ? 'Вход' : 'Выход') + ' источник команды ' + data.refusal_impersonal.command_source
      break;
    case 'pass_ban_personal':
      eventName = 'Блокировка прохода по карте: ' + data.pass_ban_personal.id + ' ИУ ' + (data.pass_ban_personal.number + 1) + ' направление ' + (data.pass_ban_personal.direction === 0 ? 'Вход' : 'Выход') + ' изъятие карты ' + data.pass_ban_personal.remove_card  
      break;
    case 'pass_ban_impersonal':
      eventName = 'Блокировка прохода обезличенный, ИУ' + data.pass_ban_impersonal.number + ' направление ' + (data.pass_ban_impersonal.direction === 0 ? 'Вход' : 'Выход') + ' источник команды ' + data.pass_ban_impersonal.command_source
      break;
    case 'break':
      eventName = 'Взлом ИУ' + (data.break.number + 1) + ' направление ' + (data.break.direction === 0 ? 'Вход' : 'Выход')
      break;
    case 'exdev_long_open':
      eventName = 'Недопустимо длительное открытие ИУ' + (data.exdev_long_open.number + 1) + ' направление ' + (data.exdev_long_open.direction === 0 ? 'Вход' : 'Выход')
      break;
    case 'exdev_unlock':
      {
        const u = data.exdev_unlock;
        const kind = u.unlock ? 'Разблокировка' : 'Блокировка';
        eventName =
          kind +
          ' ИУ' +
          (u.number + 1) +
          ' направление ' +
          (u.direction === 0 ? 'Вход' : 'Выход');
      }
      break;
    case 'input':
      eventName = 'Вход' + (data.input.number + 1)   + ' активизация ' + data.input.on + ' функция ' + data.input.function
      break;
    case 'output':
      eventName = 'Выход' + (data.output.number + 1) + ' активизация ' + data.output.on + ' функция ' + data.output.function
      break;
  }
  return eventName
};