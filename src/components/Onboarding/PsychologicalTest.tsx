import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Brain, Target, Lightbulb } from 'lucide-react';

interface PsychologicalTestProps {
  onComplete: (profile: any) => void;
  userName: string;
  onLogin?: () => void;
}

interface TestAnswers {
  [key: string]: string | string[];
}

const PsychologicalTest: React.FC<PsychologicalTestProps> = ({ onComplete, userName, onLogin }) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<TestAnswers>({});
  const totalQuestions = 12;

  const questions = [
    {
      id: 'procrastination_frequency',
      title: '¿Con qué frecuencia pospones tareas importantes?',
      type: 'single',
      options: [
        'Casi nunca',
        'Ocasionalmente',
        'Frecuentemente',
        'Casi siempre'
      ]
    },
    {
      id: 'procrastination_reason',
      title: '¿Cuáles son las principales razones por las que pospones tareas? (Puedes seleccionar varias)',
      type: 'multiple',
      options: [
        'La tarea me parece abrumadora',
        'Temo no hacerlo perfectamente',
        'Me aburre o no me interesa',
        'Me distraigo fácilmente',
        'No sé por dónde empezar',
        'Prefiero hacer otras cosas más divertidas'
      ]
    },
    {
      id: 'attention_span',
      title: '¿Cuánto tiempo puedes mantener la concentración en una tarea?',
      type: 'single',
      options: [
        'Menos de 10 minutos',
        '10-25 minutos',
        '25-45 minutos',
        'Más de 45 minutos'
      ]
    },
    {
      id: 'distraction_triggers',
      title: '¿Qué te distrae más fácilmente? (Puedes seleccionar varias)',
      type: 'multiple',
      options: [
        'Ruidos del entorno',
        'Notificaciones del teléfono',
        'Pensamientos aleatorios',
        'Movimiento visual',
        'Conversaciones cercanas',
        'Sensaciones físicas (hambre, sed, etc.)'
      ]
    },
    {
      id: 'organization_level',
      title: '¿Cómo describirías tu nivel de organización?',
      type: 'single',
      options: [
        'Muy organizado/a - todo tiene su lugar',
        'Moderadamente organizado/a',
        'Algo desorganizado/a',
        'Muy desorganizado/a - pierdo cosas constantemente'
      ]
    },
    {
      id: 'time_perception',
      title: '¿Cómo es tu percepción del tiempo?',
      type: 'single',
      options: [
        'Siempre llego temprano',
        'Generalmente llego a tiempo',
        'A menudo llego tarde',
        'Constantemente subestimo el tiempo que necesito'
      ]
    },
    {
      id: 'task_completion',
      title: '¿Qué pasa cuando empiezas una tarea?',
      type: 'single',
      options: [
        'La termino antes de empezar otra',
        'A veces cambio a otra tarea y regreso después',
        'Frecuentemente empiezo varias tareas a la vez',
        'Rara vez termino lo que empiezo'
      ]
    },
    {
      id: 'emotional_regulation',
      title: '¿Cómo manejas la frustración cuando algo no sale como esperabas?',
      type: 'single',
      options: [
        'Me mantengo calmado/a y busco soluciones',
        'Me molesto un poco pero sigo adelante',
        'Me frustro bastante y necesito un descanso',
        'Me abrumo fácilmente y abandono la tarea'
      ]
    },
    {
      id: 'energy_patterns',
      title: '¿Cuándo tienes más energía mental? (Puedes seleccionar varias)',
      type: 'multiple',
      options: [
        'Temprano en la mañana',
        'Media mañana',
        'Tarde',
        'Noche',
        'Varía constantemente'
      ]
    },
    {
      id: 'decision_making',
      title: '¿Cómo tomas decisiones?',
      type: 'single',
      options: [
        'Analizo todas las opciones cuidadosamente',
        'Tomo decisiones rápidas basadas en intuición',
        'Me cuesta decidir y pido muchas opiniones',
        'Evito tomar decisiones hasta el último momento'
      ]
    },
    {
      id: 'social_situations',
      title: '¿Cómo te comportas en situaciones sociales?',
      type: 'single',
      options: [
        'Escucho atentamente y participo cuando es apropiado',
        'Hablo mucho y a veces interrumpo sin darme cuenta',
        'Me quedo callado/a la mayor parte del tiempo',
        'Me distraigo y pierdo el hilo de las conversaciones'
      ]
    },
    {
      id: 'stress_response',
      title: '¿Cómo respondes al estrés?',
      type: 'single',
      options: [
        'Me organizo mejor y me enfoco más',
        'Busco actividades relajantes',
        'Me paralizo y no sé qué hacer',
        'Me vuelvo hiperactivo/a y hago muchas cosas a la vez'
      ]
    }
  ];

  const updateAnswer = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const toggleMultipleAnswer = (questionId: string, value: string) => {
    const currentAnswers = (answers[questionId] as string[]) || [];
    const newAnswers = currentAnswers.includes(value)
      ? currentAnswers.filter(item => item !== value)
      : [...currentAnswers, value];
    updateAnswer(questionId, newAnswers);
  };

  const canProceed = () => {
    const currentQ = questions[currentQuestion - 1];
    const answer = answers[currentQ.id];
    
    if (currentQ.type === 'multiple') {
      return Array.isArray(answer) && answer.length > 0;
    }
    return answer && answer !== '';
  };

  const handleNext = () => {
    if (currentQuestion === totalQuestions) {
      // Procesar resultados
      const profile = analyzeResults(answers);
      onComplete(profile);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const analyzeResults = (answers: TestAnswers) => {
    // Análisis de tipo de procrastinación
    let procrastinationType = 'Procrastinador Ocasional';
    let adhdIndicators: string[] = [];
    let recommendations: string[] = [];

    // Análisis de procrastinación
    const procrastFreq = answers.procrastination_frequency as string;
    const procrastReasons = answers.procrastination_reason as string[];
    
    if (procrastFreq === 'Casi siempre' || procrastFreq === 'Frecuentemente') {
      if (procrastReasons?.includes('Temo no hacerlo perfectamente')) {
        procrastinationType = 'Perfeccionista';
        recommendations.push('Establece estándares realistas y acepta que "suficientemente bueno" es válido');
        recommendations.push('Usa la técnica de "versión 1.0" - haz una versión básica primero');
        recommendations.push('Establece límites de tiempo para cada tarea para evitar el perfeccionismo excesivo');
      } else if (procrastReasons?.includes('La tarea me parece abrumadora')) {
        procrastinationType = 'Evitador de Tareas Complejas';
        recommendations.push('Divide las tareas grandes en pasos más pequeños y manejables');
        recommendations.push('Usa la técnica Pomodoro para trabajar en bloques cortos');
        recommendations.push('Celebra cada pequeño paso completado para mantener la motivación');
      } else if (procrastReasons?.includes('Me distraigo fácilmente')) {
        procrastinationType = 'Distraído Crónico';
        recommendations.push('Elimina distracciones de tu entorno de trabajo');
        recommendations.push('Considera usar ruidos blancos o música instrumental');
        recommendations.push('Usa aplicaciones de bloqueo para redes sociales durante el trabajo');
      } else if (procrastReasons?.includes('Me aburre o no me interesa')) {
        procrastinationType = 'Buscador de Estimulación';
        recommendations.push('Encuentra formas de hacer las tareas más interesantes o desafiantes');
        recommendations.push('Alterna entre tareas aburridas y estimulantes');
        recommendations.push('Usa recompensas inmediatas para mantener la motivación');
      }
    }

    // Análisis de indicadores de TDAH
    const attentionSpan = answers.attention_span as string;
    const distractions = answers.distraction_triggers as string[];
    const organization = answers.organization_level as string;
    const timePerception = answers.time_perception as string;
    const taskCompletion = answers.task_completion as string;
    const socialBehavior = answers.social_situations as string;
    const energyPatterns = answers.energy_patterns as string[];
    const stressResponse = answers.stress_response as string;

    if (attentionSpan === 'Menos de 10 minutos' || attentionSpan === '10-25 minutos') {
      adhdIndicators.push('Dificultad para mantener la atención');
      recommendations.push('Usa técnicas de trabajo en intervalos cortos (15-20 minutos)');
      recommendations.push('Toma descansos frecuentes para recargar tu atención');
    }

    if (distractions && distractions.length >= 4) {
      adhdIndicators.push('Alta sensibilidad a distracciones');
      recommendations.push('Crea un ambiente de trabajo libre de distracciones');
      recommendations.push('Considera usar auriculares con cancelación de ruido');
      recommendations.push('Prueba diferentes tipos de ruido de fondo (blanco, rosa, marrón)');
    }

    if (organization === 'Muy desorganizado/a - pierdo cosas constantemente') {
      adhdIndicators.push('Dificultades de organización');
      recommendations.push('Implementa sistemas de organización simples y consistentes');
      recommendations.push('Usa recordatorios visuales y listas de verificación');
      recommendations.push('Designa lugares específicos para objetos importantes');
    }

    if (timePerception === 'Constantemente subestimo el tiempo que necesito') {
      adhdIndicators.push('Dificultades con la percepción del tiempo');
      recommendations.push('Usa temporizadores para todas las actividades');
      recommendations.push('Agrega tiempo extra a tus estimaciones iniciales (regla del 50%)');
      recommendations.push('Lleva un registro de cuánto tiempo realmente toman las tareas');
    }

    if (taskCompletion === 'Rara vez termino lo que empiezo' || taskCompletion === 'Frecuentemente empiezo varias tareas a la vez') {
      adhdIndicators.push('Dificultad para completar tareas');
      recommendations.push('Enfócate en una sola tarea a la vez');
      recommendations.push('Celebra los pequeños logros para mantener la motivación');
      recommendations.push('Usa listas de tareas visibles para hacer seguimiento del progreso');
    }

    if (socialBehavior === 'Hablo mucho y a veces interrumpo sin darme cuenta') {
      adhdIndicators.push('Impulsividad en situaciones sociales');
      recommendations.push('Practica técnicas de escucha activa');
      recommendations.push('Usa recordatorios mentales para pausar antes de hablar');
    }

    if (energyPatterns && energyPatterns.includes('Varía constantemente')) {
      adhdIndicators.push('Patrones de energía inconsistentes');
      recommendations.push('Lleva un registro de tus niveles de energía durante el día');
      recommendations.push('Planifica tareas importantes durante tus picos de energía');
    }

    if (stressResponse === 'Me vuelvo hiperactivo/a y hago muchas cosas a la vez') {
      adhdIndicators.push('Hiperactividad bajo estrés');
      recommendations.push('Desarrolla técnicas de manejo del estrés como respiración profunda');
      recommendations.push('Toma descansos regulares para prevenir la acumulación de estrés');
    }

    // Recomendaciones generales basadas en el perfil
    if (adhdIndicators.length >= 3) {
      recommendations.push('Considera consultar con un profesional de la salud mental para una evaluación completa');
      recommendations.push('Los ruidos especializados (blanco, rosa, marrón) pueden ayudar significativamente con la concentración');
      recommendations.push('Establece rutinas consistentes y usa recordatorios externos');
      recommendations.push('Practica la autocompasión - el TDAH es una diferencia neurológica, no un defecto');
    }

    // Recomendaciones adicionales basadas en respuestas específicas
    if (procrastReasons?.includes('No sé por dónde empezar')) {
      recommendations.push('Siempre comienza con el paso más pequeño posible');
      recommendations.push('Usa la regla de los 2 minutos: si algo toma menos de 2 minutos, hazlo inmediatamente');
    }

    // Recomendaciones adicionales
    recommendations.push('Usa la aplicación regularmente para desarrollar hábitos positivos');
    recommendations.push('Experimenta con diferentes técnicas hasta encontrar las que mejor funcionen para ti');
    recommendations.push('Mantén un registro de qué estrategias te funcionan mejor');

    return {
      procrastinationType,
      adhdIndicators,
      recommendations: [...new Set(recommendations)] // Eliminar duplicados
    };
  };

  const currentQ = questions[currentQuestion - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">
              Pregunta {currentQuestion} de {totalQuestions}
            </span>
            <span className="text-sm text-purple-600 font-medium">
              Test Psicológico
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Análisis Personalizado</h2>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-6">{currentQ.title}</h3>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = currentQ.type === 'multiple' 
                ? (answers[currentQ.id] as string[] || []).includes(option)
                : answers[currentQ.id] === option;

              return (
                <button
                  key={index}
                  onClick={() => {
                    if (currentQ.type === 'multiple') {
                      toggleMultipleAnswer(currentQ.id, option);
                    } else {
                      updateAnswer(currentQ.id, option);
                    }
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50 text-purple-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="font-medium flex items-center gap-2">
                        {option}
                        {currentQ.type === 'multiple' && isSelected && (
                          <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {currentQ.type === 'multiple' && (
            <p className="text-sm text-gray-500 mt-3">
              Puedes seleccionar múltiples opciones
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentQuestion === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
              canProceed()
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentQuestion === totalQuestions ? 'Ver Resultados' : 'Siguiente'}
            {currentQuestion !== totalQuestions && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 space-y-3">
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-700">
              <strong>Nota:</strong> Este test es solo orientativo y no constituye un diagnóstico médico. 
              Si tienes preocupaciones sobre TDAH, consulta con un profesional de la salud.
            </p>
          </div>
          
          {currentQuestion === totalQuestions && onLogin && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
              <p className="text-sm text-green-700 mb-2">
                💡 <strong>Recomendación:</strong> Crea una cuenta para guardar tu progreso y acceder desde otros dispositivos.
              </p>
              <button
                onClick={onLogin}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Crear cuenta después del test
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PsychologicalTest;