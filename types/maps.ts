export const mapPadNames = new Map([
    [0, 'in1'],
    [1, 'in2'],
    [2, 'in3'],
    [3, 'in4'],
    [4, 'DUA'],
    [5, 'DUSt'],
    [6, 'DUB'],
    [7, 'FA'],
    [8, 'Реле 1'],
    [9, 'Реле 2'],
    [10, 'OK1'],
    [11, 'OK2'],
    [12, 'LdA'],
    [13, 'LdSt'],
    [14, 'LdB'],
    [15, 'Beep'],
])

export const mapPadTypes = new Map([
    ['input', 'Вход обычный'],
    ['remote control input', 'Кнопка ПДУ'],
    ['pass', 'Сигнал прохода'],
    ['fire alarm input', 'Вход FireAlarm'],
    ['remove card input', 'Вход Карта Изъята'],
    ['output', 'Выход обычный'],
    ['exdev output', 'Выход управления ИУ'],
    ['fire alarm output', 'Выход FireAlarm'],
    ['remove card output', 'Выход Изъять карту'],
    ['remote control output', 'Выход индикации ПДУ'],
])

export const mapCrossSource = new Map<string, string>([
    ['activating input', 'Активизация входа'],
    ['unlocking exdev', 'Разблокировка ИУ'],
    ['opening exdev', 'Открывание ИУ'],
    ['get card', 'Предъявление идентификатора'],
    ['command', 'Команда от сервера'],
    ['breaking exdev', 'Несанкционированная разблокировка ИУ'],
    ['long time opening exdev', 'Недопустимо долгое открытие ИУ'],
    ['cover on', 'Датчик вскрытия корпуса'],
    ['activating fire alarm input', 'Активизация входа FireAlarm'],
    ['normalizing fire alarm input', 'Нормализация входа FireAlarm'],
])

export const mapCrossDestination = new Map<string, string>([
    ['mask input', 'Маскируемый вход'],
    ['activated output', 'Активизируемый выход'],
    ['normalized output', 'Нормализуемый выход'],
])

export const mapCrossTimeCriteria = new Map<string, string>([
    ['work time', 'Время срабатывания'],
    ['absolute time', 'Абсолютное время'],
    ['after work time', 'Время после срабатывания'],
])

export const mapExdevNames = new Map([
    ['lock', 'Односторонний замок'],
    ['double lock', 'Двухсторонний замок'],
    ['turnstyle', 'Турникет'],
    ['gate', 'Шлагбаум'],
])