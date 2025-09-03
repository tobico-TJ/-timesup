import React from 'react';
import { formatDate } from '../../utils/dateUtils';
import { addMonths, startOfYear, getMonth } from 'date-fns';

interface YearViewProps {
  date: Date;
  onMonthClick: (month: Date) => void;
}

const YearView: React.FC<YearViewProps> = ({ date, onMonthClick }) => {
  const yearStart = startOfYear(date);
  const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
      {months.map((month, index) => {
        const isCurrentMonth = getMonth(month) === currentMonth && date.getFullYear() === currentYear;
        
        return (
          <button
            key={index}
            onClick={() => onMonthClick(month)}
            className={`p-4 rounded-lg border transition-colors text-center ${
              isCurrentMonth
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-900'
            }`}
          >
            <div className="font-semibold text-lg">
              {formatDate(month, 'MMM')}
            </div>
            <div className="text-sm text-gray-600">
              {formatDate(month, 'yyyy')}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default YearView;