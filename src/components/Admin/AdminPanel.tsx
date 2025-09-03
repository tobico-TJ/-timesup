import React, { useState, useEffect } from 'react';
import { Users, Crown, MessageCircle, Download, Eye, EyeOff, Settings, BarChart3 } from 'lucide-react';
import { User, SupportMessage, AdminViewMode } from '../../types';

interface AdminPanelProps {
  currentUser: User;
  onViewModeChange: (mode: AdminViewMode['mode']) => void;
  currentViewMode: AdminViewMode['mode'];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, onViewModeChange, currentViewMode }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'support' | 'stats'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [responseText, setResponseText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const allMessages = JSON.parse(localStorage.getItem('support_messages') || '[]');
    
    setUsers(allUsers);
    setSupportMessages(allMessages.map((msg: any) => ({
      ...msg,
      createdAt: new Date(msg.createdAt),
      responseDate: msg.responseDate ? new Date(msg.responseDate) : undefined
    })));
  };

  const toggleUserPremium = (userId: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, isPremium: !user.isPremium } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const respondToMessage = (messageId: string) => {
    const response = responseText[messageId];
    if (!response?.trim()) return;

    const updatedMessages = supportMessages.map(msg => 
      msg.id === messageId 
        ? { ...msg, response, responseDate: new Date(), status: 'responded' as const }
        : msg
    );
    
    setSupportMessages(updatedMessages);
    localStorage.setItem('support_messages', JSON.stringify(updatedMessages));
    setResponseText({ ...responseText, [messageId]: '' });
  };

  const exportUsers = () => {
    const csvContent = [
      ['Nombre', 'Usuario', 'Email', 'Premium', 'Fecha Registro', 'Puntos'].join(','),
      ...users.map(user => [
        user.name,
        user.username,
        user.username + '@timesup.app',
        user.isPremium ? 'Sí' : 'No',
        new Date(user.createdAt).toLocaleDateString(),
        user.points || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios_timesup.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStats = () => {
    const totalUsers = users.length;
    const premiumUsers = users.filter(u => u.isPremium).length;
    const pendingMessages = supportMessages.filter(m => m.status === 'pending').length;
    const totalPoints = users.reduce((sum, user) => sum + (user.points || 0), 0);

    return { totalUsers, premiumUsers, pendingMessages, totalPoints };
  };

  const stats = getStats();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Panel de Administración</h2>
              <p className="text-gray-600">Bienvenido, {currentUser.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Ver como:</span>
            <select
              value={currentViewMode}
              onChange={(e) => onViewModeChange(e.target.value as AdminViewMode['mode'])}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="admin">Administrador</option>
              <option value="normal">Usuario Normal</option>
              <option value="premium">Usuario Premium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-600">Total Usuarios</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              <span className="text-sm text-yellow-600">Premium</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900">{stats.premiumUsers}</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-600">Mensajes Pendientes</span>
            </div>
            <p className="text-2xl font-bold text-red-900">{stats.pendingMessages}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-600">Puntos Totales</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{stats.totalPoints}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Usuarios
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'support'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Soporte ({stats.pendingMessages})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'stats'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Estadísticas
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Gestión de Usuarios</h3>
              <button
                onClick={exportUsers}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Usuario</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nombre</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Puntos</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Registro</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{user.username}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          user.isPremium 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.isPremium && <Crown className="w-3 h-3" />}
                          {user.isPremium ? 'Premium' : 'Gratuito'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{user.points || 0}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(new Date(user.createdAt))}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleUserPremium(user.id)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            user.isPremium
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {user.isPremium ? 'Quitar Premium' : 'Hacer Premium'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Mensajes de Soporte</h3>
            
            <div className="space-y-6">
              {supportMessages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay mensajes de soporte</p>
                </div>
              ) : (
                supportMessages.map((message) => (
                  <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{message.userName}</h4>
                        <p className="text-sm text-gray-500">{formatDate(message.createdAt)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        message.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {message.status === 'pending' ? 'Pendiente' : 'Respondido'}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <p className="text-gray-800">{message.message}</p>
                    </div>
                    
                    {message.response ? (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-blue-800 text-sm font-medium mb-1">Tu respuesta:</p>
                        <p className="text-blue-700">{message.response}</p>
                        <p className="text-blue-600 text-xs mt-2">
                          Respondido el {message.responseDate && formatDate(message.responseDate)}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <textarea
                          value={responseText[message.id] || ''}
                          onChange={(e) => setResponseText({ ...responseText, [message.id]: e.target.value })}
                          placeholder="Escribe tu respuesta..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => respondToMessage(message.id)}
                          disabled={!responseText[message.id]?.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          Enviar Respuesta
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Estadísticas Detalladas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Distribución de Usuarios</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usuarios Gratuitos:</span>
                    <span className="font-medium">{stats.totalUsers - stats.premiumUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usuarios Premium:</span>
                    <span className="font-medium text-yellow-600">{stats.premiumUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tasa de Conversión:</span>
                    <span className="font-medium">
                      {stats.totalUsers > 0 ? Math.round((stats.premiumUsers / stats.totalUsers) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Actividad de Soporte</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Mensajes:</span>
                    <span className="font-medium">{supportMessages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pendientes:</span>
                    <span className="font-medium text-red-600">{stats.pendingMessages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Respondidos:</span>
                    <span className="font-medium text-green-600">
                      {supportMessages.length - stats.pendingMessages}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;