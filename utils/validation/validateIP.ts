  export const validateIP = (ipAddress) => {
    if (!ipAddress.trim()) {
      return 'IP‑адрес обязателен';
    }

    const parts = ipAddress.trim().split('.');
    if (parts.length !== 4) {
      return 'IP‑адрес должен содержать 4 части, разделённые точками';
    }

    for (const part of parts) {
      if (!/^\d+$/.test(part)) {
        return 'Каждая часть IP‑адреса должна содержать только цифры';
      }
      const num = parseInt(part, 10);
      if (num < 0 || num > 255) {
        return 'Каждая часть IP‑адреса должна быть от 0 до 255';
      }
    }
    return null;
  };