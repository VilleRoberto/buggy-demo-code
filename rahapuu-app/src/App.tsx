import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import Tree from './components/Tree';
import Goals from './components/Goals';
import Savings from './components/Savings';
import './index.css';

// Simple chores and settings placeholders for now
const Chores: React.FC = () => {
  const { state } = useApp();
  const { language } = state.userData.settings;
  
  return (
    <div className="p-4 pb-20 max-w-md mx-auto text-center py-12">
      <div className="text-6xl mb-4">🔧</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        {language === 'fi' ? 'Tulossa pian!' : 'Coming Soon!'}
      </h2>
      <p className="text-gray-600">
        {language === 'fi' 
          ? 'Tehtävät-osio on kehityksen alla.' 
          : 'Chores section is under development.'
        }
      </p>
    </div>
  );
};

const Settings: React.FC = () => {
  const { state } = useApp();
  const { language } = state.userData.settings;
  
  return (
    <div className="p-4 pb-20 max-w-md mx-auto text-center py-12">
      <div className="text-6xl mb-4">⚙️</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        {language === 'fi' ? 'Tulossa pian!' : 'Coming Soon!'}
      </h2>
      <p className="text-gray-600">
        {language === 'fi' 
          ? 'Asetukset-osio on kehityksen alla.' 
          : 'Settings section is under development.'
        }
      </p>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { state } = useApp();
  const { currentView, loading } = state;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🌳</div>
          <div className="text-lg font-semibold text-gray-700">Rahapuu</div>
          <div className="text-sm text-gray-500 mt-2">Ladataan...</div>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'tree':
        return <Tree />;
      case 'goals':
        return <Goals />;
      case 'savings':
        return <Savings />;
      case 'chores':
        return <Chores />;
      case 'parent':
        return <Settings />;
      default:
        return <Tree />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-blue to-sky-300">
      {/* Header */}
      <header className="bg-white bg-opacity-90 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="text-2xl mr-2">🌳</div>
            <h1 className="text-xl font-bold text-gray-800">Rahapuu</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="min-h-[calc(100vh-140px)]">
        {renderCurrentView()}
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
