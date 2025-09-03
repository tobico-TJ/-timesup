import React, { useState, useEffect } from 'react';
import { Send, MessageCircle, Clock, CheckCircle, User } from 'lucide-react';
import { SupportMessage } from '../../types';

interface PremiumSupportProps {
  currentUser: any;
}

const PremiumSupport: React.FC<PremiumSupportProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserMessages();
  }, [currentUser]);

  const loadUserMessages = () => {
    const allMessages = JSON.parse(localStorage.getItem('support_messages') || '[]');
    const userMessages = allMessages.filter((msg: SupportMessage) => msg.userId === currentUser?.id);
    setMessages(userMessages);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    setIsLoading(true);

    const message: SupportMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      message: newMessage,
      createdAt: new Date(),
      status: 'pending'
    };

    // Save to localStorage
    const allMessages = JSON.parse(localStorage.getItem('support_messages') || '[]');
    allMessages.push(message);
    localStorage.setItem('support_messages', JSON.stringify(allMessages));

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setIsLoading(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Tu Voz Importa</h2>
        </div>
        <p className="text-gray-600">Soporte prioritario para usuarios Premium</p>
      </div>

      <div className="p-6">
        {/* Messages History */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No has enviado mensajes aún</p>
              <p className="text-gray-400 text-sm">Envía tu primera pregunta o sugerencia</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="space-y-3">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-xs lg:max-w-md">
                    <div className="bg-blue-600 text-white p-3 rounded-lg">
                      <p className="text-sm">{message.message}</p>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                      {message.status === 'pending' ? (
                        <Clock className="w-3 h-3 text-yellow-500" />
                      ) : (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Admin Response */}
                {message.response && (
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">Equipo TIME'S UP</span>
                      </div>
                      <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                        <p className="text-sm">{message.response}</p>
                      </div>
                      {message.responseDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(message.responseDate)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* New Message Form */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-medium text-gray-900 mb-3">Enviar nuevo mensaje</h3>
          <div className="space-y-4">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu pregunta, sugerencia o comentario..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                Tiempo de respuesta: 24-48 horas
              </p>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Enviar
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">💡 Consejos para obtener mejor ayuda:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Sé específico sobre tu problema o sugerencia</li>
            <li>• Incluye pasos que ya has intentado</li>
            <li>• Menciona tu dispositivo si es un problema técnico</li>
            <li>• Las sugerencias de mejora son siempre bienvenidas</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PremiumSupport;