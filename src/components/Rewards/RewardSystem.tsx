import React, { useState, useEffect } from 'react';
import { Star, Trophy, Gift, Zap, Target, MessageCircle, Calendar } from 'lucide-react';

interface RewardSystemProps {
  points: number;
  onPointsUpdate: (newPoints: number) => void;
  lastDailyReward?: Date;
  onDailyRewardUpdate: (date: Date) => void;
}

const RewardSystem: React.FC<RewardSystemProps> = ({ 
  points, 
  onPointsUpdate, 
  lastDailyReward, 
  onDailyRewardUpdate 
}) => {
  const [showReward, setShowReward] = useState(false);
  const [dailyReward, setDailyReward] = useState<string>('');
  const [canClaimDaily, setCanClaimDaily] = useState(false);

  useEffect(() => {
    // Check if user can claim daily reward
    const today = new Date();
    const lastReward = lastDailyReward ? new Date(lastDailyReward) : null;
    
    if (!lastReward || lastReward.toDateString() !== today.toDateString()) {
      setCanClaimDaily(true);
    }
  }, [lastDailyReward]);

  const getLevel = (points: number) => {
    if (points >= 50) return { level: 3, title: 'Experto en Enfoque', color: 'from-purple-500 to-pink-500' };
    if (points >= 30) return { level: 2, title: 'Productivo Avanzado', color: 'from-blue-500 to-cyan-500' };
    if (points >= 15) return { level: 1, title: 'Constante', color: 'from-green-500 to-emerald-500' };
    return { level: 0, title: 'Principiante', color: 'from-gray-400 to-gray-500' };
  };

  const getProgressToNext = (points: number) => {
    if (points < 15) return { current: points, next: 15, percentage: (points / 15) * 100 };
    if (points < 30) return { current: points - 15, next: 15, percentage: ((points - 15) / 15) * 100 };
    if (points < 50) return { current: points - 30, next: 20, percentage: ((points - 30) / 20) * 100 };
    return { current: points - 50, next: 0, percentage: 100 };
  };

  const motivationalMessages = [
    "¡Enhorabuena! 🎉",
    "¡Excelente trabajo! ⭐",
    "Vas por buen camino 🚀",
    "¡Invencible! 💪",
    "Tú puedes 🌟",
    "Lo vas a lograr 🎯",
    "Deja que te ayude 🤝",
    "¡Sigue así! 🔥",
    "Eres increíble 🌈",
    "¡Imparable! ⚡"
  ];

  const dailyRewards = [
    "Hoy has ganado +5 puntos extra.",
    "Consejo del día: Respira profundo y divide tu tarea en partes pequeñas.",
    "Reto del día: Termina una tarea sin mirar el celular."
  ];

  const handleDailyReward = () => {
    if (!canClaimDaily) return;

    const randomReward = dailyRewards[Math.floor(Math.random() * dailyRewards.length)];
    setDailyReward(randomReward);
    setShowReward(true);
    
    if (randomReward.includes('+5 puntos')) {
      onPointsUpdate(points + 5);
    }
    
    onDailyRewardUpdate(new Date());
    setCanClaimDaily(false);
  };

  const currentLevel = getLevel(points);
  const progress = getProgressToNext(points);
  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return (
    <div className="space-y-6">
      {/* Reward Modal */}
      {showReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">¡Recompensa Diaria!</h3>
            <p className="text-gray-700 mb-6">{dailyReward}</p>
            
            <button
              onClick={() => setShowReward(false)}
              className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all"
            >
              ¡Genial!
            </button>
          </div>
        </div>
      )}

      {/* Points and Level Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-r ${currentLevel.color} rounded-full flex items-center justify-center`}>
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{currentLevel.title}</h3>
              <p className="text-sm text-gray-600">Nivel {currentLevel.level}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{points}</div>
            <div className="text-sm text-gray-600">puntos</div>
          </div>
        </div>

        {progress.next > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progreso al siguiente nivel</span>
              <span>{progress.current}/{progress.next}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${currentLevel.color} transition-all duration-500`}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}

        <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <p className="text-blue-800 font-medium">{randomMessage}</p>
        </div>
      </div>

      {/* Daily Reward */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Gift className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recompensa Diaria</h3>
        </div>

        {canClaimDaily ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">¡Gira tu recompensa diaria!</p>
            <button
              onClick={handleDailyReward}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all font-medium"
            >
              🎰 Girar Recompensa
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>Ya reclamaste tu recompensa de hoy</p>
            <p className="text-sm">Vuelve mañana para otra sorpresa</p>
          </div>
        )}
      </div>

      {/* Achievement Milestones */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Logros</h3>
        
        <div className="space-y-3">
          <div className={`flex items-center gap-3 p-3 rounded-lg ${points >= 15 ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <Star className={`w-5 h-5 ${points >= 15 ? 'text-green-600' : 'text-gray-400'}`} />
            <div className="flex-1">
              <span className={`font-medium ${points >= 15 ? 'text-green-900' : 'text-gray-600'}`}>
                Medalla de Constancia
              </span>
              <p className="text-sm text-gray-600">15 puntos</p>
            </div>
            {points >= 15 && <span className="text-green-600">✓</span>}
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-lg ${points >= 30 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
            <Target className={`w-5 h-5 ${points >= 30 ? 'text-blue-600' : 'text-gray-400'}`} />
            <div className="flex-1">
              <span className={`font-medium ${points >= 30 ? 'text-blue-900' : 'text-gray-600'}`}>
                Consejo Exclusivo Desbloqueado
              </span>
              <p className="text-sm text-gray-600">30 puntos</p>
            </div>
            {points >= 30 && <span className="text-blue-600">✓</span>}
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-lg ${points >= 50 ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50 border border-gray-200'}`}>
            <Zap className={`w-5 h-5 ${points >= 50 ? 'text-purple-600' : 'text-gray-400'}`} />
            <div className="flex-1">
              <span className={`font-medium ${points >= 50 ? 'text-purple-900' : 'text-gray-600'}`}>
                Nivel de Enfoque Experto
              </span>
              <p className="text-sm text-gray-600">50 puntos</p>
            </div>
            {points >= 50 && <span className="text-purple-600">✓</span>}
          </div>
        </div>
      </div>

      {/* How to Earn Points */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cómo ganar puntos</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-4 h-4 text-blue-600" />
            <span>+10 puntos por interactuar con el chatbot TIME</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-green-600" />
            <span>+2 puntos por cada día que entras a la app</span>
          </div>
          <div className="flex items-center gap-3">
            <Star className="w-4 h-4 text-yellow-600" />
            <span>+5 puntos por completar tests</span>
          </div>
          <div className="flex items-center gap-3">
            <Gift className="w-4 h-4 text-orange-600" />
            <span>Puntos extra con la recompensa diaria</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardSystem;