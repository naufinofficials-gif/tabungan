import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserById, saveUser } from '../../lib/storage';
import { User, Save, CheckCircle, AlertCircle, Mail, AtSign, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminProfile() {
  const { user, login } = useAuth();
  const currentUser = getUserById(user!.id)!;

  const [form, setForm] = useState({
    fullName: currentUser.fullName,
    email: currentUser.email,
    username: currentUser.username,
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.fullName || !form.email) {
      setError('Nama lengkap dan email wajib diisi');
      return;
    }

    currentUser.fullName = form.fullName;
    currentUser.email = form.email;
    saveUser(currentUser);
    login(currentUser);
    setSuccess('Profil berhasil diperbarui');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Edit Profil Admin</h1>
        <p className="text-slate-400">Perbarui informasi profil admin</p>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex items-center gap-3"
        >
          <CheckCircle size={20} />
          {success}
        </motion.div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 text-2xl font-bold">
            {currentUser.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{currentUser.fullName}</p>
            <p className="text-sm text-slate-400">{currentUser.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-amber-500/10 text-amber-400 text-xs rounded-full">Administrator</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                value={form.username}
                disabled
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Username tidak dapat diubah</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Bergabung Sejak</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                value={new Date(currentUser.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                disabled
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors"
          >
            <Save size={18} />
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
