import { useState, useEffect, useRef } from 'react';
import { PomodoroSettings, PomodoroSession } from '../types';

export function usePomodoro(settings: PomodoroSettings) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [currentSession, setCurrentSession] = useState<'work' | 'short-break' | 'long-break'>('work');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    const session: PomodoroSession = {
      id: Date.now().toString(),
      type: currentSession,
      duration: getCurrentSessionDuration(),
      completedAt: new Date()
    };

    setSessions(prev => [...prev, session]);

    if (currentSession === 'work') {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      
      if (newCompletedSessions % settings.sessionsBeforeLongBreak === 0) {
        setCurrentSession('long-break');
        setTimeLeft(settings.longBreak * 60);
      } else {
        setCurrentSession('short-break');
        setTimeLeft(settings.shortBreak * 60);
      }
    } else {
      setCurrentSession('work');
      setTimeLeft(settings.workDuration * 60);
    }

    setIsRunning(false);
  };

  const getCurrentSessionDuration = () => {
    switch (currentSession) {
      case 'work': return settings.workDuration;
      case 'short-break': return settings.shortBreak;
      case 'long-break': return settings.longBreak;
    }
  };

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setCurrentSession('work');
    setTimeLeft(settings.workDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    isRunning,
    timeLeft,
    currentSession,
    completedSessions,
    sessions,
    start,
    pause,
    reset,
    formatTime
  };
}