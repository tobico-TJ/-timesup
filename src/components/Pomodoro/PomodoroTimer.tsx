import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Settings, Trophy } from 'lucide-react';

interface PomodoroTimerProps {
  timeLeft: number;
  isRunning: boolean;
  currentSession: 'work' | 'short-break' | 'long-break';
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  formatTime: (seconds: number) => string;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  timeLeft,
  isRunning,
  currentSession,
  onStart,
  onPause,
  onReset,
  formatTime
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const maxRounds = 4;

  const getSessionColor = () => {
    switch (currentSession) {
      case 'work': return 'text-red-600';
      case 'short-break': return 'text-green-600';
      case 'long-break': return 'text-blue-600';
    }
  };

  const getSessionLabel = () => {
    switch (currentSession) {
      case 'work': return 'Tiempo de Trabajo';
      case 'short-break': return 'Descanso Corto';
      case 'long-break': return 'Descanso Largo';
    }
  };

  const getProgressColor = () => {
    switch (currentSession) {
      case 'work': return 'stroke-red-600';
      case 'short-break': return 'stroke-green-600';
      case 'long-break': return 'stroke-blue-600';
    }
  };

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = currentSession === 'work' ? 
    ((workDuration * 60 - timeLeft) / (workDuration * 60)) * circumference :
    currentSession === 'short-break' ?
    ((shortBreak * 60 - timeLeft) / (shortBreak * 60)) * circumference :
    ((longBreak * 60 - timeLeft) / (longBreak * 60)) * circumference;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="text-center">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Pomodoro Timer</h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {showSettings && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-gray-900 mb-3">Configuración del Timer</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Trabajo (min)</label>
                <input
                  type="number"
                  value={workDuration}
                  onChange={(e) => setWorkDuration(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  min="1"
                  max="60"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Descanso corto (min)</label>
                <input
                  type="number"
                  value={shortBreak}
                  onChange={(e) => setShortBreak(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  min="1"
                  max="30"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Descanso largo (min)</label>
                <input
                  type="number"
                  value={longBreak}
                  onChange={(e) => setLongBreak(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  min="1"
                  max="60"
                />
              </div>
            </div>
          </div>
        )}

        <p className={`text-lg font-medium mb-4 ${getSessionColor()}`}>
          {getSessionLabel()}
        </p>

        {/* Rounds Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">
              Ronda {currentRound} de {maxRounds}
            </span>
          </div>
          <div className="flex justify-center gap-2">
            {Array.from({ length: maxRounds }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < completedRounds ? 'bg-green-500' : 
                  i === currentRound - 1 ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 256 256">
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              className={`${getProgressColor()} transition-all duration-1000 ease-linear`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-900">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={isRunning ? onPause : onStart}
            className={`flex items-center justify-center w-16 h-16 rounded-full transition-colors ${
              isRunning 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          
          <button
            onClick={onReset}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>Completa 4 rondas para un ciclo completo de Pomodoro</p>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;