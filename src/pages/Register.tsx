import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';
import { getUsers, saveUser, getUserByUsername, getUserByEmail, getUserByReferralCode } from '../lib/storage';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.fullName || !form.username || !form.email || !form.password) {
      setError('Semua field wajib diisi');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Kata sandi tidak cocok');
      return;
    }
    if (form.password.length < 6) {
      setError('Kata sandi minimal 6 karakter');
      return;
    }
    if (getUserByUsername(form.username)) {
      setError('Username sudah digunakan');
      return;
    }
    if (getUserByEmail(form.email)) {
      setError('Email sudah terdaftar');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      let referredBy: string | null = null;
      if (form.referralCode.trim()) {
        const refUser = getUserByReferralCode(form.referralCode.trim().toUpperCase());
        if (refUser) {
          referredBy = refUser.id;
        }
      }

      const newUser: User = {
        id: 'user-' + Date.now(),
        username: form.username,
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        role: 'member',
        referralCode: form.username.toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase(),
        referredBy,
        balance: 0,
        totalInvested: 0,
        totalProfit: 0,
        totalWithdrawn: 0,
        walletAddress: '',
        bankName: '',
        bankAccount: '',
        bankAccountName: '',
        createdAt: new Date().toISOString(),
      };

      saveUser(newUser);
      login(newUser);
      navigate('/member');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="text-amber-400" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white">Daftar Akun</h1>
            <p className="text-slate-400 text-sm mt-1">Buat akun baru untuk mulai berinvestasi</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
                placeholder="johndoe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
                placeholder="john@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
                  placeholder="Minimal 6 karakter"
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
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Konfirmasi Kata Sandi</label>
              <input
                type={showPass ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
                placeholder="Ulangi kata sandi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Kode Referral (Opsional)</label>
              <input
                type="text"
                value={form.referralCode}
                onChange={e => setForm({ ...form, referralCode: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
                placeholder="Masukkan kode referral"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-900 font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Mendaftar...' : 'Daftar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium">
                Masuk
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
