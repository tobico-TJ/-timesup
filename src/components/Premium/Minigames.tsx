import React, { useState } from 'react';
import { Target, Calendar, Zap, Trophy, Play, CheckCircle, Clock, X, RotateCcw } from 'lucide-react';

const Minigames: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameState, setGameState] = useState<any>({});

  // 3 en Raya del Enfoque
  const TicTacToeGame = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [winner, setWinner] = useState<string | null>(null);
    const [gameWon, setGameWon] = useState(false);

    const checkWinner = (squares: any[]) => {
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
      ];
      
      for (let line of lines) {
        const [a, b, c] = line;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a];
        }
      }
      return null;
    };

    const handleClick = (index: number) => {
      if (board[index] || winner || !isPlayerTurn) return;

      const newBoard = [...board];
      newBoard[index] = 'X';
      setBoard(newBoard);
      setIsPlayerTurn(false);

      const gameWinner = checkWinner(newBoard);
      if (gameWinner === 'X') {
        setWinner('¡Ganaste!');
        setGameWon(true);
        return;
      }

      // AI move
      setTimeout(() => {
        const emptySquares = newBoard.map((square, i) => square === null ? i : null).filter(val => val !== null);
        if (emptySquares.length > 0) {
          const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
          newBoard[randomIndex!] = 'O';
          setBoard([...newBoard]);
          
          const aiWinner = checkWinner(newBoard);
          if (aiWinner === 'O') {
            setWinner('La IA ganó. ¡Inténtalo de nuevo!');
          } else if (emptySquares.length === 1) {
            setWinner('¡Empate!');
          }
        }
        setIsPlayerTurn(true);
      }, 500);
    };

    const resetGame = () => {
      setBoard(Array(9).fill(null));
      setIsPlayerTurn(true);
      setWinner(null);
      setGameWon(false);
    };

    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">3 en Raya del Enfoque</h3>
        <p className="text-gray-600 mb-6">¡Gana el juego para desbloquear una pausa de 5 minutos!</p>
        
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-6">
          {board.map((square, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className="w-20 h-20 border-2 border-gray-300 rounded-lg text-2xl font-bold hover:bg-gray-50 transition-colors"
              disabled={!!winner}
            >
              {square}
            </button>
          ))}
        </div>

        {winner && (
          <div className="text-center mb-4">
            <p className={`text-lg font-semibold ${gameWon ? 'text-green-600' : 'text-red-600'}`}>
              {winner}
            </p>
            {gameWon && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-800 font-medium">🎉 ¡Pausa desbloqueada!</p>
                <p className="text-green-700 text-sm">Has ganado 5 minutos de descanso merecido.</p>
              </div>
            )}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            Nuevo Juego
          </button>
        </div>
      </div>
    );
  };

  // Encuentra la Tarea Pendiente
  const MemoryGame = () => {
    const tasks = [
      'Estudiar matemáticas', 'Llamar al doctor', 'Comprar comida', 'Hacer ejercicio',
      'Leer libro', 'Organizar escritorio', 'Enviar email', 'Lavar ropa'
    ];
    
    const [cards, setCards] = useState<any[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);

    React.useEffect(() => {
      initializeGame();
    }, []);

    const initializeGame = () => {
      const selectedTasks = tasks.slice(0, 4);
      const gameCards = [...selectedTasks, ...selectedTasks].map((task, index) => ({
        id: index,
        task,
        isFlipped: false,
        isMatched: false
      }));
      
      // Shuffle cards
      for (let i = gameCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
      }
      
      setCards(gameCards);
      setFlipped([]);
      setMatched([]);
      setMoves(0);
      setGameComplete(false);
    };

    const handleCardClick = (index: number) => {
      if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

      const newFlipped = [...flipped, index];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setMoves(moves + 1);
        const [first, second] = newFlipped;
        
        if (cards[first].task === cards[second].task) {
          setMatched([...matched, first, second]);
          setFlipped([]);
          
          if (matched.length + 2 === cards.length) {
            setGameComplete(true);
          }
        } else {
          setTimeout(() => setFlipped([]), 1000);
        }
      }
    };

    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Encuentra la Tarea Pendiente</h3>
        <p className="text-gray-600 mb-4">Encuentra las parejas de tareas. Movimientos: {moves}</p>
        
        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-6">
          {cards.map((card, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`h-20 rounded-lg border-2 text-sm font-medium transition-all ${
                flipped.includes(index) || matched.includes(index)
                  ? 'bg-blue-50 border-blue-300 text-blue-800'
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {flipped.includes(index) || matched.includes(index) ? card.task : '?'}
            </button>
          ))}
        </div>

        {gameComplete && (
          <div className="text-center mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium">🎉 ¡Juego completado!</p>
            <p className="text-green-700 text-sm">Completaste el juego en {moves} movimientos.</p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={initializeGame}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            Nuevo Juego
          </button>
        </div>
      </div>
    );
  };

  // Escape de la Procrastinación
  const ProcrastinationEscape = () => {
    const [currentScenario, setCurrentScenario] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [gameActive, setGameActive] = useState(false);
    const [gameComplete, setGameComplete] = useState(false);

    const scenarios = [
      {
        situation: "Tienes una tarea importante que hacer, pero ves una notificación de redes sociales.",
        options: [
          { text: "Revisar la notificación rápidamente", points: 0 },
          { text: "Silenciar el teléfono y continuar", points: 10 },
          { text: "Posponer la tarea para después", points: -5 }
        ]
      },
      {
        situation: "Es hora de estudiar, pero tus amigos te invitan a salir.",
        options: [
          { text: "Ir con los amigos, estudiaré después", points: -5 },
          { text: "Estudiar primero, salir después", points: 10 },
          { text: "Estudiar un poco y luego salir", points: 5 }
        ]
      },
      {
        situation: "Tienes que escribir un informe, pero la tarea parece muy difícil.",
        options: [
          { text: "Empezar con una parte pequeña", points: 10 },
          { text: "Buscar distracciones en internet", points: -5 },
          { text: "Esperar a sentirme más motivado", points: 0 }
        ]
      },
      {
        situation: "Faltan 2 horas para una entrega y no has empezado.",
        options: [
          { text: "Entrar en pánico y procrastinar más", points: -10 },
          { text: "Hacer lo básico para entregar algo", points: 5 },
          { text: "Concentrarse y dar lo mejor", points: 15 }
        ]
      },
      {
        situation: "Tienes muchas tareas pendientes y no sabes por dónde empezar.",
        options: [
          { text: "Hacer una lista y priorizar", points: 10 },
          { text: "Hacer la tarea más fácil primero", points: 5 },
          { text: "Abrumarme y no hacer nada", points: -10 }
        ]
      }
    ];

    React.useEffect(() => {
      let timer: NodeJS.Timeout;
      if (gameActive && timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      } else if (timeLeft === 0 && gameActive) {
        handleTimeUp();
      }
      return () => clearTimeout(timer);
    }, [timeLeft, gameActive]);

    const startGame = () => {
      setGameActive(true);
      setCurrentScenario(0);
      setScore(0);
      setTimeLeft(10);
      setGameComplete(false);
    };

    const handleChoice = (points: number) => {
      setScore(score + points);
      
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
        setTimeLeft(10);
      } else {
        endGame();
      }
    };

    const handleTimeUp = () => {
      setScore(score - 5); // Penalización por tiempo
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
        setTimeLeft(10);
      } else {
        endGame();
      }
    };

    const endGame = () => {
      setGameActive(false);
      setGameComplete(true);
    };

    const getScoreMessage = () => {
      if (score >= 40) return "¡Maestro anti-procrastinación! 🏆";
      if (score >= 20) return "¡Buen control de impulsos! 👍";
      if (score >= 0) return "Puedes mejorar, ¡sigue practicando! 💪";
      return "¡Necesitas trabajar en tu autodisciplina! 📚";
    };

    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Escape de la Procrastinación</h3>
        
        {!gameActive && !gameComplete && (
          <div className="text-center">
            <p className="text-gray-600 mb-6">Toma decisiones rápidas para evitar la procrastinación. ¡Tienes 10 segundos por decisión!</p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Play className="w-5 h-5 inline mr-2" />
              Comenzar Juego
            </button>
          </div>
        )}

        {gameActive && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Escenario {currentScenario + 1}/{scenarios.length}</span>
              <span className="text-sm font-medium text-red-600">Tiempo: {timeLeft}s</span>
              <span className="text-sm text-gray-600">Puntos: {score}</span>
            </div>
            
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-gray-800">{scenarios[currentScenario].situation}</p>
            </div>
            
            <div className="space-y-3">
              {scenarios[currentScenario].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(option.points)}
                  className="w-full p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {gameComplete && (
          <div className="text-center">
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-2xl font-bold text-blue-800 mb-2">Puntuación Final: {score}</p>
              <p className="text-blue-700">{getScoreMessage()}</p>
            </div>
            
            <button
              onClick={startGame}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5 inline mr-2" />
              Jugar de Nuevo
            </button>
          </div>
        )}
      </div>
    );
  };

  const games = [
    {
      id: 'tic-tac-toe',
      title: '3 en Raya del Enfoque',
      description: 'Gana el juego para desbloquear una pausa de 5 minutos',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-blue-500',
      component: <TicTacToeGame />
    },
    {
      id: 'memory-game',
      title: 'Encuentra la Tarea Pendiente',
      description: 'Juego de memoria con tareas mezcladas',
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-green-500',
      component: <MemoryGame />
    },
    {
      id: 'procrastination-escape',
      title: 'Escape de la Procrastinación',
      description: 'Juego de decisión rápida para evitar distracciones',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-orange-500',
      component: <ProcrastinationEscape />
    }
  ];

  if (activeGame) {
    const game = games.find(g => g.id === activeGame);
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => setActiveGame(null)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Volver a minijuegos
          </button>
        </div>
        {game?.component}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-6 h-6 text-yellow-600" />
          <h2 className="text-xl font-semibold text-gray-900">Minijuegos Premium</h2>
        </div>
        <p className="text-gray-600">Mejora tu productividad mientras te diviertes</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => setActiveGame(game.id)}
            >
              <div className={`w-12 h-12 ${game.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                {game.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{game.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{game.description}</p>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Play className="w-4 h-4" />
                Jugar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Minigames;