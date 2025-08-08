import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserShield } from 'react-icons/fa';
import { MdSupervisorAccount } from 'react-icons/md';
import logo from '../Assets/Logo/wasa-logo.png';
import { loginUser } from '../API/index.js';
import { AuthContext } from '../Context/Context.js'; 

export default function LoginPage() {
  const { setToken, setUser } = useContext(AuthContext); 
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUser({ email, password });
      console.log("Login response:", data); 

      if (data?.success) {
        const userData = {
          email,
          role: data.role || 'admin',
        };

     
        setUser(userData);
        setToken(data.token);

        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', data.token); 

        navigate('/dashboard');
      } else {
        setError(data?.message || 'Invalid credentials');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRoleLogin = (role) => {
    const mockUser = {
      email: role === 'admin' ? 'admin@wasa.com' : 'supervisor@wasa.com',
      role: role,
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setToken('mock-token'); 
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
      <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="logo" className="w-20 h-20" />
        </div>

        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-2">
          Sign in with email
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Monitor and manage WASA operations with ease and efficiency.
        </p>

        <form className="space-y-4" onSubmit={handleLogin}>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <FaEnvelope />
            </span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white text-gray-700"
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <FaLock />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white text-gray-700"
            />
            <span
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
            </span>
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-gray-500 hover:underline hover:text-blue-700">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-3 rounded-lg text-base font-semibold hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        <div className="my-6 border-t border-gray-300 relative text-center">
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-3 text-gray-400 text-sm">
            OR Login as
          </span>
        </div>

        <div className="flex justify-center gap-6 mt-2">
          <button
            onClick={() => handleRoleLogin('admin')}
            className="flex flex-col items-center text-blue-600 hover:opacity-80 transition"
          >
            <FaUserShield size={32} />
            <span className="text-sm">Admin</span>
          </button>

          <button
            onClick={() => handleRoleLogin('supervisor')}
            className="flex flex-col items-center text-green-600 hover:opacity-80 transition"
          >
            <MdSupervisorAccount size={32} />
            <span className="text-sm">Supervisor</span>
          </button>
        </div>
      </div>
    </div>
  );
}
