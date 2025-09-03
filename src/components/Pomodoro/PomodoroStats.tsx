import React from 'react';
import { Clock, Target, Trophy } from 'lucide-react';
import { PomodoroSession } from '../../types';
import { format, isToday } from 'date-fns';

interface PomodoroStatsProps {
  sessions: PomodoroSession[];
  completedSessions: number;
}

const PomodoroStats: React.FC<PomodoroStatsProps> = ({ sessions, completedSessions }) => {
  const todaySessions = sessions.filter(session => isToday(session.completedAt));
  const totalFocusTime = todaySessions
    .filter(session => session.type === 'work')
    .reduce((total, session) => total + session.duration, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas de Hoy</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{completedSessions}</p>
          <p className="text-sm text-gray-600">Sesiones</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Target className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalFocusTime}</p>
          <p className="text-sm text-gray-600">Minutos</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Trophy className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{Math.floor(totalFocusTime / 25)}</p>
          <p className="text-sm text-gray-600">Pomodoros</p>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">Sesiones Recientes</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {todaySessions.slice(-5).reverse().map((session) => (
            <div key={session.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  session.type === 'work' ? 'bg-red-500' :
                  session.type === 'short-break' ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                <span className="text-sm font-medium text-gray-900">
                  {session.type === 'work' ? 'Trabajo' :
                   session.type === 'short-break' ? 'Descanso Corto' : 'Descanso Largo'}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {format(session.completedAt, 'HH:mm')}
              </span>
            </div>
          ))}
          {todaySessions.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No hay sesiones completadas hoy
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PomodoroStats;