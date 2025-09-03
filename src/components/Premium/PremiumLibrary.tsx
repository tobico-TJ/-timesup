import React, { useState } from 'react';
import { Book, Headphones, FileText, ExternalLink, Search, Filter } from 'lucide-react';
import { PremiumResource } from '../../types';

const PremiumLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'books' | 'podcasts' | 'pdfs'>('books');
  const [searchTerm, setSearchTerm] = useState('');

  const books: PremiumResource[] = [
    {
      id: '1',
      title: 'Atomic Habits',
      author: 'James Clear',
      type: 'book',
      url: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299',
      description: 'Un enfoque revolucionario para crear buenos hábitos y eliminar los malos.',
      thumbnail: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'The Power of Now',
      author: 'Eckhart Tolle',
      type: 'book',
      url: 'https://www.amazon.com/Power-Now-Guide-Spiritual-Enlightenment/dp/1577314808',
      description: 'Guía para la iluminación espiritual y vivir en el presente.',
      thumbnail: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'Deep Work',
      author: 'Cal Newport',
      type: 'book',
      url: 'https://www.amazon.com/Deep-Work-Focused-Success-Distracted/dp/1455586692',
      description: 'Reglas para el éxito enfocado en un mundo distraído.',
      thumbnail: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '4',
      title: 'Getting Things Done',
      author: 'David Allen',
      type: 'book',
      url: 'https://www.amazon.com/Getting-Things-Done-Stress-Free-Productivity/dp/0143126563',
      description: 'El arte de la productividad libre de estrés.',
      thumbnail: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '5',
      title: 'The 7 Habits of Highly Effective People',
      author: 'Stephen Covey',
      type: 'book',
      url: 'https://www.amazon.com/Habits-Highly-Effective-People-Powerful/dp/1982137274',
      description: 'Lecciones poderosas en el cambio personal.',
      thumbnail: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '6',
      title: 'Eat That Frog!',
      author: 'Brian Tracy',
      type: 'book',
      url: 'https://www.amazon.com/Eat-That-Frog-Great-Procrastinating/dp/162656941X',
      description: '21 formas geniales de dejar de procrastinar y hacer más en menos tiempo.',
      thumbnail: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '7',
      title: 'The Procrastination Equation',
      author: 'Piers Steel',
      type: 'book',
      url: 'https://www.amazon.com/Procrastination-Equation-Putting-Things-Getting/dp/0061703621',
      description: 'Cómo dejar de postergar las cosas y empezar a vivir.',
      thumbnail: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '8',
      title: 'The One Thing',
      author: 'Gary Keller',
      type: 'book',
      url: 'https://www.amazon.com/ONE-Thing-Surprisingly-Extraordinary-Results/dp/1885167776',
      description: 'La única cosa sorprendentemente simple detrás de resultados extraordinarios.',
      thumbnail: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '9',
      title: 'Mindset',
      author: 'Carol Dweck',
      type: 'book',
      url: 'https://www.amazon.com/Mindset-Psychology-Carol-S-Dweck/dp/0345472322',
      description: 'La nueva psicología del éxito.',
      thumbnail: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '10',
      title: 'The Compound Effect',
      author: 'Darren Hardy',
      type: 'book',
      url: 'https://www.amazon.com/Compound-Effect-Darren-Hardy/dp/159315724X',
      description: 'Multiplicar tu éxito una decisión simple a la vez.',
      thumbnail: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const podcasts: PremiumResource[] = [
    {
      id: '11',
      title: 'The Tim Ferriss Show',
      type: 'podcast',
      url: 'https://tim.blog/podcast/',
      description: 'Deconstructing world-class performers to find the tools and tactics you can use.',
      duration: 'Episodios de 1-3 horas',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '12',
      title: 'Productivity Game',
      type: 'podcast',
      url: 'https://productivitygame.com/podcast/',
      description: 'Estrategias prácticas para aumentar tu productividad personal.',
      duration: 'Episodios de 20-40 min',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '13',
      title: 'The Focused Life',
      type: 'podcast',
      url: 'https://thefocusedlife.com/podcast/',
      description: 'Cómo vivir una vida más enfocada y productiva.',
      duration: 'Episodios de 15-30 min',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '14',
      title: 'Beyond the To Do List',
      type: 'podcast',
      url: 'https://beyondthetodolist.com/',
      description: 'Entrevistas con expertos en productividad personal.',
      duration: 'Episodios de 30-45 min',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '15',
      title: 'The Procrastination Podcast',
      type: 'podcast',
      url: 'https://procrastinationpodcast.com/',
      description: 'Estrategias para superar la procrastinación y aumentar la motivación.',
      duration: 'Episodios de 25-35 min',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '16',
      title: 'Time Management Ninja',
      type: 'podcast',
      url: 'https://timemanagementninja.com/podcast/',
      description: 'Tips y técnicas para dominar tu tiempo.',
      duration: 'Episodios de 10-20 min',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '17',
      title: 'The ADHD Podcast',
      type: 'podcast',
      url: 'https://takecontroladhd.com/podcast',
      description: 'Estrategias para adultos con TDAH.',
      duration: 'Episodios de 20-40 min',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '18',
      title: 'Cortex',
      type: 'podcast',
      url: 'https://www.relay.fm/cortex',
      description: 'Dos YouTubers discuten sobre trabajo, productividad y tecnología.',
      duration: 'Episodios de 60-90 min',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '19',
      title: 'The Minimalists Podcast',
      type: 'podcast',
      url: 'https://www.theminimalists.com/podcast/',
      description: 'Cómo vivir una vida significativa con menos cosas.',
      duration: 'Episodios de 30-60 min',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '20',
      title: 'Optimal Living Daily',
      type: 'podcast',
      url: 'https://optimallivingdaily.com/',
      description: 'Lecturas diarias de los mejores blogs de desarrollo personal.',
      duration: 'Episodios de 5-15 min',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const pdfs: PremiumResource[] = [
    {
      id: '21',
      title: 'Guía Completa para Vencer la Procrastinación',
      type: 'pdf',
      url: '#',
      description: 'Manual de 50 páginas con técnicas probadas para superar la procrastinación.',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '22',
      title: 'Técnicas de Enfoque para TDAH',
      type: 'pdf',
      url: '#',
      description: 'Estrategias específicas para mejorar la concentración en personas con TDAH.',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '23',
      title: 'Planificador de Productividad Semanal',
      type: 'pdf',
      url: '#',
      description: 'Plantillas imprimibles para organizar tu semana de manera efectiva.',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '24',
      title: 'Matriz de Eisenhower Avanzada',
      type: 'pdf',
      url: '#',
      description: 'Guía detallada para dominar la matriz de Eisenhower con ejemplos prácticos.',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '25',
      title: 'Técnicas de Respiración para el Enfoque',
      type: 'pdf',
      url: '#',
      description: 'Ejercicios de respiración para mejorar la concentración y reducir el estrés.',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '26',
      title: 'Hábitos Matutinos para la Productividad',
      type: 'pdf',
      url: '#',
      description: 'Rutinas matutinas diseñadas para maximizar tu productividad diaria.',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '27',
      title: 'Gestión del Tiempo para Estudiantes',
      type: 'pdf',
      url: '#',
      description: 'Estrategias específicas para estudiantes que luchan con la gestión del tiempo.',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '28',
      title: 'Técnicas de Pomodoro Avanzadas',
      type: 'pdf',
      url: '#',
      description: 'Variaciones y optimizaciones de la técnica Pomodoro para diferentes tipos de trabajo.',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '29',
      title: 'Mindfulness para la Productividad',
      type: 'pdf',
      url: '#',
      description: 'Cómo usar la atención plena para mejorar tu enfoque y productividad.',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '30',
      title: 'Superando la Impuntualidad Crónica',
      type: 'pdf',
      url: '#',
      description: 'Estrategias psicológicas y prácticas para llegar siempre a tiempo.',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const getCurrentResources = () => {
    switch (activeTab) {
      case 'books': return books;
      case 'podcasts': return podcasts;
      case 'pdfs': return pdfs;
      default: return [];
    }
  };

  const filteredResources = getCurrentResources().filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'book': return <Book className="w-5 h-5" />;
      case 'podcast': return <Headphones className="w-5 h-5" />;
      case 'pdf': return <FileText className="w-5 h-5" />;
      default: return null;
    }
  };

  const tabs = [
    { id: 'books', label: 'Libros', icon: <Book className="w-4 h-4" /> },
    { id: 'podcasts', label: 'Podcasts', icon: <Headphones className="w-4 h-4" /> },
    { id: 'pdfs', label: 'PDFs', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Biblioteca Premium</h2>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar recursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  {getIcon(resource.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{resource.title}</h3>
                  {resource.author && (
                    <p className="text-sm text-gray-600">{resource.author}</p>
                  )}
                  {resource.duration && (
                    <p className="text-sm text-gray-600">{resource.duration}</p>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-4 line-clamp-3">{resource.description}</p>
              
              <button
                onClick={() => window.open(resource.url, '_blank')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                {resource.type === 'pdf' ? 'Descargar' : 'Abrir'}
              </button>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No se encontraron recursos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumLibrary;