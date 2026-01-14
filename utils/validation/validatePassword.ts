  export const validatePassword = (pass) => {
    if (pass.length > 10) {
      return 'Пароль не должен превышать 10 символов';
    }
    return null;
  };