import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { UserData, SavingsGoal, SavingsTransaction, TreeElement, Chore, ViewType } from '../types';
import { loadUserData, saveUserData, defaultUserData } from '../utils/storage';
import { 
  generateId, 
  calculateTotalSavings, 
  getGoalSavings, 
  generateTreeElementPosition,
  getElementTypeForSavings,
  getElementColorForAmount,
  getElementSizeForAmount
} from '../utils/calculations';

interface AppState {
  userData: UserData;
  currentView: ViewType;
  loading: boolean;
  celebrationGoal: SavingsGoal | null;
}

type AppAction =
  | { type: 'LOAD_DATA' }
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'ADD_SAVINGS'; payload: { amount: number; description: string; goalId?: string } }
  | { type: 'ADD_GOAL'; payload: Omit<SavingsGoal, 'id' | 'currentAmount' | 'createdAt' | 'isCompleted'> }
  | { type: 'UPDATE_GOAL'; payload: { id: string; updates: Partial<SavingsGoal> } }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'ADD_CHORE'; payload: Omit<Chore, 'id' | 'isCompleted' | 'assignedDate'> }
  | { type: 'COMPLETE_CHORE'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserData['settings']> }
  | { type: 'SHOW_CELEBRATION'; payload: SavingsGoal }
  | { type: 'HIDE_CELEBRATION' }
  | { type: 'CLEAR_ALL_DATA' };

