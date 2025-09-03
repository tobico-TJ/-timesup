import React from 'react';
import { BarChart3, TrendingUp, Target, Clock } from 'lucide-react';
import { Task, PomodoroSession } from '../../types';
import { isToday, isThisWeek, format } from 'date-fns';

interface ProductivityStatsProps {
  tasks: Task[];
  pomodoroSessions: PomodoroSession[];
}

const ProductivityStats: React.FC<ProductivityStatsProps> = ({ tasks, pomodoroSessions }) => {
  // Daily stats
  const todayTasks = tasks.filter(task => isToday(task.date));
  const completedTodayTasks = todayTasks.filter(task => task.completed);
  
  // Weekly stats
  const weekTasks = tasks.filter(task => isThisWeek(task.date));
  const completedWeekTasks = weekTasks.filter(task => task.completed);
  
  // Pomodoro stats
  const todayPomodoros = pomodoroSessions.filter(session => 
    session.type === 'work' && isToday(session.completedAt)
  );
  const weekPomodoros = pomodoroSessions.filter(session => 
    session.type === 'work' && isThisWeek(session.completedAt)
  );

  // Focus time (in minutes)
  const todayFocusTime = todayPomodoros.reduce((total, session) => total + session.duration, 0);
  const weekFocusTime = weekPomodoros.reduce((total, session) => total + session.duration, 0);

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    
    const dayTasks = tasks.filter(task => 
      format(task.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    const completedDayTasks = dayTasks.filter(task => task.completed);
    
    const dayPomodoros = pomodoroSessions.filter(session =>
      session.type === 'work' && 
      format(session.completedAt, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );

    return {
      day: format(date, 'EEE'),
      tasks: dayTasks.length,
      completed: completedDayTasks.length,
      pomodoros: dayPomodoros.length,
      focusTime: dayPomodoros.reduce((total, session) => total + session.duration, 0)
    };
  });

  const maxTasks = Math.max(...weeklyData.map(d => d.tasks), 1);
  const maxPomodoros = Math.max(...weeklyData.map(d => d.pomodoros), 1);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tareas Hoy</p>
              <p className="text-2xl font-bold text-gray-900">
                {completedTodayTasks.length}/{todayTasks.length}
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ 
                width: `${todayTasks.length > 0 ? (completedTodayTasks.length / todayTasks.length) * 100 : 0}%` 
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Esta Semana</p>
              <p className="text-2xl font-bold text-gray-900">
                {completedWeekTasks.length}/{weekTasks.length}
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ 
                width: `${weekTasks.length > 0 ? (completedWeekTasks.length / weekTasks.length) * 100 : 0}%` 
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pomodoros Hoy</p>
              <p className="text-2xl font-bold text-gray-900">{todayPomodoros.length}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">{todayFocusTime} min de enfoque</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Enfoque Semanal</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(weekFocusTime / 60)}h {weekFocusTime % 60}m
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600">{weekPomodoros.length} pomodoros</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Actividad de la Semana</h3>
        
        <div className="space-y-6">
          {/* Tasks Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Tareas Completadas</h4>
            <div className="flex items-end gap-2 h-32">
              {weeklyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-100 rounded-t relative flex-1 flex flex-col justify-end">
                    <div 
                      className="bg-blue-600 rounded-t transition-all duration-500"
                      style={{ 
                        height: `${(data.completed / maxTasks) * 100}%`,
                        minHeight: data.completed > 0 ? '4px' : '0px'
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{data.day}</span>
                  <span className="text-xs font-medium text-gray-900">
                    {data.completed}/{data.tasks}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pomodoros Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Sesiones Pomodoro</h4>
            <div className="flex items-end gap-2 h-24">
              {weeklyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-100 rounded-t relative flex-1 flex flex-col justify-end">
                    <div 
                      className="bg-red-600 rounded-t transition-all duration-500"
                      style={{ 
                        height: `${(data.pomodoros / maxPomodoros) * 100}%`,
                        minHeight: data.pomodoros > 0 ? '4px' : '0px'
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{data.day}</span>
                  <span className="text-xs font-medium text-gray-900">{data.pomodoros}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityStats;