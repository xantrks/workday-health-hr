'''use client';

const createTable = <T extends { id: string }>(tableName: string) => {
  const getFullKey = (id: string) => `${tableName}:${id}`;

  const getItem = (id: string): T | null => {
    if (typeof window === 'undefined') return null;
    const item = window.localStorage.getItem(getFullKey(id));
    return item ? JSON.parse(item) : null;
  };

  const getAllItems = (): T[] => {
    if (typeof window === 'undefined') return [];
    const items: T[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(`${tableName}:`)) {
        const item = window.localStorage.getItem(key);
        if (item) {
          items.push(JSON.parse(item));
        }
      }
    }
    return items;
  };

  const createItem = (item: Omit<T, 'id'>): T => {
    if (typeof window === 'undefined') {
      // This is a mock for server-side rendering
      return { ...item, id: 'mock-id' } as T;
    }
    const id = crypto.randomUUID();
    const newItem = { ...item, id } as T;
    window.localStorage.setItem(getFullKey(id), JSON.stringify(newItem));
    return newItem;
  };

  const updateItem = (id: string, item: Partial<T>): T | null => {
    if (typeof window === 'undefined') return null;
    const existingItem = getItem(id);
    if (!existingItem) return null;
    const updatedItem = { ...existingItem, ...item };
    window.localStorage.setItem(getFullKey(id), JSON.stringify(updatedItem));
    return updatedItem;
  };

  const deleteItem = (id: string): void => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(getFullKey(id));
  };

  return {
    findUnique: getItem,
    findMany: getAllItems,
    create: createItem,
    update: updateItem,
    delete: deleteItem,
  };
};

export const db = {
  users: createTable('users'),
  healthRecords: createTable('healthRecords'),
  leaveRequests: createTable('leaveRequests'),
  organizations: createTable('organizations'),
  // Add other tables here as needed
};

// Mock redis
export const redis = {
  get: async (key: string) => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  },
  set: async (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  },
  del: async (key: string) => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  }
};
'''