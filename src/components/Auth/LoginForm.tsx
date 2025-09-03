import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => boolean;
  onBack: () => void;
  onRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onBack, onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(username, password);
    if (!success) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>
        <div className="mt-6 flex justify-between">
          <button onClick={onBack} className="text-gray-600 hover:underline">Volver</button>
          <button onClick={onRegister} className="text-blue-600 hover:underline">Crear cuenta</button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;