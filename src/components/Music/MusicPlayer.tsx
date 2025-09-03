import React, { useState } from 'react';
import { Play, Pause, Volume2, ExternalLink, Info } from 'lucide-react';
import { studyPlaylists } from '../../data/musicPlaylists';
import { MusicTrack } from '../../types';

const MusicPlayer: React.FC = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState('lofi');
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const playlists = {
    lofi: 'Lo-fi Hip Hop',
    classical: 'Música Clásica',
    ambient: 'Sonidos Ambientales',
    'adhd-noise': 'Ruidos (TDAH)'
  };

  const playlistDescriptions = {
    lofi: 'Música relajante perfecta para estudiar y trabajar',
    classical: 'Composiciones clásicas que estimulan la concentración',
    ambient: 'Sonidos del entorno para crear atmósferas de trabajo',
    'adhd-noise': 'Ruidos especializados para mejorar la concentración y reducir distracciones'
  };

  const noiseDescriptions = {
    'Ruido Blanco': 'Contiene todas las frecuencias audibles en igual intensidad. Ideal para bloquear distracciones externas y mejorar la concentración general.',
    'Ruido Rosa': 'Frecuencias más bajas que el blanco, más suave y natural. Perfecto para relajación, meditación y mejorar la calidad del sueño.',
    'Ruido Marrón (Rojo)': 'Frecuencias aún más profundas, muy efectivo para personas con TDAH. Excelente para concentración profunda y estudio intensivo.',
    'Ruido Azul': 'Frecuencias más altas que estimulan la actividad mental. Ayuda a mantener la alerta y combatir la fatiga cognitiva.',
    'Ruido Púrpura': 'Combinación equilibrada de diferentes frecuencias. Proporciona balance cognitivo y es ideal para tareas que requieren creatividad.'
  };

  const handleTrackSelect = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
    }
  };

  const handleOpenYouTube = (url: string) => {
    window.open(url, '_blank');
  };

  const getNoiseTypeFromTitle = (title: string): string => {
    if (title.includes('Blanco')) return 'Ruido Blanco';
    if (title.includes('Rosa')) return 'Ruido Rosa';
    if (title.includes('Marrón') || title.includes('Rojo')) return 'Ruido Marrón (Rojo)';
    if (title.includes('Azul')) return 'Ruido Azul';
    if (title.includes('Púrpura')) return 'Ruido Púrpura';
    return '';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Música para Estudiar</h2>
          {selectedPlaylist === 'adhd-noise' && (
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2 mb-4 flex-wrap">
          {Object.entries(playlists).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedPlaylist(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPlaylist === key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-600">
          {playlistDescriptions[selectedPlaylist as keyof typeof playlistDescriptions]}
        </p>

        {/* Información sobre ruidos TDAH */}
        {selectedPlaylist === 'adhd-noise' && showInfo && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-3">Guía de Ruidos para TDAH</h3>
            <div className="space-y-3 text-sm">
              {Object.entries(noiseDescriptions).map(([noise, description]) => (
                <div key={noise}>
                  <strong className="text-blue-800">{noise}:</strong>
                  <p className="text-blue-700 mt-1">{description}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-white rounded border border-blue-200">
              <p className="text-xs text-blue-600">
                💡 <strong>Tip:</strong> Experimenta con diferentes tipos para encontrar el que mejor funcione para tu tipo de concentración y actividad.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Current Track Player */}
        {currentTrack && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4">
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{currentTrack.title}</h3>
                <p className="text-sm text-gray-600">{currentTrack.duration}</p>
                {currentTrack.description && (
                  <p className="text-xs text-gray-500 mt-1">{currentTrack.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayPause}
                  className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => handleOpenYouTube(currentTrack.url)}
                  className="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Simulated progress bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: isPlaying ? '30%' : '0%' }}
                />
              </div>
            </div>

            {/* Información específica para ruidos TDAH */}
            {selectedPlaylist === 'adhd-noise' && (
              <div className="mt-3 p-2 bg-white rounded border border-blue-200">
                <div className="text-xs text-blue-700">
                  <strong>Tipo:</strong> {getNoiseTypeFromTitle(currentTrack.title)}
                </div>
                {noiseDescriptions[getNoiseTypeFromTitle(currentTrack.title) as keyof typeof noiseDescriptions] && (
                  <div className="text-xs text-blue-600 mt-1">
                    {noiseDescriptions[getNoiseTypeFromTitle(currentTrack.title) as keyof typeof noiseDescriptions]}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Playlist */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 mb-3">
            {playlists[selectedPlaylist as keyof typeof playlists]}
          </h3>
          
          {studyPlaylists[selectedPlaylist]?.map((track) => (
            <div
              key={track.id}
              className={`flex items-center gap-4 p-3 rounded-lg border transition-colors cursor-pointer ${
                currentTrack?.id === track.id
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleTrackSelect(track)}
            >
              <img
                src={track.thumbnail}
                alt={track.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{track.title}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Volume2 className="w-3 h-3" />
                  <span>{track.duration}</span>
                </div>
                {track.description && (
                  <p className="text-xs text-gray-500 mt-1 truncate">{track.description}</p>
                )}
                {selectedPlaylist === 'adhd-noise' && (
                  <div className="text-xs text-blue-600 mt-1">
                    {getNoiseTypeFromTitle(track.title)}
                  </div>
                )}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenYouTube(track.url);
                }}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            💡 <strong>Tip:</strong> {selectedPlaylist === 'adhd-noise' 
              ? 'Los ruidos especializados pueden mejorar significativamente la concentración en personas con TDAH o problemas de atención.'
              : 'La música de fondo puede mejorar tu concentración y productividad.'
            } Haz clic en el ícono de enlace externo para abrir la música en YouTube.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;