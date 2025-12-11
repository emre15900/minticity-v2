import axios from 'axios';
import { NewUserPayload, User } from '@/lib/types/users';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchUsers(): Promise<User[]> {
  const response = await api.get<User[]>('/users');
  return response.data;
}

export async function fetchUserById(id: number): Promise<User> {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
}

export async function createUser(payload: NewUserPayload): Promise<User> {
  const response = await api.post<User>('/users', payload);
  // The API returns a fake id; ensure we always provide one for front-end usage.
  const fallbackId = Math.floor(Math.random() * 1000000) + 1000;
  return { ...payload, id: response.data?.id ?? fallbackId };
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}

