import React from 'react';
import { Bell, Search, User, Crown } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { User as UserType } from '../../types';

interface HeaderProps {
  currentUser: UserType | null;
  onNotificationClick: () => void;
  onUserClick: () => void;
  notificationCount: number;
  theme?: 'light' | 'dark';
}

const Header: React.FC<HeaderProps> = ({ 
  currentUser, 
  onNotificationClick, 
  onUserClick, 
  notificationCount,
  theme = 'light'
}) => {
  const currentDate = new Date();

  return (
    <header className={`border-b px-6 py-4 ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {formatDate(currentDate, 'EEEE, d \'de\' MMMM')}
          </h2>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            {formatDate(currentDate, 'yyyy')}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Buscar tareas..."
              className={`pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
          
          <button 
            onClick={onNotificationClick}
            className={`relative p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={onUserClick}
            className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <User className="w-5 h-5" />
            {currentUser?.isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;