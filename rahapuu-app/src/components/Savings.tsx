import React, { useState } from 'react';
import { Plus, PiggyBank, Calendar, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/calculations';

const Savings: React.FC = () => {
  const { state, actions } = useApp();
  const { userData } = state;
  const { language, currency } = userData.settings;
  const [showAddSavings, setShowAddSavings] = useState(false);

  const [newSaving, setNewSaving] = useState({
    amount: '',
    description: '',
    goalId: '',
  });

  const handleAddSaving = () => {
    if (newSaving.amount && parseFloat(newSaving.amount) > 0) {
      const amount = parseFloat(newSaving.amount);
      const description = newSaving.description.trim() || 
        (language === 'fi' ? 'Säästö' : 'Savings');
      const goalId = newSaving.goalId || undefined;

      actions.addSavings(amount, description, goalId);
      setNewSaving({ amount: '', description: '', goalId: '' });
      setShowAddSavings(false);
    }
  };

  const sortedTransactions = [...userData.transactions].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  const getGoalName = (goalId?: string) => {
    if (!goalId) return null;
    const goal = userData.goals.find(g => g.id === goalId);
    return goal?.name || null;
  };

  const texts = {
    fi: {
      title: 'Säästöt',
      addSaving: 'Lisää säästö',
      newSaving: 'Uusi säästö',
      amount: 'Summa',
      description: 'Kuvaus',
      selectGoal: 'Valitse tavoite',
      noGoal: 'Ei tavoitetta',
      save: 'Tallenna',
      cancel: 'Peruuta',
      totalSavings: 'Säästöt yhteensä',
      noTransactions: 'Ei säästöjä vielä',
      startSaving: 'Aloita säästäminen lisäämällä ensimmäinen säästösi!',
      optional: '(valinnainen)',
      today: 'Tänään',
      yesterday: 'Eilen',
      forGoal: 'tavoitteeseen',
    },
    en: {
      title: 'Savings',
      addSaving: 'Add Saving',
      newSaving: 'New Saving',
      amount: 'Amount',
      description: 'Description',
      selectGoal: 'Select Goal',
      noGoal: 'No Goal',
      save: 'Save',
      cancel: 'Cancel',
      totalSavings: 'Total Savings',
      noTransactions: 'No savings yet',
      startSaving: 'Start saving by adding your first savings!',
      optional: '(optional)',
      today: 'Today',
      yesterday: 'Yesterday',
      forGoal: 'for goal',
    },
  };

  const t = texts[language];

  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const transactionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (transactionDate.getTime() === today.getTime()) {
      return t.today;
    }
    if (transactionDate.getTime() === yesterday.getTime()) {
      return t.yesterday;
    }
    return language === 'fi' 
      ? date.toLocaleDateString('fi-FI')
      : date.toLocaleDateString('en-US');
  };

  return (
    <div className="p-4 pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
        <button
          onClick={() => setShowAddSavings(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          {t.addSaving}
        </button>
      </div>

      {/* Total savings card */}
      <div className="card mb-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <div className="text-center">
          <div className="text-4xl mb-2">💰</div>
          <h2 className="text-lg font-semibold mb-2">{t.totalSavings}</h2>
          <div className="text-3xl font-bold">
            {formatCurrency(userData.totalSavings, currency)}
          </div>
        </div>
      </div>

      {/* Transactions list */}
      {sortedTransactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏦</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t.noTransactions}</h3>
          <p className="text-gray-500 mb-4">{t.startSaving}</p>
          <button
            onClick={() => setShowAddSavings(true)}
            className="btn-primary"
          >
            {t.addSaving}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTransactions.map((transaction) => {
            const goalName = getGoalName(transaction.goalId);
            
            return (
              <div
                key={transaction.id}
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <PiggyBank size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {transaction.description}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>{formatDate(transaction.createdAt)}</span>
                        {goalName && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Target size={14} />
                              <span>{goalName}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-tree-green">
                      +{formatCurrency(transaction.amount, currency)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Saving Modal */}
      {showAddSavings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">{t.newSaving}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.amount} ({currency})
                </label>
                <input
                  type="number"
                  value={newSaving.amount}
                  onChange={(e) => setNewSaving({ ...newSaving, amount: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.description} {t.optional}
                </label>
                <input
                  type="text"
                  value={newSaving.description}
                  onChange={(e) => setNewSaving({ ...newSaving, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={language === 'fi' ? 'esim. Taskuraha' : 'e.g. Allowance'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.selectGoal} {t.optional}
                </label>
                <select
                  value={newSaving.goalId}
                  onChange={(e) => setNewSaving({ ...newSaving, goalId: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">{t.noGoal}</option>
                  {userData.goals
                    .filter(goal => !goal.isCompleted)
                    .map((goal) => (
                      <option key={goal.id} value={goal.id}>
                        {goal.icon} {goal.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Quick amount buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fi' ? 'Pikavalinnat' : 'Quick amounts'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 5, 10].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setNewSaving({ ...newSaving, amount: amount.toString() })}
                      className="btn-secondary text-sm py-2"
                    >
                      {amount} {currency}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddSavings(false)}
                className="btn-secondary flex-1"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleAddSaving}
                disabled={!newSaving.amount || parseFloat(newSaving.amount) <= 0}
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

export default Savings;