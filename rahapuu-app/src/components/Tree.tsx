import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { TreeElement } from '../types';

interface TreeElementProps {
  element: TreeElement;
  onClick: (element: TreeElement) => void;
}

const TreeElementComponent: React.FC<TreeElementProps> = ({ element, onClick }) => {
  const getElementEmoji = (type: TreeElement['type']) => {
    switch (type) {
      case 'fruit':
        return '🍎';
      case 'flower':
        return '🌸';
      case 'leaf':
      default:
        return '🍃';
    }
  };

  return (
    <div
      className={`leaf absolute cursor-pointer transform hover:scale-110 transition-all duration-300 ${
        element.type === 'fruit' ? 'animate-bounce-in' : 'animate-grow'
      }`}
      style={{
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        fontSize: `${element.size}px`,
        filter: `hue-rotate(${element.color === '#dc2626' ? '0deg' : '30deg'})`,
      }}
      onClick={() => onClick(element)}
      title={`Säästö: ${element.linkedGoalId ? 'Tavoitteeseen' : 'Yleinen'}`}
    >
      {getElementEmoji(element.type)}
    </div>
  );
};

const Tree: React.FC = () => {
  const { state } = useApp();
  const { userData } = state;
  const [selectedElement, setSelectedElement] = useState<TreeElement | null>(null);

  const handleElementClick = (element: TreeElement) => {
    setSelectedElement(element);
    // Could add sound effect here if settings allow
  };

  const closeModal = () => {
    setSelectedElement(null);
  };

  const getTreeSize = () => {
    const elementCount = userData.treeElements.length;
    if (elementCount > 50) return 'scale-110';
    if (elementCount > 20) return 'scale-105';
    return 'scale-100';
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      {/* Sky background with sun */}
      <div className="absolute top-4 right-4">
        <div className="text-6xl animate-sparkle">☀️</div>
      </div>

      {/* Tree container */}
      <div className={`tree-container ${getTreeSize()} transition-transform duration-500`}>
        {/* Tree trunk */}
        <div 
          className="absolute bottom-0 bg-tree-brown rounded-t-lg"
          style={{
            width: '40px',
            height: '120px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {/* Tree trunk texture */}
          <div className="w-full h-full bg-gradient-to-b from-amber-800 to-amber-900 rounded-t-lg opacity-60"></div>
        </div>

        {/* Tree crown base */}
        <div 
          className="absolute bg-tree-green rounded-full opacity-20"
          style={{
            width: '280px',
            height: '280px',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        ></div>

        {/* Tree elements (leaves, fruits, flowers) */}
        {userData.treeElements.map((element) => (
          <TreeElementComponent
            key={element.id}
            element={element}
            onClick={handleElementClick}
          />
        ))}

        {/* Empty state message */}
        {userData.treeElements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6 bg-white bg-opacity-90 rounded-xl shadow-lg">
              <div className="text-4xl mb-2">🌱</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {userData.settings.language === 'fi' 
                  ? 'Puusi odottaa ensimmäistä säästöä!' 
                  : 'Your tree is waiting for the first savings!'
                }
              </h3>
              <p className="text-sm text-gray-500">
                {userData.settings.language === 'fi'
                  ? 'Lisää säästöjä nähdäksesi puun kasvavan!'
                  : 'Add savings to see your tree grow!'
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tree stats */}
      <div className="mt-6 bg-white bg-opacity-90 rounded-xl p-4 shadow-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-tree-green">
              {userData.treeElements.length}
            </div>
            <div className="text-xs text-gray-600">
              {userData.settings.language === 'fi' ? 'Elementtejä' : 'Elements'}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {userData.totalSavings.toFixed(2)} {userData.settings.currency}
            </div>
            <div className="text-xs text-gray-600">
              {userData.settings.language === 'fi' ? 'Säästöjä' : 'Savings'}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {userData.goals.filter(g => g.isCompleted).length}
            </div>
            <div className="text-xs text-gray-600">
              {userData.settings.language === 'fi' ? 'Tavoitteita' : 'Goals'}
            </div>
          </div>
        </div>
      </div>

      {/* Element detail modal */}
      {selectedElement && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl p-6 m-4 max-w-sm w-full shadow-2xl transform animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">
                {selectedElement.type === 'fruit' ? '🍎' : selectedElement.type === 'flower' ? '🌸' : '🍃'}
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {userData.settings.language === 'fi' ? 'Puun elementti' : 'Tree Element'}
              </h3>
              <p className="text-gray-600 mb-4">
                {userData.settings.language === 'fi' 
                  ? `Lisätty: ${selectedElement.createdAt.toLocaleDateString('fi-FI')}`
                  : `Added: ${selectedElement.createdAt.toLocaleDateString('en-US')}`
                }
              </p>
              {selectedElement.linkedGoalId && (
                <p className="text-sm text-blue-600 mb-4">
                  {userData.settings.language === 'fi' ? 'Liitetty tavoitteeseen' : 'Linked to goal'}
                </p>
              )}
              <button
                onClick={closeModal}
                className="btn-primary"
              >
                {userData.settings.language === 'fi' ? 'Sulje' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tree;