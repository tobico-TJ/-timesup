import React, { useState } from 'react';
import { Award, BookOpen, ArrowLeft, ExternalLink } from 'lucide-react';
import { OnboardingData } from '../../types';

interface ProfileResultsProps {
  data: OnboardingData;
  onContinue: () => void;
}

const ProfileResults: React.FC<ProfileResultsProps> = ({ data, onContinue }) => {
  const [showSources, setShowSources] = useState(false);

  const sources = [
    {
      title: "Antshel, K. M., & Barkley, R. A. (2020)",
      description: "Psychosocial interventions in attention deficit hyperactivity disorder",
      url: "https://doi.org/10.1016/j.chc.2020.02.001"
    },
    {
      title: "Barkley, R. A. (1997)",
      description: "ADHD and the nature of self-control",
      publisher: "New York: Guilford Press"
    },
    {
      title: "Conte, J. M., & Jacobs, R. R. (2003)",
      description: "Validity evidence linking employee personality traits to tardiness",
      url: "https://doi.org/10.1111/j.1744-6570.2003.tb00160.x"
    },
    {
      title: "Furnham, A., & Bradley, A. (1997)",
      description: "Music while you work: The differential distraction of background music on cognitive test performance",
      url: "https://doi.org/10.1002/(SICI)1099-0720(199710)11:5<445::AID-ACP472>3.0.CO;2-R"
    },
    {
      title: "Kämpfe, J., Sedlmeier, P., & Renkewitz, F. (2011)",
      description: "The impact of background music on adult listeners: A meta-analysis",
      url: "https://doi.org/10.1177/0305735610376261"
    },
    {
      title: "Sirois, F. M., & Pychyl, T. A. (2013)",
      description: "Procrastination and the priority of short-term mood regulation",
      url: "https://doi.org/10.1111/spc3.12011"
    },
    {
      title: "Steel, P. (2007)",
      description: "The nature of procrastination: A meta‐analytic and theoretical review",
      url: "https://doi.org/10.1037/0033-2909.133.1.65"
    },
    {
      title: "van Eerde, W. (2003)",
      description: "Procrastination at work and time management training",
      url: "https://doi.org/10.1080/00223980309600625"
    }
  ];

  if (showSources) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-8">
          <div className="mb-6">
            <button
              onClick={() => setShowSources(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al perfil
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Preguntas Corroboradas por Expertos</h2>
            </div>
            
            <p className="text-gray-600">
              Nuestros cuestionarios están basados en investigación científica reconocida internacionalmente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {sources.map((source, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                <h3 className="font-semibold text-gray-900 mb-2">{source.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{source.description}</p>
                {source.publisher && (
                  <p className="text-xs text-gray-500 mb-2">{source.publisher}</p>
                )}
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                  >
                    Ver fuente <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Perfil Completado, {data.name}!
          </h2>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tu Perfil:</h3>
            <p className="text-green-800 font-medium text-lg mb-4">{data.profile}</p>
            
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 mb-3">Recomendaciones personalizadas:</h4>
              <ul className="space-y-2">
                {data.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-600 mt-1">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Puntuaciones de tus tests:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Test de Procrastinación:</span>
                <div className="font-bold text-blue-900">{data.procrastinationScore}/35</div>
              </div>
              <div>
                <span className="text-blue-700">Test de TDAH:</span>
                <div className="font-bold text-blue-900">{data.adhdScore}/30</div>
              </div>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all font-medium text-lg mb-4"
          >
            Ir al Menú Principal
          </button>

          <button
            onClick={() => setShowSources(true)}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1 mx-auto"
          >
            <BookOpen className="w-4 h-4" />
            Preguntas corroboradas por expertos
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileResults;