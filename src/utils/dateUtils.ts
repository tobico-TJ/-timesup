import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, addYears, subYears } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date: Date, formatStr: string) => {
  return format(date, formatStr, { locale: es });
};

export const getWeekDays = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const getMonthDays = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

export const navigateDate = (date: Date, direction: 'prev' | 'next', view: string) => {
  switch (view) {
    case 'day':
      return direction === 'next' ? addDays(date, 1) : subDays(date, 1);
    case 'week':
      return direction === 'next' ? addWeeks(date, 1) : subWeeks(date, 1);
    case 'month':
      return direction === 'next' ? addMonths(date, 1) : subMonths(date, 1);
    case 'year':
      return direction === 'next' ? addYears(date, 1) : subYears(date, 1);
    default:
      return date;
  }
};

export const isToday = (date: Date) => {
  return isSameDay(date, new Date());
};