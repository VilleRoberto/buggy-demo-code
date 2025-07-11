import type { UserData, AppSettings } from '../types';

const STORAGE_KEY = 'rahapuu_data';
const SETTINGS_KEY = 'rahapuu_settings';

export const defaultSettings: AppSettings = {
  childName: '',
  currency: '€',
  parentPinEnabled: false,
  language: 'fi',
  soundEnabled: true,
  animationsEnabled: true,
};

export const defaultUserData: UserData = {
  totalSavings: 0,
  goals: [],
  transactions: [],
  treeElements: [],
  chores: [],
  settings: defaultSettings,
  createdAt: new Date(),
  lastUpdated: new Date(),
};

export const saveUserData = (data: UserData): void => {
  try {
    const dataToSave = {
      ...data,
      lastUpdated: new Date(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const loadUserData = (): UserData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date strings back to Date objects
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        lastUpdated: new Date(parsed.lastUpdated),
        goals: parsed.goals.map((goal: any) => ({
          ...goal,
          createdAt: new Date(goal.createdAt),
        })),
        transactions: parsed.transactions.map((transaction: any) => ({
          ...transaction,
          createdAt: new Date(transaction.createdAt),
        })),
        treeElements: parsed.treeElements.map((element: any) => ({
          ...element,
          createdAt: new Date(element.createdAt),
        })),
        chores: parsed.chores.map((chore: any) => ({
          ...chore,
          assignedDate: new Date(chore.assignedDate),
          completedDate: chore.completedDate ? new Date(chore.completedDate) : undefined,
        })),
      };
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
  return defaultUserData;
};

export const clearUserData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

export const exportUserData = (): string => {
  const data = loadUserData();
  return JSON.stringify(data, null, 2);
};

export const importUserData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    saveUserData(data);
    return true;
  } catch (error) {
    console.error('Error importing user data:', error);
    return false;
  }
};