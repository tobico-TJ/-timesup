import React, { useState } from 'react';
import { Bell, BellOff, Settings, Clock, CheckCircle, X } from 'lucide-react';
import { NotificationSettings } from '../../types';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  taskReminders: Array<{
    id: string;
    title: string;
    time: string;
    type: 'task' | 'pomodoro' | 'break';
  }>;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, taskReminders }) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    taskReminders: true,
    pomodoroAlerts: true,
    dailyGoals: true,
    streakReminders: true
  });

  const [showSettings, setShowSettings] = useState(false);

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'pomodoro': return <Clock className="w-4 h-4 text-red-600" />;
      case 'break': return <Clock className="w-4 h-4 text-green-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-16 p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {settings.enabled ? (
                <Bell className="w-5 h-5 text-blue-600" />
              ) : (
                <BellOff className="w-5 h-5 text-gray-400" />
              )}
              <h3 className="font-semibold text-gray-900">Notificaciones</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {showSettings ? (
          <div className="p-4">
            <h4 className="font-medium text-gray-900 mb-4">Configuración de Notificaciones</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Notificaciones generales</p>
                  <p className="text-sm text-gray-600">Activar/desactivar todas las notificaciones</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={(e) => updateSetting('enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Recordatorios de tareas</p>
                  <p className="text-sm text-gray-600">Alertas para tareas programadas</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.taskReminders}
                    onChange={(e) => updateSetting('taskReminders', e.target.checked)}
                    disabled={!settings.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Alertas de Pomodoro</p>
                  <p className="text-sm text-gray-600">Notificaciones de inicio y fin de sesiones</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pomodoroAlerts}
                    onChange={(e) => updateSetting('pomodoroAlerts', e.target.checked)}
                    disabled={!settings.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Metas diarias</p>
                  <p className="text-sm text-gray-600">Recordatorios de objetivos del día</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.dailyGoals}
                    onChange={(e) => updateSetting('dailyGoals', e.target.checked)}
                    disabled={!settings.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Rachas de productividad</p>
                  <p className="text-sm text-gray-600">Mantener rachas activas</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.streakReminders}
                    onChange={(e) => updateSetting('streakReminders', e.target.checked)}
                    disabled={!settings.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {taskReminders.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No hay recordatorios pendientes</p>
                </div>
              ) : (
                taskReminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {getNotificationIcon(reminder.type)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{reminder.title}</p>
                      <p className="text-sm text-gray-600">{reminder.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {settings.enabled && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Mantén las notificaciones activadas para no perderte recordatorios importantes.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;