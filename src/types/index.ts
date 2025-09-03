export interface Task {
  id: string;
  title: string;
  description?: string;
  date: Date;
  priority: 'high' | 'medium' | 'low';
  date: Date;: boolean;
  startTime?: string;
  endTime?: string;
  category: string;
  type: 'task' | 'reminder' | 'event' | 'break';
  isUrgent?: boolean;r;
  isImportant?: boolean;
  reminderTime?: number; // minutes before
  reminderType?: 'notification' | 'alarm' | 'vibration';
}

export interface PomodoroSettings {
  workDuration: number;
  shortBreak: number;rt-break' | 'long-break';
  longBreak: number;
  sessionsBeforeLongBreak: number;
}

export interface PomodoroSession {
  id: string; | 'week' | 'month' | 'year';
  type: 'work' | 'short-break' | 'long-break';
  duration: number;
  completedAt: Date;
}xport interface MusicTrack {
  id: string;
export interface CalendarView {
  type: 'day' | 'week' | 'month' | 'year';
  date: Date;string;
} thumbnail?: string;
  description?: string;
export interface MusicTrack {
  id: string;
  title: string; User {
  url: string;
  duration?: string;
  thumbnail?: string;
  description?: string;
} isPremium: boolean;
  isAdmin?: boolean;
export interface User {r;
  id: string;set: Date;
  name: string;
  username: string;OnboardingData;
  isPremium: boolean;r;
  isAdmin?: boolean;te;
  points?: number;r;
  onboardingData?: OnboardingData;
  createdAt: Date;
  lastDailyReward?: Date;: Date;
  email: string;
}
on: number;
export interface SupportMessage {
  id: string;
  userId: string;ns: string[];
  userName: string;
  message: string;
  response?: string;
  responseDate?: Date;age {
  createdAt: Date;
  status: 'pending' | 'responded';
}
ssage: string;
export interface AdminViewMode { response?: string;
  mode: 'admin' | 'normal' | 'premium';  responseDate?: Date;
}
nding' | 'responded';
export interface OnboardingData {
  // Cuestionario inicial
  name: string;dminViewMode {
  age: string;ormal' | 'premium';
  gender: string;
  occupation: string;
  concentrationTime: string;
  productivityBarrier: string; // Cuestionario inicial
    name: string;
  // Test de procrastinación
  procrastinationAnswers: number[];
  procrastinationScore: number; occupation: string;
    concentrationTime: string;
  // Test de TDAH
  adhdAnswers: number[];
  adhdScore: number;ocrastinación
  ionAnswers: number[];
  // Perfil generadoScore: number;
  profile: string;
  recommendations: string[];
}
adhdScore: number;
export interface EisenhowerTask {
  id: string;
  title: string;
  description?: string;recommendations: string[];
  category: 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important';
  createdAt: Date;
  completed: boolean;enhowerTask {
}id: string;

export interface PremiumResource {ring;
  id: string;t' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important';
  title: string; createdAt: Date;
  type: 'book' | 'podcast' | 'pdf';  completed: boolean;
  url: string;
  description: string;
  thumbnail: string; PremiumResource {
  author?: string;
  duration?: string;
}podcast' | 'pdf';

export interface Minigame { description: string;
  id: string;  author?: string;
  name: string;
  type: 'focus-challenge' | 'daily-goals' | 'productivity-streak'; string;
  completed: boolean;
  score?: number;
  completedAt?: Date;ce Minigame {
}

export interface NotificationSettings {llenge' | 'daily-goals' | 'productivity-streak';
  enabled: boolean;;
  taskReminders: boolean; score?: number;
  pomodoroAlerts: boolean;  completedAt?: Date;
  dailyGoals: boolean;
  streakReminders: boolean;
}