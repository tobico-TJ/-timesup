import React from 'react';
import { getWeekDays, formatDate, isToday } from '../../utils/dateUtils';
import { isSameDay } from 'date-fns';
import { Task } from '../../types';

interface WeekViewProps {
  date: Date;
  tasks: Task[];
}

const WeekView: React.FC<WeekViewProps> = ({ date, tasks }) => {
  const weekDays = getWeekDays(date);

  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => isSameDay(task.date, day));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getEisenhowerColor = (task: Task) => {
    if (task.isUrgent && task.isImportant) return 'bg-red-500'; // Hacer Ahora
    if (!task.isUrgent && task.isImportant) return 'bg-blue-500'; // Planificar
    if (task.isUrgent && !task.isImportant) return 'bg-yellow-500'; // Delegar
    return 'bg-gray-500'; // Eliminar
  };

  return (
    <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
      {weekDays.map((day, index) => {
        const dayTasks = getTasksForDay(day);
        const isCurrentDay = isToday(day);
        
        return (
          <div key={index} className="bg-white min-h-[200px]">
            <div className={`p-3 border-b border-gray-200 ${
              isCurrentDay ? 'bg-blue-50' : 'bg-gray-50'
            }`}>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600">
                  {formatDate(day, 'EEE')}
                </div>
                <div className={`text-lg font-semibold ${
                  isCurrentDay ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {formatDate(day, 'd')}
                </div>
              </div>
            </div>
            
            <div className="p-2 space-y-1">
              {dayTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="text-xs p-1 rounded bg-gray-100 text-gray-800 truncate"
                >
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getEisenhowerColor(task)}`} />
                    <span className="truncate">{task.title}</span>
                  </div>
                  {task.startTime && (
                    <div className="text-gray-600 mt-1">{task.startTime}</div>
                  )}
                </div>
              ))}
              {dayTasks.length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  +{dayTasks.length - 3} más
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekView;