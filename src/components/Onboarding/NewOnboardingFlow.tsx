import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, User, Brain, Zap, Award, ArrowLeft } from 'lucide-react';
import { OnboardingData } from '../../types';

interface NewOnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
  onBack: () => void;
}

const NewOnboardingFlow: React.FC<NewOnboardingFlowProps> = ({ onComplete, onSkip, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({
    procrastinationAnswers: [],
    adhdAnswers: []
  });

  const totalSteps = 3;

  // Cuestionario inicial
  const initialQuestions = [
    {
      id: 'name',
      title: '¿Cómo te gustaría que te llamemos?',
      type: 'text',
      placeholder: 'Tu nombre o apodo'
    },
    {
      id: 'age',
      title: '¿Cuál es tu edad?',
      type: 'select',
      options: ['12-17', '18-25', '26-35', '36-45', '46-60', '60+']
    },
    {
      id: 'gender',
      title: '¿Cuál es tu género?',
      type: 'select',
      options: ['Hombre', 'Mujer', 'Otro', 'Prefiero no decirlo']
    },
    {
      id: 'occupation',
      title: '¿Cuál es tu ocupación actual?',
      type: 'select',
      options: ['Estudiante', 'Profesional', 'Desempleado', 'Otro']
    },
    {
      id: 'concentrationTime',
      title: '¿En qué momento del día te cuesta más concentrarte?',
      type: 'select',
      options: ['Mañana', 'Tarde', 'Noche', 'Todo el día']
    },
    {
      id: 'productivityBarrier',
      title: '¿Qué sientes que más te impide ser puntual o productivo?',
      type: 'multiple',
      options: [
        'Redes sociales',
        'Falta de motivación',
        'Falta de organización',
        'Problemas de concentración',
        'Cansancio físico o mental'
      ]
    }
  ];

  // Test de procrastinación
  const procrastinationQuestions = [
    'Pospongo tareas desagradables para sentirme mejor por un rato.',
    'Me siento culpable o ansioso por postergar cosas importantes.',
    'Me cuesta comenzar tareas aunque sé que son urgentes.',
    'Dejo tareas hasta último momento porque trabajo mejor con presión.',
    'Suelo llegar tarde a pesar de haberlo planeado.',
    'Subestimo cuánto tiempo me toma hacer las cosas.',
    'No suelo dejar márgenes de tiempo entre actividades, y eso me retrasa.'
  ];

  // Test de TDAH
  const adhdQuestions = [
    'Tengo problemas para terminar los detalles finales de una tarea.',
    'Me cuesta organizar tareas que requieren varios pasos.',
    'Me distraigo fácilmente por estímulos externos.',
    'Evito tareas que exigen concentración sostenida.',
    'Olvido citas, entregas o compromisos importantes.',
    'Me siento inquieto o me muevo mucho cuando debo estar quieto.'
  ];

  const scaleOptions = ['Nunca', 'Rara vez', 'A veces', 'Frecuente', 'Muy frecuente'];

  const updateData = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field: string, value: string) => {
    const currentArray = (data[field as keyof OnboardingData] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateData(field, newArray);
  };

  const updateArrayData = (field: string, index: number, value: number) => {
    setData(prev => {
      const array = [...(prev[field as keyof OnboardingData] as number[] || [])];
      array[index] = value;
      return { ...prev, [field]: array };
    });
  };

  const canProceed = () => {
    if (currentStep === 1) {
      const currentQ = initialQuestions[currentQuestion - 1];
      const answer = data[currentQ.id as keyof OnboardingData];
      if (currentQ.type === 'multiple') {
        return Array.isArray(answer) && answer.length > 0;
      }
      return answer !== undefined && answer !== '';
    }
    if (currentStep === 2) {
      return data.procrastinationAnswers && data.procrastinationAnswers[currentQuestion - 1] !== undefined;
    }
    if (currentStep === 3) {
      return data.adhdAnswers && data.adhdAnswers[currentQuestion - 1] !== undefined;
    }
    return false;
  };

  const handleNext = () => {
    if (currentStep === 1 && currentQuestion < initialQuestions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentStep === 1 && currentQuestion === initialQuestions.length) {
      setCurrentStep(2);
      setCurrentQuestion(1);
    } else if (currentStep === 2 && currentQuestion < procrastinationQuestions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentStep === 2 && currentQuestion === procrastinationQuestions.length) {
      setCurrentStep(3);
      setCurrentQuestion(1);
    } else if (currentStep === 3 && currentQuestion < adhdQuestions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentStep === 3 && currentQuestion === adhdQuestions.length) {
      // Calcular resultados y completar
      const procrastinationScore = (data.procrastinationAnswers || []).reduce((sum, val) => sum + val, 0);
      const adhdScore = (data.adhdAnswers || []).reduce((sum, val) => sum + val, 0);
      
      let profile = '';
      let recommendations: string[] = [];

      // Análisis de procrastinación
      const highProcrastination = (data.procrastinationAnswers || []).filter(score => score >= 4).length >= 4;
      const highADHD = (data.adhdAnswers || []).filter(score => score >= 4).length >= 4;

      if (highProcrastination && highADHD) {
        profile = 'Perfil TDAH con tendencia a la procrastinación';
        recommendations = [
          'Usa técnicas de división de tareas en pasos muy pequeños',
          'Implementa recordatorios visuales y auditivos',
          'Practica la técnica Pomodoro con descansos frecuentes',
          'Considera consultar con un profesional de la salud mental',
          'Usa el modo concentración para eliminar distracciones'
        ];
      } else if (highProcrastination) {
        profile = 'Procrastinador que necesita estructura';
        recommendations = [
          'Establece deadlines artificiales antes de los reales',
          'Usa recompensas inmediatas para motivarte',
          'Divide las tareas grandes en pasos manejables',
          'Elimina distracciones de tu entorno de trabajo'
        ];
      } else if (highADHD) {
        profile = 'Perfil con características de TDAH';
        recommendations = [
          'Usa listas de verificación visuales',
          'Implementa rutinas consistentes',
          'Toma descansos frecuentes para recargar la atención',
          'Considera usar ruidos de fondo para concentrarte'
        ];
      } else {
        profile = 'Perfil equilibrado con oportunidades de mejora';
        recommendations = [
          'Mantén tus buenos hábitos actuales',
          'Experimenta con nuevas técnicas de productividad',
          'Usa la app para optimizar tu rendimiento',
          'Establece metas desafiantes pero alcanzables'
        ];
      }

      const finalData: OnboardingData = {
        ...data as OnboardingData,
        procrastinationScore,
        adhdScore,
        profile,
        recommendations
      };

      onComplete(finalData);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    } else if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      if (currentStep === 2) {
        setCurrentQuestion(initialQuestions.length);
      } else if (currentStep === 3) {
        setCurrentQuestion(procrastinationQuestions.length);
      }
    }
  };

  const getStepInfo = () => {
    switch (currentStep) {
      case 1:
        return {
          title: 'Cuestionario inicial',
          subtitle: 'Datos generales',
          icon: <User className="w-6 h-6" />,
          color: 'from-blue-600 to-blue-700',
          totalQuestions: initialQuestions.length
        };
      case 2:
        return {
          title: 'Test de Procrastinación',
          subtitle: 'Evalúa tus hábitos de postergación',
          icon: <Brain className="w-6 h-6" />,
          color: 'from-purple-600 to-purple-700',
          totalQuestions: procrastinationQuestions.length
        };
      case 3:
        return {
          title: 'Test de TDAH',
          subtitle: 'Basado en ASRS v1.1',
          icon: <Zap className="w-6 h-6" />,
          color: 'from-orange-600 to-orange-700',
          totalQuestions: adhdQuestions.length
        };
      default:
        return { title: '', subtitle: '', icon: null, color: '', totalQuestions: 0 };
    }
  };

  const renderQuestion = () => {
    const stepInfo = getStepInfo();

    if (currentStep === 1) {
      const question = initialQuestions[currentQuestion - 1];
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">{question.title}</h3>
          
          {question.type === 'text' ? (
            <input
              type="text"
              value={data[question.id as keyof OnboardingData] as string || ''}
              onChange={(e) => updateData(question.id, e.target.value)}
              placeholder={question.placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                question.type === 'multiple' ? (
                  <button
                    key={index}
                    onClick={() => toggleArrayValue(question.id, option)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      (data[question.id as keyof OnboardingData] as string[] || []).includes(option)
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {(data[question.id as keyof OnboardingData] as string[] || []).includes(option) && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">✓</span>
                      )}
                    </div>
                  </button>
                ) : (
                  <button
                    key={index}
                    onClick={() => updateData(question.id, option)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      data[question.id as keyof OnboardingData] === option
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                )
              ))}
            </div>
          )}
        </div>
      );
    }

    if (currentStep === 2) {
      const question = procrastinationQuestions[currentQuestion - 1];
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <p className="text-sm text-purple-600 font-medium">Selecciona con qué frecuencia te ocurre cada situación</p>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900">{question}</h3>
          
          <div className="space-y-3">
            {scaleOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => updateArrayData('procrastinationAnswers', currentQuestion - 1, index + 1)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  data.procrastinationAnswers?.[currentQuestion - 1] === index + 1
                    ? 'border-purple-600 bg-purple-50 text-purple-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  <span className="text-sm text-gray-500">{index + 1}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentStep === 3) {
      const question = adhdQuestions[currentQuestion - 1];
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <p className="text-sm text-orange-600 font-medium">¿Con qué frecuencia te sucede lo siguiente?</p>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900">{question}</h3>
          
          <div className="space-y-3">
            {scaleOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => updateArrayData('adhdAnswers', currentQuestion - 1, index + 1)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  data.adhdAnswers?.[currentQuestion - 1] === index + 1
                    ? 'border-orange-600 bg-orange-50 text-orange-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  <span className="text-sm text-gray-500">{index + 1}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={currentStep === 1 && currentQuestion === 1 ? onBack : handlePrev}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {currentStep === 1 && currentQuestion === 1 ? 'Volver' : 'Anterior'}
            </button>
            
            <button
              onClick={onSkip}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Saltar cuestionarios
            </button>
          </div>

          <div className={`flex items-center gap-3 mb-4 p-4 rounded-lg bg-gradient-to-r ${stepInfo.color} text-white`}>
            {stepInfo.icon}
            <div>
              <h2 className="text-xl font-bold">{stepInfo.title}</h2>
              <p className="text-sm opacity-90">{stepInfo.subtitle}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">
              Paso {currentStep} de {totalSteps} - Pregunta {currentQuestion} de {stepInfo.totalQuestions}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 bg-gradient-to-r ${stepInfo.color}`}
              style={{ 
                width: `${((currentStep - 1) * 100 + (currentQuestion / stepInfo.totalQuestions) * 100) / totalSteps}%` 
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          {renderQuestion()}
        </div>

        {/* Navigation */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium ${
              canProceed()
                ? `bg-gradient-to-r ${stepInfo.color} text-white hover:opacity-90`
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentStep === 3 && currentQuestion === adhdQuestions.length ? 'Ver Resultados' : 'Siguiente'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewOnboardingFlow;