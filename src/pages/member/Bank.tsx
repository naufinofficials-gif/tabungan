import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserById, saveUser } from '../../lib/storage';
import { Banknote, Wallet, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MemberBank() {
  const { user } = useAuth();
  const currentUser = getUserById(user!.id)!;

  const [form, setForm] = useState({
    bankName: currentUser.bankName || '',
    bankAccount: currentUser.bankAccount || '',
    bankAccountName: currentUser.bankAccountName || '',
    walletAddress: currentUser.walletAddress || '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    currentUser.bankName = form.bankName;
    currentUser.bankAccount = form.bankAccount;
    currentUser.bankAccountName = form.bankAccountName;
    currentUser.walletAddress = form.walletAddress;
    saveUser(currentUser);
    setSuccess('Data rekening berhasil disimpan');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Rekening & E-Wallet</h1>
        <p className="text-slate-400">Kelola data rekening bank dan E-Wallet Anda</p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Banknote className="text-blue-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Rekening Bank</h2>
              <p className="text-sm text-slate-500">Data rekening untuk withdraw</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nama Bank</label>
              <input
                type="text"
                value={form.bankName}
                onChange={e => setForm({ ...form, bankName: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                placeholder="Contoh: BCA, BNI, Mandiri"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nomor Rekening</label>
              <input
                type="text"
                value={form.bankAccount}
                onChange={e => setForm({ ...form, bankAccount: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                placeholder="1234567890"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Nama Pemilik Rekening</label>
              <input
                type="text"
                value={form.bankAccountName}
                onChange={e => setForm({ ...form, bankAccountName: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                placeholder="Nama sesuai di buku tabungan"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Wallet className="text-emerald-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">E-Wallet</h2>
              <p className="text-sm text-slate-500">Alamat E-Wallet untuk withdraw</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Alamat E-Wallet / Nomor DANA/OVO/Gopay</label>
            <input
              type="text"
              value={form.walletAddress}
              onChange={e => setForm({ ...form, walletAddress: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              placeholder="Contoh: 08123456789 atau alamat crypto"
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
  );
}
