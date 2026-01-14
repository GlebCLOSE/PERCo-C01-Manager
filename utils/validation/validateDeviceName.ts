  // Функция валидации имени контроллера
  export const validateDeviceName = (name: string) => {
    if (!name.trim()) {
      return 'Имя контроллера обязательно';
    }
    if (name.length > 20) {
      return 'Имя контроллера не должно превышать 20 символов';
    }
    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      return 'Имя контроллера может содержать только буквы и цифры';
    }
    return null;
  };