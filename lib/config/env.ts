function getEnv(key: 'NEXT_PUBLIC_API_BASE') {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Env değişkeni eksik: ${key}`);
  }
  return value;
}

export function getApiBaseUrl() {
  return getEnv('NEXT_PUBLIC_API_BASE');
}

