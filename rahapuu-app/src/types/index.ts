export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string; // emoji or icon name
  color: string;
  createdAt: Date;
  isCompleted: boolean;
}

export interface TreeElement {
  id: string;
  type: 'leaf' | 'fruit' | 'flower';
  position: { x: number; y: number };
  size: number;
  color: string;
  linkedGoalId?: string;
  createdAt: Date;
}

export interface SavingsTransaction {
  id: string;
  amount: number;
  description: string;
  goalId?: string; // which goal this saving is for
  type: 'allowance' | 'chore' | 'gift' | 'other';
  createdAt: Date;
}

export interface Chore {
  id: string;
  name: string;
  reward: number;
  isCompleted: boolean;
  assignedDate: Date;
  completedDate?: Date;
}

export interface AppSettings {
  childName: string;
  currency: string;
  parentPinEnabled: boolean;
  parentPin?: string;
  language: 'fi' | 'en';
  soundEnabled: boolean;
  animationsEnabled: boolean;
}

export interface UserData {
  totalSavings: number;
  goals: SavingsGoal[];
  transactions: SavingsTransaction[];
  treeElements: TreeElement[];
  chores: Chore[];
  settings: AppSettings;
  createdAt: Date;
  lastUpdated: Date;
}

export type ViewType = 'tree' | 'goals' | 'savings' | 'chores' | 'parent';

export interface TreeConfig {
  maxElements: number;
  elementSpacing: number;
  treeHeight: number;
  trunkWidth: number;
}