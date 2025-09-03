import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Volume2, Wifi, Clock, X, Play, Pause } from 'lucide-react';

interface ConcentrationModeProps {
  isActive: boolean;
  onToggle: () => void;
}

const ConcentrationMode: React.FC<ConcentrationModeProps> = ({ isActive, onToggle }) => {
  const [settings, setSettings] = useState({
    blockNotifications: true,
    muteVolume: true,
    airplaneMode: false,
    blockApps: true,
    timer: 0 // 0 means no timer
  });
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            onToggle(); // Auto-disable concentration mode
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isTimerRunning, timeLeft, onToggle]);

  const handleActivate = () => {
    if (settings.timer > 0) {
      setTimeLeft(settings.timer * 60);
      setIsTimerRunning(true);
    }
    onToggle();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timerOptions = [
    { value: 0, label: 'Sin límite de tiempo' },
    { value: 25, label: '25 minutos (Pomodoro)' },
    { value: 45, label: '45 minutos' },
    { value: 60, label: '1 hora' },
    { value: 90, label: '1.5 horas' },
    { value: 120, label: '2 horas' }
  ];

  if (isActive) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Modo Concentración Activo</h2>
                <p className="text-sm text-red-700">Protegiendo tu enfoque</p>
              </div>
            </div>
            
            <button
              onClick={onToggle}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Desactivar
            </button>
          </div>
        </div>

        <div className="p-6">
          {timeLeft > 0 && (
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {formatTime(timeLeft)}
              </div>
              <p className="text-gray-600">Tiempo restante</p>
              
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isTimerRunning ? 'Pausar' : 'Reanudar'}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Configuraciones activas:</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {settings.blockNotifications && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Smartphone className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-800">Notificaciones bloqueadas</span>
                </div>
              )}
              
              {settings.muteVolume && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Volume2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-800">Volumen silenciado</span>
                </div>
              )}
              
              {settings.airplaneMode && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Wifi className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-800">Modo avión activo</span>
                </div>
              )}
              
              {settings.blockApps && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <X className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-800">Apps bloqueadas</span>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">💡 Consejos para mantener el enfoque:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Mantén agua cerca para hidratarte</li>
                <li>• Respira profundo si sientes ansiedad</li>
                <li>• Recuerda que cada minuto cuenta</li>
                <li>• Celebra cuando termines la sesión</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Modo Concentración</h2>
        </div>
        <p className="text-gray-600">Bloquea distracciones para maximizar tu enfoque</p>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Configurar bloqueos:</h3>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-600" />
                <div>
                  <span className="font-medium text-gray-900">Bloquear notificaciones</span>
                  <p className="text-sm text-gray-600">Silencia todas las notificaciones del dispositivo</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.blockNotifications}
                onChange={(e) => setSettings(prev => ({ ...prev, blockNotifications: e.target.checked }))}
                className="rounded border-gray-300"
              />
            </label>

            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-gray-600" />
                <div>
                  <span className="font-medium text-gray-900">Silenciar volumen</span>
                  <p className="text-sm text-gray-600">Pone el dispositivo en silencio</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.muteVolume}
                onChange={(e) => setSettings(prev => ({ ...prev, muteVolume: e.target.checked }))}
                className="rounded border-gray-300"
              />
            </label>

            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-gray-600" />
                <div>
                  <span className="font-medium text-gray-900">Modo avión</span>
                  <p className="text-sm text-gray-600">Desconecta internet y llamadas</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.airplaneMode}
                onChange={(e) => setSettings(prev => ({ ...prev, airplaneMode: e.target.checked }))}
                className="rounded border-gray-300"
              />
            </label>

            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <X className="w-5 h-5 text-gray-600" />
                <div>
                  <span className="font-medium text-gray-900">Bloquear apps distractoras</span>
                  <p className="text-sm text-gray-600">Impide acceso a redes sociales y juegos</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.blockApps}
                onChange={(e) => setSettings(prev => ({ ...prev, blockApps: e.target.checked }))}
                className="rounded border-gray-300"
              />
            </label>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Duración:</h3>
          <select
            value={settings.timer}
            onChange={(e) => setSettings(prev => ({ ...prev, timer: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timerOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleActivate}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all font-medium text-lg"
        >
          <Shield className="w-5 h-5" />
          Activar Modo Concentración
        </button>

        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Nota:</strong> Algunas funciones como modo avión requieren permisos del sistema que pueden no estar disponibles en navegadores web.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConcentrationMode;