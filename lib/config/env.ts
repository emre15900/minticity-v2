const DEFAULT_API_BASE = 'https://jsonplaceholder.typicode.com';

function getEnv(key: 'NEXT_PUBLIC_API_BASE') {
  const value = process.env[key];
  if (!value) {
    console.warn(
      `[env] ${key} bulunamadı, DEFAULT_API_BASE kullanılacak: ${DEFAULT_API_BASE}`,
    );
    return DEFAULT_API_BASE;
  }
  return value;
}

export function getApiBaseUrl() {
  return getEnv('NEXT_PUBLIC_API_BASE');
}

