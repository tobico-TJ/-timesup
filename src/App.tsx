import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useLocalStorage } from './hooks/useLocalStorage';
import { usePomodoro } from './hooks/usePomodoro';
import { Task, PomodoroSettings, CalendarView, User, OnboardingData, AdminViewMode } from './types';

// New Onboarding Components
import WelcomeScreen from './components/Onboarding/WelcomeScreen';
import NewOnboardingFlow from './components/Onboarding/NewOnboardingFlow';
import ProfileResults from './components/Onboarding/ProfileResults';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';

// Layout Components
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import NotificationPanel from './components/Layout/NotificationPanel';

// Dashboard Components
import QuickStats from './components/Dashboard/QuickStats';
import TodayTasks from './components/Dashboard/TodayTasks';

// Pomodoro Components
import PomodoroTimer from './components/Pomodoro/PomodoroTimer';
import PomodoroStats from './components/Pomodoro/PomodoroStats';

// Calendar Components
import CalendarViewComponent from './components/Calendar/CalendarView';

// Task Components
import TaskList from './components/Tasks/TaskList';

// Music Components
import MusicPlayer from './components/Music/MusicPlayer';

// Stats Components
import ProductivityStats from './components/Stats/ProductivityStats';

// Premium Components
import PayPalPayment from './components/Premium/PayPalPayment';
import PremiumLibrary from './components/Premium/PremiumLibrary';
import Minigames from './components/Premium/Minigames';
import PremiumSupport from './components/Premium/PremiumSupport';

// Eisenhower Matrix
import EisenhowerMatrix from './components/Eisenhower/EisenhowerMatrix';

// Focus Mode
import ConcentrationMode from './components/Focus/ConcentrationMode';

// Rewards
import RewardSystem from './components/Rewards/RewardSystem';

// Chatbot Components
import ProductivityChatbot from './components/Chatbot/ProductivityChatbot';

// Admin Components
import AdminPanel from './components/Admin/AdminPanel';

