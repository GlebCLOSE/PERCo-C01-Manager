export const processControllerAuthorization = (data) => {
    // ШАГ 1: Авторизация
    if (data.event === 'need_auth') {
        const salt = data.need_auth.salt;
        const hash = md5(salt + password);
        ws.send(JSON.stringify({ set: "auth", auth: { hash } }));
    }

    // ШАГ 2: Ответ авторизации
    if (data.answer && data.answer.auth) {
        if (data.answer.auth === 'ok') resolve({ success: true, socket: ws });
        else resolve({ success: false, message: 'Ошибка авторизации' });
    }
    
    // ШАГ 3: Список контактов (для первой функции)
    if (data.answer?.pad === 'ok' && data.pad) {
        // Логика накопления в padList
    }
};