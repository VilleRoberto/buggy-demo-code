import React, { useState } from 'react';
import { Plus, Edit, Trash2, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateGoalProgress, formatCurrency } from '../utils/calculations';
import type { SavingsGoal } from '../types';

const Goals: React.FC = () => {
  const { state, actions } = useApp();
  const { userData } = state;
  const { language, currency } = userData.settings;
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    icon: '🎯',
    color: '#22c55e',
  });

  const goalIcons = ['🎯', '🎮', '🚲', '🧸', '📚', '🎨', '⚽', '🎪', '🍦', '🎁'];
  const goalColors = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

  const handleAddGoal = () => {
    if (newGoal.name.trim() && newGoal.targetAmount) {
      actions.addGoal({
        name: newGoal.name.trim(),
        targetAmount: parseFloat(newGoal.targetAmount),
        icon: newGoal.icon,
        color: newGoal.color,
      });
      setNewGoal({ name: '', targetAmount: '', icon: '🎯', color: '#22c55e' });
      setShowAddGoal(false);
    }
  };

  const handleUpdateGoal = () => {
    if (editingGoal && editingGoal.name.trim()) {
      actions.updateGoal(editingGoal.id, {
        name: editingGoal.name,
        targetAmount: editingGoal.targetAmount,
        icon: editingGoal.icon,
        color: editingGoal.color,
      });
      setEditingGoal(null);
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    if (window.confirm(language === 'fi' ? 'Haluatko varmasti poistaa tämän tavoitteen?' : 'Are you sure you want to delete this goal?')) {
      actions.deleteGoal(goalId);
    }
  };

  const sortedGoals = [...userData.goals].sort((a, b) => {
    // Completed goals last
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    // Then by creation date
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const texts = {
    fi: {
      title: 'Säästötavoitteet',
      addGoal: 'Lisää tavoite',
      newGoal: 'Uusi tavoite',
      goalName: 'Tavoitteen nimi',
      targetAmount: 'Tavoitesumma',
      chooseIcon: 'Valitse kuvake',
      chooseColor: 'Valitse väri',
      save: 'Tallenna',
      cancel: 'Peruuta',
      edit: 'Muokkaa',
      delete: 'Poista',
      completed: 'Valmis!',
      progress: 'Edistyminen',
      noGoals: 'Ei tavoitteita vielä',
      addFirstGoal: 'Lisää ensimmäinen säästötavoitteesi!',
      remaining: 'jäljellä',
    },
    en: {
      title: 'Savings Goals',
      addGoal: 'Add Goal',
      newGoal: 'New Goal',
      goalName: 'Goal name',
      targetAmount: 'Target amount',
      chooseIcon: 'Choose icon',
      chooseColor: 'Choose color',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      completed: 'Complete!',
      progress: 'Progress',
      noGoals: 'No goals yet',
      addFirstGoal: 'Add your first savings goal!',
      remaining: 'remaining',
    },
  };

  const t = texts[language];

  return (
    <div className="p-4 pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
        <button
          onClick={() => setShowAddGoal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          {t.addGoal}
        </button>
      </div>

      {/* Goals list */}
      {sortedGoals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t.noGoals}</h3>
          <p className="text-gray-500 mb-4">{t.addFirstGoal}</p>
          <button
            onClick={() => setShowAddGoal(true)}
            className="btn-primary"
          >
            {t.addGoal}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedGoals.map((goal) => {
            const progress = calculateGoalProgress(goal);
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

            return (
              <div
                key={goal.id}
                className={`goal-card ${goal.isCompleted ? 'border-l-green-500 bg-green-50' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="text-2xl p-2 rounded-lg"
                      style={{ backgroundColor: `${goal.color}20` }}
                    >
                      {goal.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{goal.name}</h3>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(goal.currentAmount, currency)} / {formatCurrency(goal.targetAmount, currency)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!goal.isCompleted && (
                      <button
                        onClick={() => setEditingGoal(goal)}
                        className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{t.progress}</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor: goal.color,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Status */}
                {goal.isCompleted ? (
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <Check size={16} />
                    {t.completed}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    {formatCurrency(remaining, currency)} {t.remaining}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">{t.newGoal}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.goalName}
                </label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tree-green focus:border-transparent"
                  placeholder={language === 'fi' ? 'esim. Uusi pyörä' : 'e.g. New bicycle'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.targetAmount} ({currency})
                </label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tree-green focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.chooseIcon}
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {goalIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewGoal({ ...newGoal, icon })}
                      className={`p-3 text-xl rounded-lg border-2 transition-all ${
                        newGoal.icon === icon
                          ? 'border-tree-green bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.chooseColor}
                </label>
                <div className="flex gap-2">
                  {goalColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewGoal({ ...newGoal, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newGoal.color === color
                          ? 'border-gray-800 scale-110'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddGoal(false)}
                className="btn-secondary flex-1"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleAddGoal}
                disabled={!newGoal.name.trim() || !newGoal.targetAmount}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {editingGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">{t.edit} {editingGoal.name}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.goalName}
                </label>
                <input
                  type="text"
                  value={editingGoal.name}
                  onChange={(e) => setEditingGoal({ ...editingGoal, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tree-green focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.targetAmount} ({currency})
                </label>
                <input
                  type="number"
                  value={editingGoal.targetAmount}
                  onChange={(e) => setEditingGoal({ ...editingGoal, targetAmount: parseFloat(e.target.value) || 0 })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tree-green focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.chooseIcon}
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {goalIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setEditingGoal({ ...editingGoal, icon })}
                      className={`p-3 text-xl rounded-lg border-2 transition-all ${
                        editingGoal.icon === icon
                          ? 'border-tree-green bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.chooseColor}
                </label>
                <div className="flex gap-2">
                  {goalColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setEditingGoal({ ...editingGoal, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        editingGoal.color === color
                          ? 'border-gray-800 scale-110'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingGoal(null)}
                className="btn-secondary flex-1"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleUpdateGoal}
                disabled={!editingGoal.name.trim()}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;