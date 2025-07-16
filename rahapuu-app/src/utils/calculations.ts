import type { SavingsGoal, TreeElement, SavingsTransaction } from '../types';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatCurrency = (amount: number, currency: string = '€'): string => {
  return `${amount.toFixed(2)} ${currency}`;
};

export const calculateGoalProgress = (goal: SavingsGoal): number => {
  if (goal.targetAmount === 0) return 0;
  return Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
};

export const calculateTotalSavings = (transactions: SavingsTransaction[]): number => {
  return transactions.reduce((total, transaction) => total + transaction.amount, 0);
};

export const getGoalSavings = (goalId: string, transactions: SavingsTransaction[]): number => {
  return transactions
    .filter(transaction => transaction.goalId === goalId)
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const generateTreeElementPosition = (
  existingElements: TreeElement[],
  treeAreaWidth: number = 300,
  treeAreaHeight: number = 400
): { x: number; y: number } => {
  const maxAttempts = 50;
  const minDistance = 30;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Generate position in an oval/tree shape
    const angle = Math.random() * Math.PI * 2;
    const radiusX = (treeAreaWidth / 2) * (0.3 + Math.random() * 0.6);
    const radiusY = (treeAreaHeight / 2) * (0.3 + Math.random() * 0.6);
    
    const x = Math.cos(angle) * radiusX + treeAreaWidth / 2;
    const y = Math.sin(angle) * radiusY + treeAreaHeight / 2;
    
    // Check if position is too close to existing elements
    const isTooClose = existingElements.some(element => {
      const distance = Math.sqrt(
        Math.pow(element.position.x - x, 2) + Math.pow(element.position.y - y, 2)
      );
      return distance < minDistance;
    });
    
    if (!isTooClose) {
      return { x, y };
    }
  }
  
  // Fallback: return a random position if we couldn't find a good spot
  return {
    x: Math.random() * treeAreaWidth,
    y: Math.random() * treeAreaHeight,
  };
};

export const getElementTypeForSavings = (amount: number): 'leaf' | 'fruit' | 'flower' => {
  if (amount >= 10) return 'fruit';
  if (amount >= 5) return 'flower';
  return 'leaf';
};

export const getElementColorForAmount = (amount: number): string => {
  if (amount >= 20) return '#dc2626'; // red fruit
  if (amount >= 10) return '#f59e0b'; // orange fruit
  if (amount >= 5) return '#ec4899'; // pink flower
  if (amount >= 2) return '#16a34a'; // dark green leaf
  return '#22c55e'; // light green leaf
};

export const getElementSizeForAmount = (amount: number): number => {
  const baseSize = 12;
  const maxSize = 24;
  const scaleFactor = Math.min(amount / 10, 2);
  return Math.min(baseSize + scaleFactor * 6, maxSize);
};

export const shouldShowCelebration = (
  goal: SavingsGoal,
  previousAmount: number
): boolean => {
  const wasCompleted = previousAmount >= goal.targetAmount;
  const isNowCompleted = goal.currentAmount >= goal.targetAmount;
  return !wasCompleted && isNowCompleted;
};

export const getMotivationalMessage = (progress: number, language: 'fi' | 'en' = 'fi'): string => {
  const messages = {
    fi: {
      start: ['Hienoa! Aloitit säästämisen! 🌱', 'Ensimmäinen askel on otettu! 💚'],
      progress: [
        'Hyvin menee! Jatka samaan malliin! 🌿',
        'Puusi kasvaa! Olet hyvällä tiellä! 🌳',
        'Mahtavaa! Säästösi lisääntyvät! ⭐',
      ],
      almost: ['Melkein perillä! Vielä vähän! 🎯', 'Aivan lähellä tavoitetta! 🔥'],
      complete: ['Tavoite saavutettu! Onnittelut! 🎉', 'Fantastista! Onnistuit! 🏆'],
    },
    en: {
      start: ['Great! You started saving! 🌱', 'First step taken! 💚'],
      progress: [
        'Well done! Keep it up! 🌿',
        'Your tree is growing! You\'re on the right track! 🌳',
        'Amazing! Your savings are growing! ⭐',
      ],
      almost: ['Almost there! Just a little more! 🎯', 'Very close to your goal! 🔥'],
      complete: ['Goal achieved! Congratulations! 🎉', 'Fantastic! You did it! 🏆'],
    },
  };
  
  const langMessages = messages[language];
  
  if (progress >= 100) {
    return langMessages.complete[Math.floor(Math.random() * langMessages.complete.length)];
  }
  if (progress >= 80) {
    return langMessages.almost[Math.floor(Math.random() * langMessages.almost.length)];
  }
  if (progress >= 10) {
    return langMessages.progress[Math.floor(Math.random() * langMessages.progress.length)];
  }
  return langMessages.start[Math.floor(Math.random() * langMessages.start.length)];
};