 import md5 from 'md5';
 
 export const attemptConnection = (ip: string, password: string) => {
    return new Promise((resolve) => {
      // Используем порт 80 (стандарт для HTTP/WS), если в документации не указан иной
      const wsUrl = `ws://${ip}:80/tcp`; 
      let ws: WebSocket | null = null;
      let isResolved: boolean = false;

      const timeout = setTimeout(() => {
        if (ws) ws.close();
        resolve({ success: false, message: 'Контроллер не ответил вовремя' });
      }, 7000);

      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            clearTimeout(timeout);
            if (!isResolved) {
            isResolved = true;
            // Сразу после открытия шлем команду верификации
            ws.send(JSON.stringify({ "set": "verify_acl", "verify_acl": [{}] }));
            resolve({ success: true, socket: ws });
            }
        };

        ws.onmessage = (e) => {
          if (!e.data || typeof e.data !== 'string' || e.data.trim() === "") {
              return;
          }

          try {
              // 1. Разделяем склеенные объекты, если они пришли в одном пакете
              const jsonStrings = e.data
                  .replace(/}\s*{/g, '}|--|{')
                  .split('|--|');

              // 2. Проходим циклом по каждой полученной JSON-строке
              jsonStrings.forEach((jsonStr) => {
                  try {
                      const data = JSON.parse(jsonStr);

                      // ШАГ 1: Получение соли от контроллера
                      if (data.event === 'need_auth') {
                          const salt = data.need_auth.salt;
                          const hash = md5(salt + password); 

                          const authPayload = {
                              set: "auth",
                              auth: { hash: hash }
                          };
                          ws.send(JSON.stringify(authPayload));
                      }

                      // ШАГ 2: Проверка ответа авторизации
                      if (data.answer && data.answer.auth) {
                          clearTimeout(timeout);
                          
                          if (data.answer.auth === 'ok') {
                              // Здесь важно понимать: если resolve сработает несколько раз, 
                              // это не вызовет ошибку, но выполнится только первый раз.
                              resolve({ success: true, socket: ws });
                          } else {
                              ws.close();
                              resolve({ success: false, message: 'Неверный пароль доступа' });
                          }
                      }
                  } catch (singleParseErr) {
                      // Ошибка парсинга конкретного кусочка (например, если обрезало строку)
                      console.error("Ошибка парсинга отдельного сегмента:", jsonStr, singleParseErr);
                  }
              });

          } catch (err) {
              console.error("Общая ошибка обработки сообщения:", err);
          }
        };

        ws.onerror = (e) => {
          console.log(e)
          clearTimeout(timeout);
          resolve({ success: false, message: 'Ошибка сети или порт закрыт' });
        };

        ws.onclose = () => {
          console.log('Соединение с C01 разорвано');
        };

      } catch (error) {
        clearTimeout(timeout);
        resolve({ success: false, message: 'Критическая ошибка при создании сокета' });
      }
    });
  };
