import React, { useState } from 'react';
import { Plus, Trash2, Edit2, AlertCircle, Clock, Users, X, Calendar } from 'lucide-react';
import { EisenhowerTask, Task } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const EisenhowerMatrix: React.FC = () => {
  const [tasks] = useLocalStorage<Task[]>('tasks', []);
  const [eisenhowerTasks, setEisenhowerTasks] = useState<EisenhowerTask[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<EisenhowerTask | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<EisenhowerTask['category'] | null>(null);

  const categories = {
    'urgent-important': {
      title: 'Hacer Ahora',
      subtitle: 'Urgente e Importante',
      color: 'bg-red-50 border-red-200',
      headerColor: 'bg-red-500',
      icon: <AlertCircle className="w-5 h-5" />,
      description: 'Crisis, emergencias, problemas urgentes'
    },
    'not-urgent-important': {
      title: 'Planificar',
      subtitle: 'No Urgente pero Importante',
      color: 'bg-blue-50 border-blue-200',
      headerColor: 'bg-blue-500',
      icon: <Clock className="w-5 h-5" />,
      description: 'Planificación, desarrollo personal, prevención'
    },
    'urgent-not-important': {
      title: 'Delegar',
      subtitle: 'Urgente pero No Importante',
      color: 'bg-yellow-50 border-yellow-200',
      headerColor: 'bg-yellow-500',
      icon: <Users className="w-5 h-5" />,
      description: 'Interrupciones, algunas llamadas, emails'
    },
    'not-urgent-not-important': {
      title: 'Eliminar',
      subtitle: 'No Urgente y No Importante',
      color: 'bg-gray-50 border-gray-200',
      headerColor: 'bg-gray-500',
      icon: <X className="w-5 h-5" />,
      description: 'Distracciones, redes sociales, TV excesiva'
    }
  };

  const handleAddTask = (category: EisenhowerTask['category']) => {
    setSelectedCategory(category);
    setShowForm(true);
  };

  const handleEditTask = (task: EisenhowerTask) => {
    setEditingTask(task);
    setSelectedCategory(task.category);
    setShowForm(true);
  };

  const handleSubmitTask = (taskData: { title: string; description: string }) => {
    if (editingTask) {
      setEisenhowerTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskData }
          : task
      ));
    } else {
      const newTask: EisenhowerTask = {
        id: Date.now().toString(),
        title: taskData.title,
        description: taskData.description,
        category: selectedCategory!,
        createdAt: new Date(),
        completed: false
      };
      setEisenhowerTasks(prev => [...prev, newTask]);
    }
    setShowForm(false);
    setEditingTask(null);
    setSelectedCategory(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setEisenhowerTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const toggleTaskCompletion = (taskId: string) => {
    setEisenhowerTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getTasksForCategory = (category: EisenhowerTask['category']) => {
    // Combine Eisenhower-specific tasks with calendar tasks
    const eisenhowerCategoryTasks = eisenhowerTasks.filter(task => task.category === category);
    
    const calendarTasks = tasks
      .filter(task => {
        if (category === 'urgent-important') return task.isUrgent && task.isImportant;
        if (category === 'not-urgent-important') return !task.isUrgent && task.isImportant;
        if (category === 'urgent-not-important') return task.isUrgent && !task.isImportant;
        if (category === 'not-urgent-not-important') return !task.isUrgent && !task.isImportant;
        return false;
      })
      .map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        category,
        createdAt: task.date,
        completed: task.completed
      }));
    
    return [...eisenhowerCategoryTasks, ...calendarTasks];
  };

  const TaskForm = () => {
    const [formData, setFormData] = useState({
      title: editingTask?.title || '',
      description: editingTask?.description || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.title.trim()) {
        handleSubmitTask(formData);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Título de la tarea"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Descripción opcional"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingTask(null);
                  setSelectedCategory(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingTask ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Matriz de Eisenhower</h2>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Organiza tus tareas por urgencia e importancia</p>
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Calendar className="w-4 h-4" />
            <span>Conectado con el calendario</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(categories).map(([categoryKey, category]) => {
            const categoryTasks = getTasksForCategory(categoryKey as EisenhowerTask['category']);
            
            return (
              <div key={categoryKey} className={`rounded-xl border-2 ${category.color} min-h-[300px]`}>
                <div className={`${category.headerColor} text-white p-4 rounded-t-lg`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <div>
                        <h3 className="font-semibold">{category.title}</h3>
                        <p className="text-sm opacity-90">{category.subtitle}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddTask(categoryKey as EisenhowerTask['category'])}
                      className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs mt-2 opacity-75">{category.description}</p>
                </div>
                
                <div className="p-4 space-y-3">
                  {categoryTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 bg-white rounded-lg border transition-colors ${
                        task.completed ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => toggleTaskCompletion(task.id)}
                              className="rounded border-gray-300"
                            />
                            <h4 className={`font-medium text-gray-900 ${
                              task.completed ? 'line-through' : ''
                            }`}>
                              {task.title}
                            </h4>
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-600 ml-6">{task.description}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditTask(task)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {categoryTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No hay tareas en esta categoría</p>
                      <button
                        onClick={() => handleAddTask(categoryKey as EisenhowerTask['category'])}
                        className="text-blue-600 hover:text-blue-700 text-sm mt-1"
                      >
                        Agregar primera tarea
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">Cómo usar la Matriz de Eisenhower:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <strong>Hacer Ahora (Rojo):</strong> Tareas que requieren atención inmediata. Minimiza estas situaciones con mejor planificación.
            </div>
            <div>
              <strong>Planificar (Azul):</strong> Lo más importante para tu crecimiento. Dedica la mayor parte de tu tiempo aquí.
            </div>
            <div>
              <strong>Delegar (Amarillo):</strong> Tareas urgentes que otros pueden hacer. Delega o automatiza cuando sea posible.
            </div>
            <div>
              <strong>Eliminar (Gris):</strong> Actividades que no agregan valor. Elimínalas o reduce el tiempo dedicado.
            </div>
          </div>
        </div>
      </div>

      {showForm && <TaskForm />}
    </div>
  );
};

export default EisenhowerMatrix;