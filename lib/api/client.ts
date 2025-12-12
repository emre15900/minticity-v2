import axios, { AxiosRequestConfig } from 'axios';
import { getApiBaseUrl } from '@/lib/config/env';

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const reqId =
      globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    config.headers['X-Request-Id'] = reqId;
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const cfg = (error?.config ?? {}) as AxiosRequestConfig & {
      skipErrorLog?: boolean;
    };
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      'İstek sırasında bir sorun oluştu';
    if (process.env.NODE_ENV !== 'production' && !cfg.skipErrorLog) {
      // eslint-disable-next-line no-console
      console.error(msg, error);
    }
    return Promise.reject(error);
  },
);

