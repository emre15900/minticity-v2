import { apiClient } from '@/lib/api/client';
import { NewUserPayload, User } from '@/features/users/types/user';

const FALLBACK_ID = () => Math.floor(Math.random() * 1000000) + 1000;

export async function fetchUsers(): Promise<User[]> {
  const response = await apiClient.get<User[]>('/users');
  return response.data;
}

export async function fetchUserById(id: number): Promise<User> {
  const response = await apiClient.get<User>(`/users/${id}`);
  return response.data;
}

export async function createUser(payload: NewUserPayload): Promise<User> {
  const response = await apiClient.post<User>('/users', payload);
  return { ...payload, id: response.data?.id ?? FALLBACK_ID() };
}

export async function updateUser(
  id: number,
  payload: NewUserPayload,
): Promise<User> {
  const response = await apiClient.put<User>(`/users/${id}`, payload);
  return { ...payload, id: response.data?.id ?? id };
}

export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}

