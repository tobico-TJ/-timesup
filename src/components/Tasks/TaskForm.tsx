import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Flag, Tag, Bell, Smartphone, Volume2 } from 'lucide-react';
import { Task } from '../../types';
import { format } from 'date-fns';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (task: Omit<Task, 'id'>) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '',
    endTime: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    category: 'general',
    isUrgent: false,
    isImportant: false,
    type: 'task' as 'task' | 'reminder' | 'event' | 'break',
    completed: false,
    reminderTime: 15,
    reminderType: 'notification' as 'notification' | 'alarm' | 'vibration'
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        date: format(task.date, 'yyyy-MM-dd'),
        startTime: task.startTime || '',
        endTime: task.endTime || '',
        priority: task.priority,
        category: task.category,
        isUrgent: task.isUrgent || false,
        isImportant: task.isImportant || false,
        type: task.type,
        completed: task.completed,
        reminderTime: task.reminderTime || 15,
        reminderType: task.reminderType || 'notification'
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      ...formData,
      date: new Date(formData.date)
    });
  };

  const categories = [
    'general',
    'trabajo',
    'personal',
    'estudio',
    'salud',
    'hogar',
    'finanzas'
  ];

  const eventTypes = [
    { value: 'task', label: 'Tarea', icon: <Flag className="w-4 h-4" /> },
    { value: 'reminder', label: 'Recordatorio', icon: <Bell className="w-4 h-4" /> },
    { value: 'event', label: 'Evento', icon: <Calendar className="w-4 h-4" /> },
    { value: 'break', label: 'Descanso', icon: <Clock className="w-4 h-4" /> }
  ];

  const reminderTimes = [
    { value: 0, label: 'En el momento' },
    { value: 5, label: '5 minutos antes' },
    { value: 15, label: '15 minutos antes' },
    { value: 30, label: '30 minutos antes' },
    { value: 60, label: '1 hora antes' },
    { value: 120, label: '2 horas antes' },
    { value: 1440, label: '1 día antes' }
  ];

  const reminderTypes = [
    { value: 'notification', label: 'Notificación', icon: <Bell className="w-4 h-4" /> },
    { value: 'alarm', label: 'Alarma', icon: <Volume2 className="w-4 h-4" /> },
    { value: 'vibration', label: 'Vibración', icon: <Smartphone className="w-4 h-4" /> }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {task ? 'Editar Evento' : 'Nuevo Evento'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Título del evento"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de evento
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {eventTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData({ ...formData, type: type.value as any })}
                className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                  formData.type === type.value
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {type.icon}
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Descripción opcional"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              Fecha *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Flag className="w-4 h-4" />
              Prioridad
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              Hora de inicio
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              Hora de fin
            </label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4" />
            Categoría
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Eisenhower Matrix Classification */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Clasificación Eisenhower</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isUrgent}
                onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                className="rounded border-gray-300"
              />
              <div>
                <span className="font-medium text-gray-900">Urgente</span>
                <p className="text-sm text-gray-600">Requiere atención inmediata</p>
              </div>
            </label>
            
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isImportant}
                onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                className="rounded border-gray-300"
              />
              <div>
                <span className="font-medium text-gray-900">Importante</span>
                <p className="text-sm text-gray-600">Contribuye a tus objetivos</p>
              </div>
            </label>
          </div>
          
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Categoría Eisenhower:</strong> {
                formData.isUrgent && formData.isImportant ? 'Hacer Ahora (Urgente e Importante)' :
                !formData.isUrgent && formData.isImportant ? 'Planificar (No Urgente pero Importante)' :
                formData.isUrgent && !formData.isImportant ? 'Delegar (Urgente pero No Importante)' :
                'Eliminar (No Urgente y No Importante)'
              }
            </p>
          </div>
        </div>

        {/* Recordatorios */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Recordatorios</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recordar
              </label>
              <select
                value={formData.reminderTime}
                onChange={(e) => setFormData({ ...formData, reminderTime: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {reminderTimes.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de recordatorio
              </label>
              <div className="grid grid-cols-3 gap-2">
                {reminderTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, reminderType: type.value as any })}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors ${
                      formData.reminderType === type.value
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {type.icon}
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {task ? 'Actualizar' : 'Crear'} Evento
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;