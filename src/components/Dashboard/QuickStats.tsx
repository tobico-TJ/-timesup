import React from 'react';
import { CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';

interface QuickStatsProps {
  completedTasks: number;
  totalTasks: number;
  pomodoroSessions: number;
  focusTime: number;
}

const QuickStats: React.FC<QuickStatsProps> = ({
  completedTasks,
  totalTasks,
  pomodoroSessions,
  focusTime
}) => {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: 'Tareas Completadas',
      value: `${completedTasks}/${totalTasks}`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Sesiones Pomodoro',
      value: pomodoroSessions,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Tiempo de Enfoque',
      value: `${Math.floor(focusTime / 60)}h ${focusTime % 60}m`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Tasa de Completado',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuickStats;