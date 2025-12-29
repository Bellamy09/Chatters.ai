
import { User, StoredItem } from '../types';

const USERS_KEY = 'introvibe_users';
const SESSION_KEY = 'introvibe_session';
const HISTORY_KEY_PREFIX = 'introvibe_history_';

export const saveUser = (user: User, password: string) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  users.push({ ...user, password });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUser = (email: string) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  return users.find((u: any) => u.email === email);
};

export const setSession = (user: User | null) => {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
};

export const getSession = (): User | null => {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveHistoryItem = (userId: string, item: Omit<StoredItem, 'id' | 'timestamp'>) => {
  const key = `${HISTORY_KEY_PREFIX}${userId}`;
  const history = JSON.parse(localStorage.getItem(key) || '[]');
  const newItem: StoredItem = {
    ...item,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now()
  };
  history.unshift(newItem);
  localStorage.setItem(key, JSON.stringify(history));
};

export const getHistory = (userId: string): StoredItem[] => {
  const key = `${HISTORY_KEY_PREFIX}${userId}`;
  return JSON.parse(localStorage.getItem(key) || '[]');
};
