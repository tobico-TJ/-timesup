import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Bot, User, Clock, CheckCircle, AlertCircle, Trash2, Plus, Crown } from 'lucide-react';
import { User as UserType, OnboardingData, Task } from '../../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

interface Reminder {
  id: string;
  task: string;
  time: string;
  date: string;
  completed: boolean;
  createdAt: Date;
}

interface ProductivityChatbotProps {
  currentUser: UserType | null;
  onboardingData: OnboardingData | null;
  tasks: Task[];
  onUpgrade: () => void;
  onPointsEarned: () => void;
}

const ProductivityChatbot: React.FC<ProductivityChatbotProps> = ({ 
  currentUser, 
  onboardingData, 
  tasks, 
  onUpgrade, 
  onPointsEarned 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: getInitialMessage(currentUser, onboardingData, tasks),
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showReminders, setShowReminders] = useState(false);
  const [dailyQueries, setDailyQueries] = useState(0);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  function getInitialMessage(user: UserType | null, data: OnboardingData | null, userTasks: Task[]): string {
    let message = `¡Hola${data?.name ? `, ${data.name}` : ''}! Soy TIME, tu coach personal especializado en TDAH y productividad. 💪\n\n`;
    
    if (data?.profile) {
      message += `He revisado tu perfil: **${data.profile}**\n\n`;
      
      if (data.recommendations && data.recommendations.length > 0) {
        message += `Basándome en tus tests, te recomiendo especialmente:\n`;
        message += `• ${data.recommendations[0]}\n`;
        if (data.recommendations[1]) {
          message += `• ${data.recommendations[1]}\n`;
        }
        message += `\n`;
      }
    }
    
    // Analyze current tasks
    const todayTasks = userTasks.filter(task => {
      const today = new Date();
      const taskDate = new Date(task.date);
      return taskDate.toDateString() === today.toDateString();
    });
    
    if (todayTasks.length > 0) {
      const urgentTasks = todayTasks.filter(task => task.isUrgent);
      const importantTasks = todayTasks.filter(task => task.isImportant);
      
      message += `📅 **Veo que tienes ${todayTasks.length} tarea${todayTasks.length > 1 ? 's' : ''} para hoy:**\n`;
      
      if (urgentTasks.length > 0) {
        message += `⚠️ ${urgentTasks.length} urgente${urgentTasks.length > 1 ? 's' : ''} - ¡Empecemos por ahí!\n`;
      }
      
      if (importantTasks.length > 0) {
        message += `🎯 ${importantTasks.length} importante${importantTasks.length > 1 ? 's' : ''} - No las olvides\n`;
      }
      
      message += `\n`;
    }
    
    message += `🎯 Puedo ayudarte a:\n• Dividir cualquier tarea en pasos de 25 minutos\n• Crear recordatorios que realmente funcionen\n• Analizar tu calendario y optimizar tu día\n• Superar la procrastinación con técnicas personalizadas\n\n`;
    
    if (!user?.id) {
      message += `📝 **Nota:** Estás usando la versión gratuita (5 consultas diarias). Crea una cuenta para guardar tu progreso.\n\n`;
    }
    
    message += `¿En qué tarea específica necesitas ayuda ahora mismo?`;
    
    return message;
  }

  useEffect(() => {
    // Check daily query limit for free users
    if (currentUser && !currentUser.isPremium) {
      const today = new Date().toDateString();
      const lastQueryDate = localStorage.getItem('lastQueryDate');
      const storedQueries = parseInt(localStorage.getItem('dailyQueries') || '0');
      
      if (lastQueryDate === today) {
        setDailyQueries(storedQueries);
      }
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Inicializar Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Inicializar Speech Synthesis
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const getAIResponse = (userMessage: string, context: string[]): string => {
    const lowerMessage = userMessage.toLowerCase();
    const recentContext = context.slice(-3).join(' ').toLowerCase();
    
    // Check if user is asking about calendar or tasks
    if (lowerMessage.includes('calendario') || lowerMessage.includes('horario') || lowerMessage.includes('agenda')) {
      return `Perfecto, veo que quieres organizar tu calendario. Te ayudo a optimizar tu horario:\n\n**Análisis de tu calendario actual:**\n\n📅 **Recomendaciones basadas en tu perfil TDAH:**\n• Programa tareas importantes en tus horas de mayor energía\n• Deja espacios de 15 min entre actividades\n• Agrupa tareas similares en bloques\n• Usa colores para categorizar por urgencia/importancia\n\n🎯 **¿Quieres que te ayude a:**\n• Crear una tarea específica con recordatorio\n• Reorganizar tu horario de hoy\n• Planificar tu semana\n• Configurar recordatorios automáticos\n\n**Dime qué necesitas programar y te ayudo a organizarlo paso a paso.**`;
    }
    
    // Check if user wants to add tasks or reminders
    if (lowerMessage.includes('crear tarea') || lowerMessage.includes('añadir tarea') || lowerMessage.includes('nueva tarea') || lowerMessage.includes('recordatorio')) {
      return `¡Perfecto! Te ayudo a crear una tarea optimizada para tu cerebro TDAH:\n\n**Para crear la tarea perfecta necesito:**\n\n📝 **Información básica:**\n• ¿Cuál es la tarea específica?\n• ¿Para cuándo debe estar lista?\n• ¿Cuánto tiempo estimado necesitas?\n\n🎯 **Clasificación Eisenhower:**\n• ¿Es urgente? (necesita hacerse hoy/mañana)\n• ¿Es importante? (contribuye a tus objetivos principales)\n\n⏰ **Programación TDAH:**\n• ¿A qué hora tienes más energía?\n• ¿Necesitas recordatorios previos?\n• ¿Qué tipo de alerta prefieres?\n\n**Una vez que me des estos datos, crearé la tarea automáticamente en tu calendario con la configuración óptima para tu perfil.**\n\n¿Empezamos? Dime qué tarea quieres crear.`;
    }
    
    // Análisis contextual más sofisticado
    const isFollowUp = recentContext.length > 0;
    const hasTaskMention = lowerMessage.includes('tarea') || lowerMessage.includes('trabajo') || lowerMessage.includes('proyecto') || lowerMessage.includes('estudiar') || lowerMessage.includes('hacer');
    const hasTimeMention = lowerMessage.includes('tiempo') || lowerMessage.includes('hora') || lowerMessage.includes('minuto') || lowerMessage.includes('cuando');
    const hasMotivationNeed = lowerMessage.includes('no puedo') || lowerMessage.includes('difícil') || lowerMessage.includes('imposible') || lowerMessage.includes('no sé') || lowerMessage.includes('ayuda');
    const hasConcentrationIssue = lowerMessage.includes('concentr') || lowerMessage.includes('distrac') || lowerMessage.includes('foco') || lowerMessage.includes('atención');
    
    // Respuestas específicas para tareas de estudio
    if (lowerMessage.includes('estudiar') || lowerMessage.includes('examen') || lowerMessage.includes('materia')) {
      return `Perfecto, vamos a crear tu plan de estudio que funcione con tu cerebro TDAH:\n\n**Plan de Estudio Inmediato:**\n\n🎯 **Paso 1 (5 min):** Organiza tu espacio - solo lo esencial sobre la mesa\n📚 **Paso 2 (20 min):** Lectura activa - subraya y toma notas\n⏰ **Descanso (5 min):** Levántate, camina, bebe agua\n🧠 **Paso 3 (20 min):** Haz resúmenes o mapas mentales\n⏰ **Descanso (15 min):** Snack saludable\n✍️ **Paso 4 (20 min):** Practica con ejercicios o preguntas\n\n**Configuración TDAH:**\n• Teléfono en otra habitación\n• Ruido blanco de fondo (ve a la sección Música)\n• Timer visible para cada bloque\n• Recompensa después de cada sesión\n\n¿Qué materia vas a estudiar? Te ayudo a dividir el contenido específico.`;
    }
    
    // Respuestas para proyectos de trabajo
    if (lowerMessage.includes('trabajo') || lowerMessage.includes('proyecto') || lowerMessage.includes('informe') || lowerMessage.includes('presentación')) {
      return `Entiendo, los proyectos grandes pueden sentirse imposibles. Vamos a dividirlo en pasos que tu cerebro pueda manejar:\n\n**Metodología Anti-Abrumamiento:**\n\n📋 **Paso 1 (15 min):** Brain dump - escribe TODO lo que se te ocurra sobre el proyecto\n🎯 **Paso 2 (10 min):** Identifica el objetivo final específico\n🔍 **Paso 3 (15 min):** Divide en 3-5 tareas principales\n⚡ **Paso 4 (10 min):** Cada tarea principal divídela en pasos de 25 min máximo\n📅 **Paso 5 (10 min):** Asigna fechas realistas (agrega 50% más tiempo)\n\n**Regla de Oro TDAH:** Si un paso te da pereza solo de pensarlo, está muy grande. Divídelo más.\n\n¿Cuál es específicamente tu proyecto? Te ayudo a crear el desglose completo.`;
    }
    
    // Respuestas para problemas de concentración
    if (hasConcentrationIssue) {
      if (lowerMessage.includes('no puedo concentrarme') || lowerMessage.includes('me distraigo')) {
        return `Tu cerebro TDAH necesita condiciones específicas para concentrarse. Vamos a crear tu "zona de enfoque" ahora mismo:\n\n**Plan de Rescate de Concentración (próximos 10 min):**\n\n🧹 **Minuto 1-2:** Despeja tu mesa - solo lo esencial\n📱 **Minuto 3:** Teléfono en modo avión y en otra habitación\n💧 **Minuto 4:** Trae agua y un snack saludable\n🎧 **Minuto 5-6:** Pon ruido blanco o marrón (sección Música de la app)\n⏰ **Minuto 7:** Configura timer de 15 minutos (empezamos corto)\n🎯 **Minuto 8-10:** Define QUÉ vas a hacer exactamente en esos 15 min\n\n**Después del timer:** Descanso obligatorio de 5 minutos, luego otro bloque.\n\n¿Qué tarea específica vas a abordar en tu primer bloque de 15 minutos?`;
      }
      
      if (lowerMessage.includes('ruido') || lowerMessage.includes('música') || lowerMessage.includes('sonido')) {
        return `¡Excelente! El audio correcto puede transformar tu concentración. Aquí está tu guía personalizada:\n\n**Para tu cerebro TDAH:**\n\n🤍 **Ruido Blanco:** Bloquea distracciones externas - perfecto para leer\n🟤 **Ruido Marrón:** Concentración profunda - ideal para escribir o estudiar\n🔵 **Ruido Azul:** Te mantiene alerta - genial para tareas aburridas\n🟣 **Ruido Púrpura:** Balance perfecto - bueno para cualquier tarea\n\n**Para tareas específicas:**\n• Estudiar/leer → Ruido marrón\n• Tareas creativas → Lo-fi hip hop\n• Tareas aburridas → Ruido azul + música energética\n• Trabajo detallado → Ruido blanco\n\n**Ve AHORA a la sección "Música" de la app** - tenemos todos estos ruidos listos para usar.\n\n¿Qué tipo de tarea vas a hacer? Te recomiendo el audio perfecto.`;
      }
    }
    
    // Respuestas para motivación y procrastinación
    if (hasMotivationNeed) {
      if (lowerMessage.includes('no puedo') || lowerMessage.includes('imposible') || lowerMessage.includes('muy difícil')) {
        return `Escúchame bien: tu cerebro TDAH no está roto, solo necesita un enfoque diferente. Vamos a hacer esto juntos:\n\n**Estrategia "Imposible → Posible":**\n\n🎯 **Regla de los 2 minutos:** ¿Hay ALGO relacionado con tu tarea que puedas hacer en 2 minutos? Hazlo AHORA.\n\n🧩 **División extrema:**\n• En lugar de "hacer el proyecto"\n• Prueba "abrir el documento"\n• Luego "escribir una línea"\n• Después "escribir un párrafo"\n\n🎉 **Celebra cada micro-paso:** Tu cerebro TDAH necesita dopamina. Cada pequeña acción ES un logro.\n\n💪 **Mantra TDAH:** "No tengo que hacerlo perfecto, solo tengo que empezar."\n\n¿Cuál es la tarea que sientes imposible? Vamos a dividirla hasta que sea ridículamente fácil empezar.`;
      }
      
      if (lowerMessage.includes('procrastinar') || lowerMessage.includes('postergar') || lowerMessage.includes('dejando para después')) {
        return `La procrastinación con TDAH tiene causas específicas. Identifiquemos la tuya para atacarla directamente:\n\n**Tipos de Procrastinación TDAH:**\n\n😰 **"Es muy abrumador"** → Divide en pasos de 10-15 minutos\n🎯 **"Tiene que ser perfecto"** → Haz una "versión borrador" primero\n😴 **"Es súper aburrido"** → Combina con algo estimulante (música, recompensas)\n🎪 **"Hay cosas más interesantes"** → Elimina distracciones + timer corto\n⏰ **"Tengo mucho tiempo"** → Crea urgencia artificial con deadlines\n\n**Plan Anti-Procrastinación Inmediato:**\n1. Identifica tu tipo (arriba)\n2. Aplica la solución específica\n3. Timer de 15 minutos\n4. Empieza con la parte MÁS FÁCIL\n\n¿Cuál describe mejor por qué estás procrastinando ahora mismo?`;
      }
    }
    
    // Respuestas para recordatorios
    if (lowerMessage.includes('recordatorio') || lowerMessage.includes('recordar') || lowerMessage.includes('no olvid')) {
      const timeMatch = lowerMessage.match(/(\d{1,2}):(\d{2})|(\d{1,2})\s*(am|pm|mañana|tarde|noche)/i);
      const dateMatch = lowerMessage.match(/(hoy|mañana|lunes|martes|miércoles|jueves|viernes|sábado|domingo)/i);
      
      if (timeMatch || dateMatch) {
        return `Perfecto, veo que mencionaste tiempo específico. Los recordatorios son cruciales para el TDAH:\n\n**Tu recordatorio necesita:**\n✅ Tarea específica: [La que mencionaste]\n${timeMatch ? '✅' : '⏰'} Hora: ${timeMatch ? 'Detectada' : '¿A qué hora exacta?'}\n${dateMatch ? '✅' : '📅'} Día: ${dateMatch ? 'Detectado' : '¿Qué día?'}\n\n**Tipos de recordatorio:**\n🔔 **Notificación:** Aparece en pantalla\n📢 **Alarma:** Con sonido fuerte\n📳 **Vibración:** Discreto pero efectivo\n\n**Tip TDAH:** Programa 15 minutos ANTES para "preparación mental".\n\n¿Confirmas los detalles y eliges el tipo de recordatorio?`;
      }
      
      return `Los recordatorios son tu mejor aliado contra el TDAH. Vamos a crear uno que realmente funcione:\n\n**Recordatorio Efectivo TDAH:**\n\n📝 **Sé específico:** "Estudiar matemáticas - capítulo 5" (no solo "estudiar")\n⏰ **Hora exacta:** No "por la tarde" sino "3:30 PM"\n📍 **Contexto:** "Llamar doctor (tel: 123-456, tema: cita)"\n🔔 **Tipo correcto:** Alarma para cosas importantes, notificación para recordatorios suaves\n\n**Fórmula mágica:** [Acción específica] + [Hora exacta] + [Contexto necesario]\n\nEjemplo: "Enviar email a profesor sobre proyecto - 2:00 PM - incluir archivo adjunto"\n\n¿Qué recordatorio necesitas crear? Dame todos los detalles.`;
    }
    
    // Respuestas para manejo del tiempo
    if (hasTimeMention) {
      if (lowerMessage.includes('no tengo tiempo') || lowerMessage.includes('falta tiempo')) {
        return `El tiempo con TDAH es complicado - tu percepción puede estar jugándote una mala pasada:\n\n**Auditoría de Tiempo Real (hazlo ahora):**\n\n📊 **Ejercicio de 1 día:**\n• Anota CADA actividad y su duración real\n• Compara con lo que pensabas que tomaría\n• Identifica "ladrones de tiempo" ocultos (redes sociales, distracciones)\n\n⚡ **Técnicas de Tiempo TDAH:**\n• **Time Boxing:** 25 min trabajo + 5 min descanso\n• **Regla del 50%:** Agrega 50% más tiempo a tus estimaciones\n• **Batch Similar:** Agrupa tareas parecidas\n• **Buffer Time:** Siempre deja 15 min extra entre actividades\n\n🎯 **Pregunta directa:** ¿Cuánto tiempo crees que necesitas para tu tarea más importante hoy?\n\nTe ayudo a calcular el tiempo REAL que necesitas.`;
      }
      
      if (lowerMessage.includes('cuánto tiempo') || lowerMessage.includes('duración')) {
        return `Vamos a calcular el tiempo REAL que necesitas (no el tiempo fantasía que tu cerebro TDAH estima):\n\n**Fórmula TDAH para Tiempo Real:**\n\n1️⃣ **Tu estimación inicial** × 1.5 = Tiempo más realista\n2️⃣ **Divide en bloques** de 25 min máximo\n3️⃣ **Agrega descansos** (5 min cada 25 min)\n4️⃣ **Buffer de imprevistos** (+20% del total)\n\n**Ejemplo práctico:**\n• Tarea: "Escribir ensayo"\n• Tu estimación: 2 horas\n• Cálculo real: 2h × 1.5 = 3h + descansos (30 min) + buffer (45 min) = 4h 15min\n\n**Regla de Oro:** Si subestimas constantemente, multiplica por 2 directamente.\n\n¿Qué tarea específica quieres que calculemos? Te doy el tiempo real que necesitas.`;
      }
    }
    
    // Respuestas contextuales basadas en conversación previa
    if (isFollowUp) {
      if (recentContext.includes('tarea') && (lowerMessage.includes('sí') || lowerMessage.includes('ok') || lowerMessage.includes('dale'))) {
        return `¡Perfecto! Vamos a crear tu plan de acción inmediato:\n\n**Necesito estos datos específicos:**\n1️⃣ **¿Cuál es EXACTAMENTE la tarea?** (sé específico)\n2️⃣ **¿Cuándo debe estar lista?** (fecha y hora)\n3️⃣ **¿Cuánto tiempo tienes HOY?** (bloques disponibles)\n\n**Mientras me respondes, prepara tu espacio:**\n• 📱 Teléfono fuera de alcance\n• 💧 Agua al lado\n• 🎧 Auriculares listos\n• 📝 Papel para notas rápidas\n• ⏰ Timer visible\n\n**Una vez que tengas los datos, te doy el plan paso a paso en bloques de 25 minutos máximo.**\n\n¡Vamos a hacer que esto suceda! 💪`;
      }
      
      if (recentContext.includes('recordatorio') && lowerMessage.includes('sí')) {
        return `¡Excelente! Vamos a crear tu recordatorio anti-TDAH:\n\n**Confirma estos detalles:**\n• ✅ Tarea: [La que mencionaste]\n• ⏰ Hora: [Especifica si falta]\n• 📅 Fecha: [Confirma el día]\n\n**Elige tu tipo de recordatorio:**\n🔔 **Notificación:** Silenciosa, aparece en pantalla\n📢 **Alarma:** Con sonido, imposible de ignorar\n📳 **Vibración:** Discreto pero efectivo\n\n**Bonus TDAH:** ¿Quieres que programe también un recordatorio 15 minutos antes como "preparación mental"?\n\n**Confirma los detalles y el tipo, y lo creo inmediatamente.**`;
      }
    }
    
    // Respuestas para preguntas sobre la app
    if (lowerMessage.includes('app') || lowerMessage.includes('aplicación') || lowerMessage.includes('funciona')) {
      return `Te explico cómo usar Time's Up para maximizar tu productividad con TDAH:\n\n**Tu flujo de trabajo ideal:**\n\n🏠 **Dashboard:** Revisa tu progreso diario (motivación instantánea)\n📅 **Calendario:** Planifica tu semana en bloques realistas\n🍅 **Pomodoro:** Timer especializado para TDAH (25 min + descansos)\n📋 **Eventos:** Crea tareas y recordatorios específicos\n🎵 **Música:** Ruidos especializados para concentración\n🤖 **Coach TIME:** ¡Soy yo! Tu apoyo constante\n📊 **Estadísticas:** Ve tus patrones (qué funciona y qué no)\n\n**Rutina diaria recomendada:**\n1. Revisa Dashboard (2 min)\n2. Planifica en Calendario (5 min)\n3. Pon música de fondo\n4. Usa Pomodoro para trabajar\n5. Consulta conmigo cuando te atasques\n\n¿Qué sección quieres dominar primero?`;
    }
    
    // Respuestas de saludo
    if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('buenas')) {
      const hour = new Date().getHours();
      const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';
      
      return `${greeting}! 👋 Listo para ayudarte a conquistar tu día.\n\n🎯 **¿Qué necesitas lograr hoy?** (sé específico)\n\n**Opciones rápidas:**\n• "Necesito estudiar [materia] pero me distraigo"\n• "Tengo que hacer [proyecto] y no sé por dónde empezar"\n• "No puedo concentrarme en nada"\n• "Necesito recordatorios para [tarea]"\n\n**Tip del día:** Tu cerebro TDAH funciona mejor con objetivos específicos y tiempos definidos. En lugar de "ser más productivo", di "completar el informe en 2 horas".\n\n¿Cuál es tu desafío específico ahora mismo?`;
    }
    
    // Respuestas de agradecimiento
    if (lowerMessage.includes('gracias') || lowerMessage.includes('perfecto') || lowerMessage.includes('excelente')) {
      return `¡Me alegra poder ayudarte! 😊\n\n🌟 **Recuerda siempre:**\n• Tu cerebro TDAH no está roto, solo es diferente\n• Cada pequeño paso cuenta más que la perfección\n• La consistencia vence a la intensidad\n\n💪 **Mantén el impulso:**\n• Celebra cada logro (por pequeño que sea)\n• Usa la app diariamente para crear hábitos\n• Vuelve a consultarme cuando te atasques\n\n¿Hay algo más específico en lo que pueda ayudarte hoy? Estoy aquí para apoyarte en cada paso.`;
    }
    
    // Respuesta por defecto más directa y útil
    return `Entiendo que necesitas ayuda. Para darte la mejor estrategia, necesito saber específicamente qué está pasando:\n\n**Dime exactamente:**\n• ¿Qué tarea necesitas hacer?\n• ¿Qué te está frenando? (distracción, abrumamiento, aburrimiento, etc.)\n• ¿Cuánto tiempo tienes disponible?\n\n**Mientras tanto, estrategias universales TDAH:**\n\n⚡ **Para empezar YA:** Regla de 2 minutos - haz algo relacionado que tome menos de 2 min\n🎯 **Para concentrarte:** Elimina distracciones + timer de 15 min + ruido de fondo\n🧩 **Para no abrumarte:** Divide todo en pasos de 25 min máximo\n📱 **Para recordar:** Crea recordatorios específicos con hora exacta\n\n**Cuéntame tu situación específica y te doy un plan de acción inmediato.** 💪`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Check if user can send message (premium or under daily limit)
    if (!currentUser?.isPremium && dailyQueries >= 5) {
      const limitMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '🚫 **Límite diario alcanzado**\n\nHas usado tus 5 consultas gratuitas de hoy. Upgrade a Premium para consultas ilimitadas y acceso a funciones exclusivas.\n\n✨ **Premium incluye:**\n• Consultas ilimitadas al Coach TIME\n• 3 minijuegos exclusivos\n• Biblioteca de libros y podcasts\n• PDFs especializados\n• Sin anuncios\n\n💡 **Tip:** También puedes crear una cuenta gratuita para guardar tu progreso.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, limitMessage]);
      setInputMessage('');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Increment daily queries for free users
    if (currentUser && !currentUser.isPremium && currentUser.id) {
      const newCount = dailyQueries + 1;
      setDailyQueries(newCount);
      localStorage.setItem('dailyQueries', newCount.toString());
      localStorage.setItem('lastQueryDate', new Date().toDateString());
    } else if (!currentUser?.id) {
      // For users without account, still track queries locally
      const newCount = dailyQueries + 1;
      setDailyQueries(newCount);
      localStorage.setItem('dailyQueries', newCount.toString());
      localStorage.setItem('lastQueryDate', new Date().toDateString());
    }
    
    // Actualizar contexto de conversación
    const newContext = [...conversationContext, inputMessage];
    setConversationContext(newContext.slice(-5)); // Mantener solo los últimos 5 mensajes para contexto
    
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    // Award points for interaction
    onPointsEarned();

    try {
      // Simular un pequeño delay para que parezca más natural
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      const response = getAIResponse(currentMessage, newContext);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Actualizar contexto con la respuesta también
      setConversationContext(prev => [...prev.slice(-4), response]);
      
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Tuve un problema técnico, pero puedo ayudarte igual. 💪\n\n**Plan de emergencia:**\n• Divide tu tarea en pasos de 25 min\n• Elimina distracciones\n• Usa timer + descansos\n• Empieza con la parte más fácil\n\n¿Qué tarea específica necesitas abordar ahora mismo?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakMessage = (text: string) => {
    if (synthRef.current && !isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const addReminder = (task: string, time: string, date: string) => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      task,
      time,
      date,
      completed: false,
      createdAt: new Date()
    };
    setReminders(prev => [...prev, newReminder]);
    
    // Agregar mensaje confirmando el recordatorio
    const confirmMessage: Message = {
      id: (Date.now() + 2).toString(),
      role: 'assistant',
      content: `✅ ¡Recordatorio creado exitosamente!\n\n📋 **Tarea:** ${task}\n📅 **Fecha:** ${date}\n⏰ **Hora:** ${time}\n\n**Tu recordatorio está listo.** Aparecerá en el panel lateral y te notificará a tiempo.\n\n¿Necesitas crear algún otro recordatorio o te ayudo con otra cosa?`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmMessage]);
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Función para crear recordatorio rápido
  const createQuickReminder = () => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const time = oneHourLater.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const date = 'Hoy';
    
    addReminder('Recordatorio rápido - Tomar descanso', time, date);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col max-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Coach TIME</h2>
              <p className="text-sm text-gray-600">Tu coach personal especializado en TDAH</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReminders(!showReminders)}
              className={`p-2 rounded-lg transition-colors relative ${
                showReminders 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Clock className="w-5 h-5" />
              {reminders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {reminders.length}
                </span>
              )}
            </button>
            
            {isSpeaking ? (
              <button
                onClick={stopSpeaking}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <VolumeX className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => speakMessage(messages[messages.length - 1]?.content || '')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={messages.length === 0}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Query limit indicator for free users */}
      {(!currentUser?.isPremium) && (
        <div className="px-6 py-3 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-yellow-800">
              Consultas hoy: {dailyQueries}/5 {!currentUser?.id && '(sin cuenta)'}
            </span>
            <button onClick={onUpgrade} className="text-sm text-yellow-700 hover:text-yellow-900 font-medium">
              Upgrade a Premium
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Chat Area */}
        <div className={`flex flex-col flex-1 ${showReminders ? 'border-r border-gray-200' : ''}`}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                    {message.isVoice && ' 🎤'}
                  </p>
                </div>
                
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
            
            {/* Upgrade prompt for free users near limit */}
            {!currentUser?.isPremium && dailyQueries >= 4 && (
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 mx-4">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-900">¡Casi alcanzas tu límite diario!</span>
                </div>
                <p className="text-sm text-yellow-800">
                  Upgrade a Premium para consultas ilimitadas y funciones exclusivas.
                  {!currentUser?.id && ' También puedes crear una cuenta gratuita para guardar tu progreso.'}
                </p>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Dime qué necesitas lograr hoy..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  disabled={isLoading}
                />
                
                {isListening && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              
              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-3 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                disabled={isLoading}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                💡 Sé específico: "Necesito estudiar matemáticas pero me distraigo" o "Tengo que hacer un informe y no sé por dónde empezar"
              </p>
            </div>
          </div>
        </div>

        {/* Reminders Panel */}
        {showReminders && (
          <div className="w-80 bg-gray-50 p-4 overflow-y-auto flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recordatorios
              </h3>
              <button
                onClick={createQuickReminder}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Crear recordatorio rápido"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {reminders.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-3">
                  No hay recordatorios aún.
                </p>
                <p className="text-gray-400 text-xs">
                  Dile a TIME: "Recuérdame estudiar mañana a las 3pm"
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      reminder.completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className="mt-1"
                      >
                        <CheckCircle className={`w-4 h-4 ${
                          reminder.completed ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          reminder.completed ? 'text-green-800 line-through' : 'text-gray-900'
                        }`}>
                          {reminder.task}
                        </p>
                        <p className="text-xs text-gray-600">
                          {reminder.date} a las {reminder.time}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductivityChatbot;