import { User } from '@/features/users/types/user';

const STORAGE_KEY = 'local-users';

const isBrowser = () => typeof window !== 'undefined';

export function readLocalUsers(): User[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as User[];
  } catch {
    return [];
  }
}

export function writeLocalUsers(users: User[]) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {
    // ignore quota errors silently
  }
}

export function upsertLocalUser(user: User) {
  const current = readLocalUsers();
  const index = current.findIndex((u) => u.id === user.id);
  const next = [...current];
  if (index >= 0) {
    next[index] = user;
  } else {
    next.unshift(user);
  }
  writeLocalUsers(next);
  return next;
}

export function removeLocalUser(id: number) {
  const next = readLocalUsers().filter((u) => u.id !== id);
  writeLocalUsers(next);
  return next;
}

