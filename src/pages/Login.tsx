import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { getUserByUsername, getUsers } from '../lib/storage';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username dan kata sandi wajib diisi');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const user = getUserByUsername(username);
      if (!user || user.password !== password) {
        setError('Username atau kata sandi salah');
        setLoading(false);
        return;
      }
      login(user);
      navigate(user.role === 'admin' ? '/admin' : '/member');
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="text-amber-400" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white">Masuk Akun</h1>
            <p className="text-slate-400 text-sm mt-1">Masuk ke akun Anda untuk mengelola investasi</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
                placeholder="Masukkan username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
                  placeholder="Masukkan kata sandi"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-900 font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-slate-800/50 rounded-lg text-xs text-slate-400">
            <p className="font-medium text-slate-300 mb-1">Akun Demo:</p>
            <p>Admin: username <span className="text-amber-400">admin</span> / password <span className="text-amber-400">admin123</span></p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Belum punya akun?{' '}
              <Link to="/register" className="text-amber-400 hover:text-amber-300 font-medium">
                Daftar
              </Link>
            </p>
          </div>

          <Link to="/" className="flex items-center justify-center gap-2 mt-6 text-slate-500 hover:text-slate-300 text-sm transition-colors">
            <ArrowLeft size={14} /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
