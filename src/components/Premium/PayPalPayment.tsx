import React, { useEffect, useState } from 'react';
import { Crown, Shield, Star, X } from 'lucide-react';

interface PayPalPaymentProps {
  onSuccess: (details: any) => void;
  onCancel: () => void;
  theme?: 'light' | 'dark';
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({ onSuccess, onCancel, theme = 'light' }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (window.paypal) {
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: theme === 'dark' ? 'silver' : 'blue',
          shape: 'rect',
          label: 'paypal'
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: '4.99'
              },
              description: 'Suscripción Premium TIME\'S UP'
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          const details = await actions.order.capture();
          // Solo llama a onSuccess si el pago está completado
          if (details.status === 'COMPLETED') {
            onSuccess(details);
          } else {
            alert('Pago no completado. Intenta nuevamente.');
            onCancel();
          }
        },
        onCancel: () => {
          onCancel();
        },
        onError: () => {
          alert('Hubo un error con el pago. Intenta nuevamente.');
          onCancel();
        }
      }).render('#paypal-button-container');
    }
  }, [onSuccess, onCancel, theme]);

  const premiumFeatures = [
    'Consultas ilimitadas al Coach TIME',
    'Acceso a 3 minijuegos exclusivos',
    'Biblioteca premium de libros y podcasts',
    'PDFs especializados descargables',
    'Sin anuncios ni limitaciones',
    'Soporte prioritario "Tu voz importa"'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-2xl shadow-xl max-w-md w-full p-8 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h2 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Time's Up Premium</h2>
          </div>
          <button
            onClick={onCancel}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className={`text-4xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>$4.99</div>
          <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Pago único - Acceso de por vida
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <h3 className={`font-semibold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Incluye:</h3>
          {premiumFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>{feature}</span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div id="paypal-button-container" />

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Pago seguro procesado por PayPal</span>
          </div>

          <div className="text-center">
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Al proceder, aceptas nuestros términos de servicio.
              <br />
              Cuenta PayPal: vasquezcoins@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPalPayment;