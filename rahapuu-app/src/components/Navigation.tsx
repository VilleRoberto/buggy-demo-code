import React from 'react';
import { 
  TreePine, 
  Target, 
  PiggyBank, 
  ListTodo, 
  Settings 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ViewType } from '../types';

const Navigation: React.FC = () => {
  const { state, actions } = useApp();
  const { currentView, userData } = state;
  const { language } = userData.settings;

  const navItems: Array<{
    id: ViewType;
    icon: React.ReactNode;
    label: { fi: string; en: string };
    color: string;
  }> = [
    {
      id: 'tree',
      icon: <TreePine size={24} />,
      label: { fi: 'Puu', en: 'Tree' },
      color: 'text-tree-green',
    },
    {
      id: 'goals',
      icon: <Target size={24} />,
      label: { fi: 'Tavoitteet', en: 'Goals' },
      color: 'text-blue-600',
    },
    {
      id: 'savings',
      icon: <PiggyBank size={24} />,
      label: { fi: 'Säästöt', en: 'Savings' },
      color: 'text-purple-600',
    },
    {
      id: 'chores',
      icon: <ListTodo size={24} />,
      label: { fi: 'Tehtävät', en: 'Chores' },
      color: 'text-orange-600',
    },
    {
      id: 'parent',
      icon: <Settings size={24} />,
      label: { fi: 'Asetukset', en: 'Settings' },
      color: 'text-gray-600',
    },
  ];

  const handleNavClick = (viewType: ViewType) => {
    actions.setView(viewType);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? `${item.color} bg-opacity-10 bg-current transform scale-110`
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className={`mb-1 ${isActive ? 'animate-bounce-in' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-xs font-medium">
                  {item.label[language]}
                </span>
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-current rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;