import React from 'react';
import { Clock, Sparkles, Users } from 'lucide-react';

interface WelcomeScreenProps {
  onFirstTime: () => void;
  onExistingUser: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFirstTime, onExistingUser }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">TIME'S UP</h1>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          ¡Bienvenido a TIME'S UP!
        </h2>
        
        <p className="text-gray-600 mb-8">
          Tu aplicación personalizada para mejorar la productividad, especialmente diseñada para personas con TDAH y desafíos de concentración.
        </p>

        <div className="space-y-4">
          <button
            onClick={onFirstTime}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl hover:from-blue-500 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            Primera vez en TIME'S UP
          </button>

          <button
            onClick={onExistingUser}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
          >
            <Users className="w-5 h-5" />
            ¿Ya tienes una cuenta con nosotros?
          </button>
        </div>

        <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-2">✨ Características principales:</h3>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Coach TIME con IA especializada en TDAH</li>
            <li>• Matriz de Eisenhower integrada</li>
            <li>• Técnica Pomodoro personalizada</li>
            <li>• Sistema de recompensas y puntos</li>
            <li>• Modo concentración avanzado</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;