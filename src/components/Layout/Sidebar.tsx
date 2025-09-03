import React from 'react';
import { 
  Calendar, 
  Clock, 
  CheckSquare, 
  Music, 
  BarChart3, 
  Settings,
  Home,
  MessageCircle,
  Grid3X3,
  Crown,
  Gamepad2,
  BookOpen,
  Shield,
  Gift,
  HeadphonesIcon,
  Users
} from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  currentUser: User | null;
  shouldShowPremiumFeatures: boolean;
  shouldShowAdminFeatures: boolean;
  theme?: 'light' | 'dark';
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  onViewChange, 
  currentUser, 
  shouldShowPremiumFeatures,
  shouldShowAdminFeatures,
  theme = 'light' 
}) => {
  const freeMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'pomodoro', label: 'Pomodoro', icon: Clock },
    { id: 'tasks', label: 'Eventos', icon: CheckSquare },
    { id: 'eisenhower', label: 'Matriz Eisenhower', icon: Grid3X3 },
    { id: 'chatbot', label: 'Coach TIME', icon: MessageCircle },
    { id: 'concentration', label: 'Concentración', icon: Shield },
    { id: 'music', label: 'Música', icon: Music },
    { id: 'rewards', label: 'Recompensas', icon: Gift },
    { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const premiumMenuItems = [
    { id: 'minigames', label: 'Minijuegos', icon: Gamepad2, premium: true },
    { id: 'library', label: 'Biblioteca Premium', icon: BookOpen, premium: true },
    { id: 'support', label: 'Tu Voz Importa', icon: HeadphonesIcon, premium: true },
  ];

  const adminMenuItems = [
    { id: 'admin', label: 'Panel Admin', icon: Users, admin: true },
  ];

  let allMenuItems = [...freeMenuItems];
  
  if (shouldShowPremiumFeatures) {
    allMenuItems = [
      ...freeMenuItems.slice(0, -1), 
      ...premiumMenuItems, 
      freeMenuItems[freeMenuItems.length - 1]
    ];
  }
  
  if (shouldShowAdminFeatures) {
    allMenuItems = [
      ...adminMenuItems,
      ...allMenuItems
    ];
  }

  return (
    <div className={`w-64 shadow-lg border-r h-screen flex flex-col ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className={`p-6 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="18" r="12" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2"/>
              <circle cx="16" cy="18" r="8" fill="none" stroke="#3B82F6" strokeWidth="1.5"/>
              <path d="M16 12v6l4 4" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
              <rect x="14" y="4" width="4" height="6" rx="2" fill="#3B82F6"/>
              <circle cx="16" cy="18" r="1.5" fill="#3B82F6"/>
            </svg>
          </div>
          <h1 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Time's Up</h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {allMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeView === item.id
                      ? (theme === 'dark' 
                          ? 'bg-blue-900 text-blue-300 border border-blue-800' 
                          : 'bg-blue-50 text-blue-700 border border-blue-200') + (item.premium ? ' bg-gradient-to-r from-yellow-50 to-orange-50' : '')
                      : (theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                  {item.id === 'chatbot' && (
                    <span className="ml-auto bg-green-500 w-2 h-2 rounded-full flex-shrink-0"></span>
                  )}
                  {item.premium && (
                    <Crown className="ml-auto w-4 h-4 text-yellow-500 flex-shrink-0" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {!shouldShowPremiumFeatures && (
        <div className={`p-4 border-t ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={() => onViewChange('upgrade')}
            className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-colors"
          >
            <Crown className="w-5 h-5" />
            <span className="font-medium">Upgrade a Premium</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;