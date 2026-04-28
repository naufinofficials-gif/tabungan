import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPlans, saveDeposit, getUserById, saveUser } from '../../lib/storage';
import { Wallet, ArrowDownLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MemberDeposit() {
  const { user } = useAuth();
  const plans = getPlans();
  const [selectedPlan, setSelectedPlan] = useState(plans[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatRp = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  const selectedPlanObj = plans.find(p => p.id === selectedPlan);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const amt = parseInt(amount.replace(/\D/g, ''));
    if (!amt || amt <= 0) {
      setError('Jumlah investasi tidak valid');
      return;
    }
    if (!selectedPlanObj) {
      setError('Pilih plan investasi');
      return;
    }
    if (amt < selectedPlanObj.minInvest) {
      setError(`Minimal investasi untuk plan ini adalah ${formatRp(selectedPlanObj.minInvest)}`);
      return;
    }
    if (amt > selectedPlanObj.maxInvest) {
      setError(`Maksimal investasi untuk plan ini adalah ${formatRp(selectedPlanObj.maxInvest)}`);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const deposit = {
        id: 'dep-' + Date.now(),
        userId: user!.id,
        username: user!.username,
        amount: amt,
        method,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        approvedAt: null,
      };
      saveDeposit(deposit);
      setSuccess('Deposit berhasil diajukan. Menunggu persetujuan admin.');
      setAmount('');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Deposit Investasi</h1>
        <p className="text-slate-400">Ajukan deposit untuk memulai investasi Anda</p>
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
          <h2 className="text-lg font-semibold text-white mb-4">Form Deposit</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Pilih Plan</label>
              <select
                value={selectedPlan}
                onChange={e => setSelectedPlan(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
              >
                {plans.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.profitPercent}% / hari)</option>
                ))}
              </select>
            </div>

            {selectedPlanObj && (
              <div className="p-3 bg-slate-800/50 rounded-lg text-sm space-y-1">
                <p className="text-slate-400">Min: <span className="text-white">{formatRp(selectedPlanObj.minInvest)}</span></p>
                <p className="text-slate-400">Max: <span className="text-white">{formatRp(selectedPlanObj.maxInvest)}</span></p>
                <p className="text-slate-400">Profit: <span className="text-emerald-400">{selectedPlanObj.profitPercent}% / hari</span></p>
                <p className="text-slate-400">Durasi: <span className="text-white">{selectedPlanObj.duration} hari</span></p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Jumlah Investasi (Rp)</label>
              <input
                type="text"
                value={amount}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '');
                  setAmount(val ? parseInt(val).toLocaleString('id-ID') : '');
                }}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                placeholder="Contoh: 1.000.000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Metode Pembayaran</label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
              >
                <option value="bank">Transfer Bank</option>
                <option value="ewallet">E-Wallet</option>
                <option value="crypto">Cryptocurrency</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-900 font-semibold rounded-lg transition-colors"
            >
              <ArrowDownLeft size={18} />
              {loading ? 'Mengajukan...' : 'Ajukan Deposit'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Informasi</h2>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <p>Deposit wajib disetujui oleh admin sebelum investasi aktif.</p>
              </div>
              <div className="flex items-start gap-3">
                <Wallet size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <p>Profit masuk otomatis setiap 24 jam ke saldo Anda.</p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowDownLeft size={16} className="text-blue-400 mt-0.5 shrink-0" />
                <p>Anda dapat melakukan re-investasi kapan saja tanpa persetujuan admin.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Rekening Tujuan</h2>
            <div className="space-y-3">
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Bank BCA</p>
                <p className="text-sm text-white font-medium">1234-5678-9012</p>
                <p className="text-xs text-slate-400">a.n. PrimeInvest</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">DANA</p>
                <p className="text-sm text-white font-medium">0812-3456-7890</p>
                <p className="text-xs text-slate-400">a.n. PrimeInvest</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