const initialState: AppState = {
  userData: defaultUserData,
  currentView: 'tree',
  loading: true,
  celebrationGoal: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        userData: loadUserData(),
        loading: false,
      };

    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload,
      };

    case 'ADD_SAVINGS': {
      const { amount, description, goalId } = action.payload;
      const newTransaction: SavingsTransaction = {
        id: generateId(),
        amount,
        description,
        goalId,
        type: 'other',
        createdAt: new Date(),
      };

      const updatedTransactions = [...state.userData.transactions, newTransaction];
      const totalSavings = calculateTotalSavings(updatedTransactions);

      // Update goal current amount if goalId is provided
      let updatedGoals = state.userData.goals;
      if (goalId) {
        updatedGoals = state.userData.goals.map(goal => {
          if (goal.id === goalId) {
            const newCurrentAmount = getGoalSavings(goalId, updatedTransactions);
            return {
              ...goal,
              currentAmount: newCurrentAmount,
              isCompleted: newCurrentAmount >= goal.targetAmount,
            };
          }
          return goal;
        });
      }

      // Add tree element
      const newTreeElement: TreeElement = {
        id: generateId(),
        type: getElementTypeForSavings(amount),
        position: generateTreeElementPosition(state.userData.treeElements),
        size: getElementSizeForAmount(amount),
        color: getElementColorForAmount(amount),
        linkedGoalId: goalId,
        createdAt: new Date(),
      };

      const updatedUserData: UserData = {
        ...state.userData,
        totalSavings,
        goals: updatedGoals,
        transactions: updatedTransactions,
        treeElements: [...state.userData.treeElements, newTreeElement],
      };

      return {
        ...state,
        userData: updatedUserData,
      };
    }

    case 'ADD_GOAL': {
      const newGoal: SavingsGoal = {
        ...action.payload,
        id: generateId(),
        currentAmount: 0,
        createdAt: new Date(),
        isCompleted: false,
      };

      const updatedUserData: UserData = {
        ...state.userData,
        goals: [...state.userData.goals, newGoal],
      };

      return {
        ...state,
        userData: updatedUserData,
      };
    }

    case 'UPDATE_GOAL': {
      const { id, updates } = action.payload;
      const updatedGoals = state.userData.goals.map(goal =>
        goal.id === id ? { ...goal, ...updates } : goal
      );

      const updatedUserData: UserData = {
        ...state.userData,
        goals: updatedGoals,
      };

      return {
        ...state,
        userData: updatedUserData,
      };
    }

    case 'DELETE_GOAL': {
      const goalId = action.payload;
      const updatedGoals = state.userData.goals.filter(goal => goal.id !== goalId);
      const updatedTransactions = state.userData.transactions.filter(
        transaction => transaction.goalId !== goalId
      );
      const updatedTreeElements = state.userData.treeElements.filter(
        element => element.linkedGoalId !== goalId
      );

      const updatedUserData: UserData = {
        ...state.userData,
        goals: updatedGoals,
        transactions: updatedTransactions,
        treeElements: updatedTreeElements,
        totalSavings: calculateTotalSavings(updatedTransactions),
      };

      return {
        ...state,
        userData: updatedUserData,
      };
    }

    case 'ADD_CHORE': {
      const newChore: Chore = {
        ...action.payload,
        id: generateId(),
        isCompleted: false,
        assignedDate: new Date(),
      };

      const updatedUserData: UserData = {
        ...state.userData,
        chores: [...state.userData.chores, newChore],
      };

      return {
        ...state,
        userData: updatedUserData,
      };
    }

    case 'COMPLETE_CHORE': {
      const choreId = action.payload;
      const updatedChores = state.userData.chores.map(chore =>
        chore.id === choreId
          ? { ...chore, isCompleted: true, completedDate: new Date() }
          : chore
      );

      const updatedUserData: UserData = {
        ...state.userData,
        chores: updatedChores,
      };

      return {
        ...state,
        userData: updatedUserData,
      };
    }

    case 'UPDATE_SETTINGS': {
      const updatedUserData: UserData = {
        ...state.userData,
        settings: { ...state.userData.settings, ...action.payload },
      };

      return {
        ...state,
        userData: updatedUserData,
      };
    }

    case 'SHOW_CELEBRATION':
      return {
        ...state,
        celebrationGoal: action.payload,
      };

    case 'HIDE_CELEBRATION':
      return {
        ...state,
        celebrationGoal: null,
      };

    case 'CLEAR_ALL_DATA':
      return {
        ...state,
        userData: defaultUserData,
      };

    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    loadData: () => void;
    setView: (view: ViewType) => void;
    addSavings: (amount: number, description: string, goalId?: string) => void;
    addGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'createdAt' | 'isCompleted'>) => void;
    updateGoal: (id: string, updates: Partial<SavingsGoal>) => void;
    deleteGoal: (id: string) => void;
    addChore: (chore: Omit<Chore, 'id' | 'isCompleted' | 'assignedDate'>) => void;
    completeChore: (id: string) => void;
    updateSettings: (settings: Partial<UserData['settings']>) => void;
    showCelebration: (goal: SavingsGoal) => void;
    hideCelebration: () => void;
    clearAllData: () => void;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data on mount
  useEffect(() => {
    dispatch({ type: 'LOAD_DATA' });
  }, []);

  // Save data whenever userData changes
  useEffect(() => {
    if (!state.loading) {
      saveUserData(state.userData);
    }
  }, [state.userData, state.loading]);

  const actions = {
    loadData: () => dispatch({ type: 'LOAD_DATA' }),
    setView: (view: ViewType) => dispatch({ type: 'SET_VIEW', payload: view }),
    addSavings: (amount: number, description: string, goalId?: string) =>
      dispatch({ type: 'ADD_SAVINGS', payload: { amount, description, goalId } }),
    addGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'createdAt' | 'isCompleted'>) =>
      dispatch({ type: 'ADD_GOAL', payload: goal }),
    updateGoal: (id: string, updates: Partial<SavingsGoal>) =>
      dispatch({ type: 'UPDATE_GOAL', payload: { id, updates } }),
    deleteGoal: (id: string) => dispatch({ type: 'DELETE_GOAL', payload: id }),
    addChore: (chore: Omit<Chore, 'id' | 'isCompleted' | 'assignedDate'>) =>
      dispatch({ type: 'ADD_CHORE', payload: chore }),
    completeChore: (id: string) => dispatch({ type: 'COMPLETE_CHORE', payload: id }),
    updateSettings: (settings: Partial<UserData['settings']>) =>
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
    showCelebration: (goal: SavingsGoal) => dispatch({ type: 'SHOW_CELEBRATION', payload: goal }),
    hideCelebration: () => dispatch({ type: 'HIDE_CELEBRATION' }),
    clearAllData: () => dispatch({ type: 'CLEAR_ALL_DATA' }),
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};