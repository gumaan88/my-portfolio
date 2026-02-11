import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { Terminal, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError('فشل تسجيل الدخول. تأكد من البيانات.');
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-md bg-navy-800 p-8 rounded-2xl border border-white/10 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-electric-500/10 rounded-xl flex items-center justify-center border border-electric-500/20">
            <Terminal className="text-electric-400 w-8 h-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-2">لوحة التحكم الإدارية</h2>
        <p className="text-gray-400 text-center mb-8">يرجى تسجيل الدخول للمتابعة</p>

        {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2 text-sm">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white focus:border-electric-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white focus:border-electric-500"
                required
              />
              <Lock className="absolute left-3 top-3.5 text-gray-500 w-4 h-4" />
            </div>
          </div>
          <button type="submit" className="w-full bg-electric-600 hover:bg-electric-500 text-white py-3 rounded-lg font-bold transition-colors">
            دخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;