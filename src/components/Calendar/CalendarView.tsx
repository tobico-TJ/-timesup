import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, navigateDate } from '../../utils/dateUtils';
import { CalendarView as CalendarViewType } from '../../types';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';

interface CalendarViewProps {
  view: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
  tasks: any[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ view, onViewChange, tasks }) => {
  const handleDateNavigation = (direction: 'prev' | 'next') => {
    const newDate = navigateDate(view.date, direction, view.type);
    onViewChange({ ...view, date: newDate });
  };

  const handleViewTypeChange = (type: CalendarViewType['type']) => {
    onViewChange({ ...view, type });
  };

  const getDateTitle = () => {
    switch (view.type) {
      case 'day':
        return formatDate(view.date, 'EEEE, d \'de\' MMMM \'de\' yyyy');
      case 'week':
        return `Semana del ${formatDate(view.date, 'd \'de\' MMMM')}`;
      case 'month':
        return formatDate(view.date, 'MMMM \'de\' yyyy');
      case 'year':
        return formatDate(view.date, 'yyyy');
      default:
        return '';
    }
  };

  const renderCalendarContent = () => {
    switch (view.type) {
      case 'day':
        return <DayView date={view.date} tasks={tasks} />;
      case 'week':
        return <WeekView date={view.date} tasks={tasks} />;
      case 'month':
        return <MonthView date={view.date} tasks={tasks} />;
      case 'year':
        return <YearView date={view.date} onMonthClick={(month) => 
          onViewChange({ type: 'month', date: month })
        } />;
      default:
        return null;
    }
  };

  const viewTypes = [
    { key: 'day', label: 'Día' },
    { key: 'week', label: 'Semana' },
    { key: 'month', label: 'Mes' },
    { key: 'year', label: 'Año' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleDateNavigation('prev')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-900 capitalize">
              {getDateTitle()}
            </h2>
            
            <button
              onClick={() => handleDateNavigation('next')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {viewTypes.map((viewType) => (
              <button
                key={viewType.key}
                onClick={() => handleViewTypeChange(viewType.key as CalendarViewType['type'])}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view.type === viewType.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {viewType.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {renderCalendarContent()}
      </div>
    </div>
  );
};

export default CalendarView;