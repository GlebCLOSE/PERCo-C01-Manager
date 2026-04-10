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
      eventName = 'Разблокировка ИУ' + (data.exdev_unlock.number + 1) + ' направление ' + (data.exdev_unlock.direction === 0 ? 'Вход' : 'Выход') + ' разблокировка ' + data.exdev_unlock.unlock
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