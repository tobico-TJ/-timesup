import React, { useState } from 'react';

interface RegisterFormProps {
  onRegister: (username: string, password: string, name: string, email: string) => boolean;
  onBack: () => void;
  onLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onBack, onLogin }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onRegister(username, password, name, email);
    if (!success) {
      setError('El usuario ya existe o los datos son inválidos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear cuenta</h2>
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
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Registrar
          </button>
        </form>
        <div className="mt-6 flex justify-between">
          <button onClick={onBack} className="text-gray-600 hover:underline">Volver</button>
          <button onClick={onLogin} className="text-blue-600 hover:underline">Ya tengo cuenta</button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;