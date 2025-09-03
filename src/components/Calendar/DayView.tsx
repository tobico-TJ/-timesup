import React from 'react';
import { isSameDay } from 'date-fns';
import { Task } from '../../types';

interface DayViewProps {
  date: Date;
  tasks: Task[];
}

const DayView: React.FC<DayViewProps> = ({ date, tasks }) => {
  const dayTasks = tasks.filter(task => isSameDay(task.date, date));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getTasksForHour = (hour: number) => {
    return dayTasks.filter(task => {
      if (!task.startTime) return false;
      const taskHour = parseInt(task.startTime.split(':')[0]);
      return taskHour === hour;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getEisenhowerColor = (task: Task) => {
    if (task.isUrgent && task.isImportant) return 'bg-red-100 border-red-300 text-red-800'; // Hacer Ahora
    if (!task.isUrgent && task.isImportant) return 'bg-blue-100 border-blue-300 text-blue-800'; // Planificar
    if (task.isUrgent && !task.isImportant) return 'bg-yellow-100 border-yellow-300 text-yellow-800'; // Delegar
    return 'bg-gray-100 border-gray-300 text-gray-800'; // Eliminar
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
        {hours.map((hour) => {
          const hourTasks = getTasksForHour(hour);
          const hourString = hour.toString().padStart(2, '0') + ':00';
          
          return (
            <div key={hour} className="border-b border-gray-200 last:border-b-0">
              <div className="flex">
                <div className="w-20 flex-shrink-0 p-3 bg-gray-50 border-r border-gray-200">
                  <span className="text-sm font-medium text-gray-600">{hourString}</span>
                </div>
                <div className="flex-1 p-3 min-h-[60px]">
                  {hourTasks.length > 0 ? (
                    <div className="space-y-2">
                      {hourTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-2 rounded-lg border text-sm ${getEisenhowerColor(task)}`}
                        >
                          <div className="font-medium">{task.title}</div>
                          {task.description && (
                            <div className="text-xs mt-1 opacity-75">{task.description}</div>
                          )}
                          {task.startTime && task.endTime && (
                            <div className="text-xs mt-1 opacity-75">
                              {task.startTime} - {task.endTime}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">Sin eventos</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayView;