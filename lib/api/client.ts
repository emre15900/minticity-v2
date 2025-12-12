import axios from 'axios';
import { message } from 'antd';
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
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      'İstek sırasında bir sorun oluştu';
    message.error(msg);
    return Promise.reject(error);
  },
);

