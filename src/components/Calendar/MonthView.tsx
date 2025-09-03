import React from 'react';
import { getMonthDays, formatDate, isToday } from '../../utils/dateUtils';
import { isSameDay, isSameMonth } from 'date-fns';
import { Task } from '../../types';

interface MonthViewProps {
  date: Date;
  tasks: Task[];
}

const MonthView: React.FC<MonthViewProps> = ({ date, tasks }) => {
  const monthDays = getMonthDays(date);
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Add padding days to start from Monday
  const firstDay = monthDays[0];
  const startPadding = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
  const paddingDays = Array.from({ length: startPadding }, (_, i) => {
    const paddingDate = new Date(firstDay);
    paddingDate.setDate(firstDay.getDate() - startPadding + i);
    return paddingDate;
  });

  const allDays = [...paddingDays, ...monthDays];

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
    <div>
      {/* Header with day names */}
      <div className="grid grid-cols-7 gap-px mb-2">
        {weekDays.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {allDays.map((day, index) => {
          const dayTasks = getTasksForDay(day);
          const isCurrentDay = isToday(day);
          const isCurrentMonth = isSameMonth(day, date);
          
          return (
            <div 
              key={index} 
              className={`bg-white min-h-[120px] p-2 ${
                !isCurrentMonth ? 'opacity-40' : ''
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isCurrentDay 
                  ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' 
                  : 'text-gray-900'
              }`}>
                {formatDate(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className="text-xs p-1 rounded bg-gray-100 text-gray-800 truncate"
                  >
                    <div className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${getEisenhowerColor(task)}`} />
                      <span className="truncate">{task.title}</span>
                    </div>
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayTasks.length - 2}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;