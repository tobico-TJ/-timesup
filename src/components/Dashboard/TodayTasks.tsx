import React from 'react';
import { CheckCircle2, Circle, Clock, Flag } from 'lucide-react';
import { Task } from '../../types';
import { isSameDay } from 'date-fns';

interface TodayTasksProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
}

const TodayTasks: React.FC<TodayTasksProps> = ({ tasks, onToggleTask }) => {
  const todayTasks = tasks.filter(task => isSameDay(task.date, new Date()));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Sin prioridad';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Tareas de Hoy</h3>
        <p className="text-sm text-gray-600">
          {todayTasks.filter(t => t.completed).length} de {todayTasks.length} completadas
        </p>
      </div>
      
      <div className="p-6">
        {todayTasks.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay tareas para hoy</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <div 
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  task.completed 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
              >
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 hover:text-blue-600" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${
                    task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                  }`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-sm text-gray-600 truncate">{task.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Flag className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
                    <span className={`text-xs ${getPriorityColor(task.priority)}`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                    {task.startTime && (
                      <>
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{task.startTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayTasks;