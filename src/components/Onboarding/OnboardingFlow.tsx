import React, { useState } from 'react';
import OnboardingSlide from './OnboardingSlide';
import PsychologicalTest from './PsychologicalTest';
import { Clock, Target, Calendar, Music, Zap, CheckCircle, Bell, Volume2, Brain } from 'lucide-react';

interface OnboardingData {
  name: string;
  mainGoals: string[];
  studyHours: string;
  preferredTimes: string[];
  musicPreferences: string[];
  distractionLevel: string;
  motivationStyles: string[];
  reminderTypes: string[];
  psychologicalProfile?: {
    procrastinationType: string;
    adhdIndicators: string[];
    recommendations: string[];
  };
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
  onLogin: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip, onLogin }) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [showPsychTest, setShowPsychTest] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    mainGoals: [],
    studyHours: '',
    preferredTimes: [],
    musicPreferences: [],
    distractionLevel: '',
    motivationStyles: [],
    reminderTypes: []
  });

  const totalSlides = 6;

  const updateData = (field: keyof OnboardingData, value: string | string[]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field: keyof OnboardingData, value: string) => {
    const currentArray = data[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateData(field, newArray);
  };

  const canProceed = () => {
    switch (currentSlide) {
      case 1: return data.name.trim() !== '';
      case 2: return data.mainGoals.length > 0;
      case 3: return data.studyHours !== '';
      case 4: return data.preferredTimes.length > 0;
      case 5: return data.distractionLevel !== '';
      case 6: return true; // Siempre puede proceder en la última slide
      default: return false;
    }
  };

  const handleNext = () => {
    console.log('handleNext llamado', { currentSlide, totalSlides, canProceed: canProceed() });
    
    if (currentSlide === totalSlides) {
      console.log('Iniciando test psicológico');
      setShowPsychTest(true);
    } else {
      console.log('Avanzando al siguiente slide');
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 1) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleCompleteWithTest = (psychProfile: any) => {
    console.log('Test psicológico completado', psychProfile);
    const finalData = {
      ...data,
      psychologicalProfile: psychProfile
    };
    onComplete(finalData);
  };

  const OptionButton: React.FC<{ 
    value: string; 
    selected: boolean; 
    onClick: () => void; 
    icon?: React.ReactNode;
    description?: string;
    multiSelect?: boolean;
  }> = ({ value, selected, onClick, icon, description, multiSelect }) => (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
        selected
          ? 'border-blue-600 bg-blue-50 text-blue-900'
          : 'border-gray-200 hover:border-gray-300 text-gray-700'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon && <div className="text-blue-600">{icon}</div>}
        <div className="flex-1">
          <div className="font-medium flex items-center gap-2">
            {value}
            {multiSelect && selected && (
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">✓</span>
            )}
          </div>
          {description && <div className="text-sm text-gray-500 mt-1">{description}</div>}
        </div>
      </div>
    </button>
  );

  // Si está en el test psicológico
  if (showPsychTest) {
    console.log('Renderizando test psicológico');
    return (
      <PsychologicalTest
        onComplete={handleCompleteWithTest}
        userName={data.name}
      />
    );
  }

  console.log('Renderizando slide', currentSlide, 'de', totalSlides);

  const renderSlideContent = () => {
    switch (currentSlide) {
      case 1:
        return (
          <OnboardingSlide
            title="¡Bienvenido a Time's Up!"
            subtitle="Te haremos algunas preguntas para conocerte mejor y poder ayudarte de manera personalizada"
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            onNext={handleNext}
            onPrev={handlePrev}
            onSkip={onSkip}
            onLogin={onLogin}
            canProceed={canProceed()}
            isLastSlide={false}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cómo te gustaría que te llamemos?
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => updateData('name', e.target.value)}
                placeholder="Escribe tu nombre"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </OnboardingSlide>
        );

      case 2:
        return (
          <OnboardingSlide
            title="¿Cuáles son tus objetivos principales?"
            subtitle="Puedes seleccionar múltiples opciones"
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            onNext={handleNext}
            onPrev={handlePrev}
            canProceed={canProceed()}
            isLastSlide={false}
          >
            <div className="space-y-3">
              <OptionButton
                value="Mejorar mi concentración"
                selected={data.mainGoals.includes('Mejorar mi concentración')}
                onClick={() => toggleArrayValue('mainGoals', 'Mejorar mi concentración')}
                icon={<Target className="w-5 h-5" />}
                multiSelect={true}
              />
              <OptionButton
                value="Aumentar mi productividad"
                selected={data.mainGoals.includes('Aumentar mi productividad')}
                onClick={() => toggleArrayValue('mainGoals', 'Aumentar mi productividad')}
                icon={<Zap className="w-5 h-5" />}
                multiSelect={true}
              />
              <OptionButton
                value="Organizar mejor mi tiempo"
                selected={data.mainGoals.includes('Organizar mejor mi tiempo')}
                onClick={() => toggleArrayValue('mainGoals', 'Organizar mejor mi tiempo')}
                icon={<Calendar className="w-5 h-5" />}
                multiSelect={true}
              />
              <OptionButton
                value="Crear hábitos de estudio"
                selected={data.mainGoals.includes('Crear hábitos de estudio')}
                onClick={() => toggleArrayValue('mainGoals', 'Crear hábitos de estudio')}
                icon={<CheckCircle className="w-5 h-5" />}
                multiSelect={true}
              />
            </div>
          </OnboardingSlide>
        );

      case 3:
        return (
          <OnboardingSlide
            title="¿Cuántas horas planeas estudiar/trabajar al día?"
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            onNext={handleNext}
            onPrev={handlePrev}
            canProceed={canProceed()}
            isLastSlide={false}
          >
            <div className="space-y-3">
              <OptionButton
                value="1-2 horas"
                selected={data.studyHours === '1-2 horas'}
                onClick={() => updateData('studyHours', '1-2 horas')}
                icon={<Clock className="w-5 h-5" />}
              />
              <OptionButton
                value="3-4 horas"
                selected={data.studyHours === '3-4 horas'}
                onClick={() => updateData('studyHours', '3-4 horas')}
                icon={<Clock className="w-5 h-5" />}
              />
              <OptionButton
                value="5-6 horas"
                selected={data.studyHours === '5-6 horas'}
                onClick={() => updateData('studyHours', '5-6 horas')}
                icon={<Clock className="w-5 h-5" />}
              />
              <OptionButton
                value="Más de 6 horas"
                selected={data.studyHours === 'Más de 6 horas'}
                onClick={() => updateData('studyHours', 'Más de 6 horas')}
                icon={<Clock className="w-5 h-5" />}
              />
            </div>
          </OnboardingSlide>
        );

      case 4:
        return (
          <OnboardingSlide
            title="¿Cuáles son tus horarios preferidos para ser productivo?"
            subtitle="Puedes seleccionar múltiples horarios"
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            onNext={handleNext}
            onPrev={handlePrev}
            canProceed={canProceed()}
            isLastSlide={false}
          >
            <div className="space-y-3">
              <OptionButton
                value="Temprano en la mañana (6:00 - 9:00 AM)"
                selected={data.preferredTimes.includes('Temprano en la mañana (6:00 - 9:00 AM)')}
                onClick={() => toggleArrayValue('preferredTimes', 'Temprano en la mañana (6:00 - 9:00 AM)')}
                multiSelect={true}
              />
              <OptionButton
                value="Mañana (9:00 AM - 12:00 PM)"
                selected={data.preferredTimes.includes('Mañana (9:00 AM - 12:00 PM)')}
                onClick={() => toggleArrayValue('preferredTimes', 'Mañana (9:00 AM - 12:00 PM)')}
                multiSelect={true}
              />
              <OptionButton
                value="Tarde (12:00 - 6:00 PM)"
                selected={data.preferredTimes.includes('Tarde (12:00 - 6:00 PM)')}
                onClick={() => toggleArrayValue('preferredTimes', 'Tarde (12:00 - 6:00 PM)')}
                multiSelect={true}
              />
              <OptionButton
                value="Noche (6:00 PM - 12:00 AM)"
                selected={data.preferredTimes.includes('Noche (6:00 PM - 12:00 AM)')}
                onClick={() => toggleArrayValue('preferredTimes', 'Noche (6:00 PM - 12:00 AM)')}
                multiSelect={true}
              />
            </div>
          </OnboardingSlide>
        );

      case 5:
        return (
          <OnboardingSlide
            title="¿Qué tan fácil te distraes?"
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            onNext={handleNext}
            onPrev={handlePrev}
            canProceed={canProceed()}
            isLastSlide={false}
          >
            <div className="space-y-3">
              <OptionButton
                value="Muy fácil - necesito ayuda constante"
                selected={data.distractionLevel === 'Muy fácil - necesito ayuda constante'}
                onClick={() => updateData('distractionLevel', 'Muy fácil - necesito ayuda constante')}
                description="Recordatorios frecuentes y bloqueo de distracciones"
              />
              <OptionButton
                value="Moderadamente - a veces pierdo el foco"
                selected={data.distractionLevel === 'Moderadamente - a veces pierdo el foco'}
                onClick={() => updateData('distractionLevel', 'Moderadamente - a veces pierdo el foco')}
                description="Recordatorios ocasionales"
              />
              <OptionButton
                value="Poco - generalmente mantengo el foco"
                selected={data.distractionLevel === 'Poco - generalmente mantengo el foco'}
                onClick={() => updateData('distractionLevel', 'Poco - generalmente mantengo el foco')}
                description="Recordatorios mínimos"
              />
              <OptionButton
                value="Nunca - tengo excelente concentración"
                selected={data.distractionLevel === 'Nunca - tengo excelente concentración'}
                onClick={() => updateData('distractionLevel', 'Nunca - tengo excelente concentración')}
                description="Solo seguimiento de progreso"
              />
            </div>
          </OnboardingSlide>
        );

      case 6:
        return (
          <OnboardingSlide
            title={`¡Perfecto, ${data.name}!`}
            subtitle="Ahora realizaremos un test psicológico para personalizar aún más tu experiencia"
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            onNext={handleNext}
            onPrev={handlePrev}
            canProceed={canProceed()}
            isLastSlide={true}
          >
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Resumen de tu configuración:</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div><strong>Objetivos principales:</strong> {data.mainGoals.join(', ')}</div>
                  <div><strong>Horas de estudio/trabajo:</strong> {data.studyHours}</div>
                  <div><strong>Horarios preferidos:</strong> {data.preferredTimes.join(', ')}</div>
                  <div><strong>Nivel de distracción:</strong> {data.distractionLevel}</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">Test Psicológico</h3>
                </div>
                <p className="text-sm text-purple-700 mb-4">
                  A continuación realizarás un breve test para identificar tu tipo de procrastinación y posibles indicadores de TDAH. 
                  Esto nos permitirá darte recomendaciones personalizadas y optimizar la app para tu perfil específico.
                </p>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className="text-xs text-purple-600">
                    ⏱️ <strong>Duración:</strong> 5-7 minutos<br/>
                    🎯 <strong>Objetivo:</strong> Personalizar tu experiencia<br/>
                    🔒 <strong>Privacidad:</strong> Tus datos se guardan solo en tu dispositivo
                  </p>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-800">
                  ✅ <strong>¡Listo para continuar!</strong> Haz clic en "Comenzar Test" para proceder al análisis psicológico.
                </p>
              </div>
              
              <div className="text-center">
                <button
                  onClick={onLogin}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium mr-4"
                >
                  Crear cuenta para guardar progreso
                </button>
                <button
                  onClick={() => onComplete(data)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Continuar sin cuenta
                </button>
              </div>
            </div>
          </OnboardingSlide>
        );

      default:
        return null;
    }
  };

  return renderSlideContent();
};

export default OnboardingFlow;