export type AvatarMap = Record<number, string>;

const STORAGE_KEY = 'user-avatars';

const isBrowser = () => typeof window !== 'undefined';

export function readAvatarMap(): AvatarMap {
  if (!isBrowser()) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as AvatarMap;
  } catch {
    return {};
  }
}

export function writeAvatarMap(map: AvatarMap) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore quota errors silently
  }
}

export function setAvatar(id: number, dataUrl?: string) {
  const map = readAvatarMap();
  if (dataUrl) {
    map[id] = dataUrl;
  } else {
    delete map[id];
  }
  writeAvatarMap(map);
  return map;
}

export function removeAvatar(id: number) {
  const map = readAvatarMap();
  delete map[id];
  writeAvatarMap(map);
  return map;
}

