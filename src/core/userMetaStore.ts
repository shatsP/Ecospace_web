// src/core/userMetaStore.ts

const STORAGE_KEY = "ecospace_user_meta";

export interface UserMeta {
  name?: string;
  dob?: string;
  lastOpenedApp?: string;
  lastDroppedFile?: {
    name: string;
    type: string;
    size: number;
    time: string;
  };
}

export function getUserMeta(): UserMeta {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function updateUserMeta(update: Partial<UserMeta>) {
  const current = getUserMeta();
  const next = { ...current, ...update };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearUserMeta() {
  localStorage.removeItem(STORAGE_KEY);
}
