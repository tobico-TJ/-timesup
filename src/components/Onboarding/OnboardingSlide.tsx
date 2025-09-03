import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OnboardingSlideProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip?: () => void;
  onLogin?: () => void;
  canProceed: boolean;
  isLastSlide: boolean;
}

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  title,
  subtitle,
  children,
  currentSlide,
  totalSlides,
  onNext,
  onPrev,
  onSkip,
  onLogin,
  canProceed,
  isLastSlide
}) => {
  const handleNextClick = () => {
    console.log('Botón siguiente clickeado', { canProceed, isLastSlide });
    if (canProceed) {
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">
              Paso {currentSlide} de {totalSlides}
            </span>
            {onSkip && (
              <button
                onClick={onSkip}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Omitir configuración
              </button>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && (
            <p className="text-gray-600 mb-6">{subtitle}</p>
          )}
          {children}
        </div>

        {/* Login button for first slide */}
        {currentSlide === 1 && onLogin && (
          <div className="mb-6 text-center">
            <button
              onClick={onLogin}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              ¿Ya tienes una cuenta con nosotros?
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={onPrev}
            disabled={currentSlide === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentSlide === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          <button
            onClick={handleNextClick}
            disabled={!canProceed}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors font-medium ${
              canProceed
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLastSlide ? 'Comenzar Test' : 'Siguiente'}
            {!isLastSlide && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Debug info (solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
            Debug: canProceed={canProceed.toString()}, isLastSlide={isLastSlide.toString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingSlide;