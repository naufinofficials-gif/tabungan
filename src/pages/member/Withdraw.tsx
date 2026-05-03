import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserById, saveUser, saveWithdrawal, getPlans, getUserInvestments } from '../../lib/storage';
import { ArrowUpRight, AlertCircle, CheckCircle, Wallet, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MemberWithdraw() {
  const { user } = useAuth();
  const currentUser = getUserById(user!.id)!;
  const plans = getPlans();
  const investments = getUserInvestments(user!.id);
  const activeInvestments = investments.filter(i => i.status === 'active');

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState(currentUser.bankName ? 'bank' : 'ewallet');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatRp = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  // Get minimum withdraw from active plan
  const minWithdraw = activeInvestments.length > 0
    ? Math.min(...activeInvestments.map(inv => {
        const plan = plans.find(p => p.id === inv.planId);
        return plan?.minWithdraw || 25000;
      }))
    : 25000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const amt = parseInt(amount.replace(/\D/g, ''));
    if (!amt || amt <= 0) {
      setError('Jumlah withdraw gak valid bro...!!');
      return;
    }
    if (amt < minWithdraw) {
      setError(`Minimal withdraw adalah ${formatRp(minWithdraw)}`);
      return;
    }
    if (amt > currentUser.balance) {
      setError('Saldo anda gak mencukupi');
      return;
    }
    if (method === 'bank' && (!currentUser.bankName || !currentUser.bankAccount)) {
      setError('Lengkapi data rekening banknya ya bro..');
      return;
    }
    if (method === 'ewallet' && !currentUser.walletAddress) {
      setError('Lengkapi data E-Wallet Anda');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const wd = {
        id: 'wd-' + Date.now(),
        userId: user!.id,
        username: user!.username,
        amount: amt,
        method,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        approvedAt: null,
      };
      saveWithdrawal(wd);

      // Deduct balance
      currentUser.balance -= amt;
      saveUser(currentUser);

      setSuccess('Pengajuan withdraw berhasil. Tunggu...ntar lagi diproses admin kok...');
      setAmount('');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Withdraw</h1>
        <p className="text-slate-400">Ajukan penarikan dana dari saldo Anda</p>
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

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Form Withdraw</h2>
          <div className="mb-4 p-4 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Saldo Tersedia</p>
            <p className="text-2xl font-bold text-white">{formatRp(currentUser.balance)}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Jumlah Withdraw (Rp)</label>
              <input
                type="text"
                value={amount}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '');
                  setAmount(val ? parseInt(val).toLocaleString('id-ID') : '');
                }}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                placeholder={`Minimal ${formatRp(minWithdraw)}`}
              />
              <p className="text-xs text-slate-500 mt-1">Minimal withdraw: {formatRp(minWithdraw)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Metode Penarikan</label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
              >
                <option value="bank">Transfer Bank</option>
                <option value="ewallet">E-Wallet</option>
              </select>
            </div>

            {method === 'bank' && currentUser.bankName && (
              <div className="p-3 bg-slate-800/50 rounded-lg text-sm">
                <p className="text-slate-400">Bank: <span className="text-white">{currentUser.bankName}</span></p>
                <p className="text-slate-400">No. Rekening: <span className="text-white">{currentUser.bankAccount}</span></p>
                <p className="text-slate-400">a.n: <span className="text-white">{currentUser.bankAccountName}</span></p>
              </div>
            )}

            {method === 'ewallet' && currentUser.walletAddress && (
              <div className="p-3 bg-slate-800/50 rounded-lg text-sm">
                <p className="text-slate-400">Alamat E-Wallet: <span className="text-white">{currentUser.walletAddress}</span></p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || currentUser.balance <= 0}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-900 font-semibold rounded-lg transition-colors"
            >
              <ArrowUpRight size={18} />
              {loading ? 'Mengajukan...' : 'Ajukan Withdraw'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Data Rekening</h2>
            {!currentUser.bankName && !currentUser.walletAddress ? (
              <div className="text-center py-4">
                <Wallet className="mx-auto text-slate-600 mb-2" size={32} />
                <p className="text-slate-500 text-sm mb-3">Belum ada data rekening</p>
                <a href="/member/bank" className="text-amber-400 text-sm hover:underline">Tambah Rekening</a>
              </div>
            ) : (
              <div className="space-y-3">
                {currentUser.bankName && (
                  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                    <Banknote size={18} className="text-blue-400" />
                    <div>
                      <p className="text-sm text-white">{currentUser.bankName}</p>
                      <p className="text-xs text-slate-400">{currentUser.bankAccount} - {currentUser.bankAccountName}</p>
                    </div>
                  </div>
                )}
                {currentUser.walletAddress && (
                  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                    <Wallet size={18} className="text-emerald-400" />
                    <div>
                      <p className="text-sm text-white">E-Wallet</p>
                      <p className="text-xs text-slate-400">{currentUser.walletAddress}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Ketentuan</h2>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <p>Withdraw memerlukan persetujuan admin.</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <p>Minimal withdraw sesuai dengan plan investasi aktif Anda.</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <p>Pastikan data rekening sudah benar sebelum mengajukan withdraw.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