const App: React.FC = () => {
  // App state
  const [showWelcome, setShowWelcome] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProfileResults, setShowProfileResults] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(() => {
    return localStorage.getItem('onboarding_completed') === 'true';
  });
  
  const [activeView, setActiveView] = useState('dashboard');
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [showPayment, setShowPayment] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [concentrationMode, setConcentrationMode] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [lastDailyReward, setLastDailyReward] = useState<Date | undefined>();
  const [adminViewMode, setAdminViewMode] = useState<AdminViewMode['mode']>('admin');
  
  const [calendarView, setCalendarView] = useState<CalendarView>({
    type: 'month',
    date: new Date()
  });
  
  const auth = useAuth();
  
  // Check if current user should see premium features based on admin view mode
  const shouldShowPremiumFeatures = () => {
    if (auth.currentUser?.isAdmin) {
      return adminViewMode === 'premium' || adminViewMode === 'admin';
    }
    return auth.currentUser?.isPremium;
  };

  // Check if current user should see admin features
  const shouldShowAdminFeatures = () => {
    return auth.currentUser?.isAdmin && adminViewMode === 'admin';
  };
  // Load onboarding data
  useEffect(() => {
    const completed = localStorage.getItem('onboarding_completed');
    const data = localStorage.getItem('onboarding_data');
    
    if (completed === 'true') {
      setIsOnboardingComplete(true);
      if (data) {
        setOnboardingData(JSON.parse(data));
      }
    }
  }, []);

  // Load user points and rewards
  useEffect(() => {
    if (auth.currentUser) {
      setUserPoints(auth.currentUser.points || 0);
      setLastDailyReward(auth.currentUser.lastDailyReward);
    } else {
      // For users without account, use localStorage
      const points = parseInt(localStorage.getItem('user_points') || '0');
      const lastReward = localStorage.getItem('last_daily_reward');
      setUserPoints(points);
      if (lastReward) {
        setLastDailyReward(new Date(lastReward));
      }
    }
  }, [auth.currentUser]);

  // Award daily points
  useEffect(() => {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('last_visit_date');
    
    if (lastVisit !== today && isOnboardingComplete) {
      // Award 2 points for daily visit
      const newPoints = userPoints + 2;
      handlePointsUpdate(newPoints);
      localStorage.setItem('last_visit_date', today);
    }
  }, [isOnboardingComplete, userPoints]);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Configuración de Pomodoro por defecto
  const pomodoroSettings: PomodoroSettings = {
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsBeforeLongBreak: 4
  };

  const pomodoro = usePomodoro(pomodoroSettings);

  // Handle onboarding completion
  const handleOnboardingComplete = (data: OnboardingData) => {
    setOnboardingData(data);
    setShowOnboarding(false);
    setShowProfileResults(true);
    
    // Award points for completing tests
    const newPoints = userPoints + 10; // 5 for each test
    handlePointsUpdate(newPoints);
    
    // Save to localStorage
    localStorage.setItem('onboarding_data', JSON.stringify(data));
  };

  const handleProfileResultsContinue = () => {
    setShowProfileResults(false);
    setIsOnboardingComplete(true);
    localStorage.setItem('onboarding_completed', 'true');
  };

  const handleSkipOnboarding = () => {
    setShowOnboarding(false);
    setIsOnboardingComplete(true);
    localStorage.setItem('onboarding_completed', 'true');
  };

  const handlePointsUpdate = (newPoints: number) => {
    setUserPoints(newPoints);
    
    if (auth.currentUser) {
      auth.updateUser({ points: newPoints });
    } else {
      localStorage.setItem('user_points', newPoints.toString());
    }
  };

  const handleDailyRewardUpdate = (date: Date) => {
    setLastDailyReward(date);
    
    if (auth.currentUser) {
      auth.updateUser({ lastDailyReward: date });
    } else {
      localStorage.setItem('last_daily_reward', date.toISOString());
    }
  };

  // Handle auth
  const handleLogin = (username: string, password: string) => {
    const success = auth.login(username, password);
    if (success) {
      setAuthMode(null);
      // Force re-render to show main app
      setActiveView('dashboard');
    }
    return success;
  };

  const handleRegister = (username: string, password: string, name: string) => {
    const success = auth.register(username, password, name);
    if (success) {
      setAuthMode(null);
      // Force re-render to show main app
      setActiveView('dashboard');
    }
    return success;
  };

  const handleAuthSuccess = () => {
    setAuthMode(null);
  };

  // Show auth forms
  if (authMode === 'login') {
    return <LoginForm onLogin={handleLogin} onBack={() => {
      setAuthMode(null);
      setShowWelcome(true);
    }} onRegister={() => setAuthMode('register')} />;
  }
  if (authMode === 'register') {
    return <RegisterForm onRegister={handleRegister} onBack={() => {
      setAuthMode(null);
      setShowWelcome(true);
    }} onLogin={() => setAuthMode('login')} />;
  }

  // Show welcome screen first
  if (showWelcome && !isOnboardingComplete && !auth.currentUser) {
    return (
      <WelcomeScreen
        onFirstTime={() => {
          setShowWelcome(false);
          setShowOnboarding(true);
        }}
        onExistingUser={() => {
          setShowWelcome(false);
          setAuthMode('login');
        }}
      />
    );
  }

  // Show new onboarding flow
  if (showOnboarding) {
    return (
      <NewOnboardingFlow
        onComplete={handleOnboardingComplete}
        onSkip={handleSkipOnboarding}
        onBack={() => {
          setShowOnboarding(false);
          setShowWelcome(true);
        }}
      />
    );
  }

  // Show profile results
  if (showProfileResults && onboardingData) {
    return (
      <ProfileResults
        data={onboardingData}
        onContinue={handleProfileResultsContinue}
      />
    );
  }

  // Task management functions
  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString()
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Calculate stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const focusTime = pomodoro.sessions
    .filter(session => session.type === 'work')
    .reduce((total, session) => total + session.duration, 0);
    
  // Mock task reminders for notifications
  const taskReminders = [
    { id: '1', title: 'Reunión de equipo', time: '14:00', type: 'task' as const },
    { id: '2', title: 'Sesión Pomodoro', time: '15:30', type: 'pomodoro' as const },
  ];

  const handleUpgradeClick = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentDetails?: any) => {
    // Verifica que paymentDetails tenga el estado 'COMPLETED' (o el equivalente de PayPal)
    if (paymentDetails && paymentDetails.status === 'COMPLETED') {
      auth.upgradeToPremium();
      setShowPayment(false);
    } else {
      // Opcional: muestra mensaje de error si el pago no fue exitoso
      alert('El pago no fue confirmado. Por favor, intenta de nuevo.');
      setShowPayment(false);
    }
  };

  const handleViewChange = (view: string) => {
    if (view === 'upgrade') {
      setShowPayment(true);
      // Keep the current view or set to a default view
      return;
    }
    if (view === 'login') {
      setAuthMode('login');
      return;
    }
    setActiveView(view);
    // Ensure payment modal is closed when switching to other views
    if (showPayment) {
      setShowPayment(false);
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'admin':
        if (shouldShowAdminFeatures()) {
          return (
            <AdminPanel 
              currentUser={auth.currentUser!} 
              onViewModeChange={setAdminViewMode}
              currentViewMode={adminViewMode}
            />
          );
        }
        return <div>Acceso denegado</div>;

      case 'dashboard':
        return (
          <div className="space-y-6">
            {(onboardingData || auth.currentUser?.onboardingData) && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  ¡Hola, {onboardingData?.name || auth.currentUser?.name}! 👋
                  {!auth.currentUser && (
                    <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Sin cuenta
                    </span>
                  )}
                  {auth.currentUser?.isAdmin && (
                    <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </h2>
                <p className="text-gray-700">
                  Objetivos: <span className="font-medium">{(onboardingData || auth.currentUser?.onboardingData)?.mainGoals?.join(', ')}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Horarios preferidos: {(onboardingData || auth.currentUser?.onboardingData)?.preferredTimes?.join(', ')}
                </p>
                {(onboardingData || auth.currentUser?.onboardingData)?.psychologicalProfile && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-800">
                      <strong>Perfil:</strong> {(onboardingData || auth.currentUser?.onboardingData)?.psychologicalProfile?.procrastinationType}
                    </p>
                    {(onboardingData || auth.currentUser?.onboardingData)?.psychologicalProfile?.adhdIndicators?.length > 0 && (
                      <p className="text-xs text-purple-600 mt-1">
                        Indicadores detectados: {(onboardingData || auth.currentUser?.onboardingData)?.psychologicalProfile?.adhdIndicators?.length}
                      </p>
                    )}
                  </div>
                )}
                {!auth.currentUser && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      💡 <strong>Tip:</strong> Crea una cuenta para guardar tu progreso y acceder desde otros dispositivos.
                      <button
                        onClick={() => setAuthMode('register')}
                        className="ml-2 text-yellow-900 underline hover:no-underline"
                      >
                        Crear cuenta
                      </button>
                    </p>
                  </div>
                )}
              </div>
            )}
            <QuickStats
              completedTasks={completedTasks}
              totalTasks={totalTasks}
              pomodoroSessions={pomodoro.completedSessions}
              focusTime={focusTime}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TodayTasks tasks={tasks} onToggleTask={handleToggleTask} />
              <div className="space-y-6">
                <PomodoroStats 
                  sessions={pomodoro.sessions} 
                  completedSessions={pomodoro.completedSessions} 
                />
              </div>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <CalendarViewComponent
            view={calendarView}
            onViewChange={setCalendarView}
            tasks={tasks}
          />
        );

      case 'eisenhower':
        return <EisenhowerMatrix />;

      case 'minigames':
        return shouldShowPremiumFeatures() ? <Minigames /> : <div>Acceso Premium requerido</div>;

      case 'library':
        return shouldShowPremiumFeatures() ? <PremiumLibrary /> : <div>Acceso Premium requerido</div>;

      case 'support':
        return shouldShowPremiumFeatures() ? <PremiumSupport currentUser={auth.currentUser} /> : <div>Acceso Premium requerido</div>;
      case 'pomodoro':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PomodoroTimer
              timeLeft={pomodoro.timeLeft}
              isRunning={pomodoro.isRunning}
              currentSession={pomodoro.currentSession}
              onStart={pomodoro.start}
              onPause={pomodoro.pause}
              onReset={pomodoro.reset}
              formatTime={pomodoro.formatTime}
            />
            <PomodoroStats 
              sessions={pomodoro.sessions} 
              completedSessions={pomodoro.completedSessions} 
            />
          </div>
        );

      case 'tasks':
        return (
          <TaskList
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
          />
        );

      case 'chatbot':
        return (
          <ProductivityChatbot 
            currentUser={auth.currentUser || { isPremium: shouldShowPremiumFeatures(), chatbotQueries: 0 } as any}
            onboardingData={onboardingData}
            tasks={tasks}
            onUpgrade={handleUpgradeClick}
            onPointsEarned={() => {
              const newPoints = userPoints + 10;
              handlePointsUpdate(newPoints);
            }}
          />
        );

      case 'music':
        return <MusicPlayer />;

      case 'stats':
        return (
          <ProductivityStats 
            tasks={tasks} 
            pomodoroSessions={pomodoro.sessions} 
          />
        );

      case 'concentration':
        return (
          <ConcentrationMode
            isActive={concentrationMode}
            onToggle={() => setConcentrationMode(!concentrationMode)}
          />
        );

      case 'rewards':
        return (
          <RewardSystem
            points={userPoints}
            onPointsUpdate={handlePointsUpdate}
            lastDailyReward={lastDailyReward}
            onDailyRewardUpdate={handleDailyRewardUpdate}
          />
        );

      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración</h2>
            
            <div className="space-y-6">
              {/* Perfil */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Perfil</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {auth.currentUser?.name || onboardingData?.name || 'Usuario'} 
                        <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {userPoints} puntos
                        </span>
                        {!auth.currentUser && (
                          <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            Sin cuenta
                          </span>
                        )}
                        {auth.currentUser?.isPremium && (
                          <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            Premium
                          </span>
                        )}
                        {auth.currentUser?.isAdmin && (
                          <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            Admin
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        Configuración personalizada completada
                      </p>
                      {onboardingData?.profile && (
                        <p className="text-xs text-purple-600 mt-1">
                          Perfil: {onboardingData.profile}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!auth.currentUser && (
                        <button
                          onClick={() => setAuthMode('register')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Crear cuenta
                        </button>
                      )}
                      <button
                        onClick={() => {
                          localStorage.removeItem('onboarding_completed');
                          localStorage.removeItem('onboarding_data');
                          setIsOnboardingComplete(false);
                          setOnboardingData(null);
                          setShowWelcome(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Reconfigurar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recomendaciones personalizadas */}
              {onboardingData?.recommendations && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Recomendaciones Personalizadas</h3>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <ul className="space-y-2">
                      {onboardingData.recommendations.slice(0, 3).map((rec, index) => (
                        <li key={index} className="text-sm text-purple-800 flex items-start gap-2">
                          <span className="text-purple-600 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Notificaciones */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Notificaciones</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-gray-700">Recordatorios de tareas</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-gray-700">Notificaciones de Pomodoro</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-gray-700">Resumen diario</span>
                  </label>
                </div>
              </div>

              {/* Tema */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Apariencia</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="theme" 
                      className="border-gray-300" 
                      checked={theme === 'light'}
                      onChange={() => toggleTheme('light')}
                    />
                    <span className="text-gray-700">Tema claro</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="theme" 
                      className="border-gray-300"
                      checked={theme === 'dark'}
                      onChange={() => toggleTheme('dark')}
                    />
                    <span className="text-gray-700">Tema oscuro</span>
                  </label>
                </div>
              </div>

              {/* Datos */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Datos</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    Exportar datos
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    Importar datos
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                    Borrar todos los datos
                  </button>
                </div>
              </div>
              
              {/* Logout */}
              {auth.currentUser && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Cuenta</h3>
                  <button 
                    onClick={auth.logout}
                    className="w-full text-left px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'dark' : ''} ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar 
        activeView={activeView} 
        onViewChange={handleViewChange} 
        currentUser={auth.currentUser}
        shouldShowPremiumFeatures={shouldShowPremiumFeatures()}
        shouldShowAdminFeatures={shouldShowAdminFeatures()}
        theme={theme}
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          currentUser={auth.currentUser}
          onNotificationClick={() => setShowNotifications(true)}
          onUserClick={() => setActiveView('settings')}
          notificationCount={taskReminders.length}
          theme={theme}
        />
        
        <main className={`flex-1 p-6 ${theme === 'dark' ? 'bg-gray-900' : ''}`}>
          {renderContent()}
        </main>
      </div>
      
      {showPayment && (
        <PayPalPayment 
          onSuccess={handlePaymentSuccess} 
          onCancel={() => setShowPayment(false)} 
          theme={theme} 
        />
      )}
      <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} taskReminders={taskReminders} />
    </div>
  );
};

export default App;