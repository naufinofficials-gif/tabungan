import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserById, saveUser, getPlans, saveInvestment, getUserInvestments } from '../../lib/storage';
import { RefreshCw, AlertCircle, CheckCircle, TrendingUp, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MemberReinvest() {
  const { user } = useAuth();
  const currentUser = getUserById(user!.id)!;
  const plans = getPlans();
  const investments = getUserInvestments(user!.id);
  const activeInvestments = investments.filter(i => i.status === 'active');

  const [selectedPlan, setSelectedPlan] = useState(plans[0]?.id || '');
  const [amount, setAmount] = useState('');
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
      setError('Jumlah re-investasi tidak valid');
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
    if (amt > currentUser.balance) {
      setError('Saldo tidak mencukupi untuk re-investasi');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Deduct balance
      currentUser.balance -= amt;
      currentUser.totalInvested += amt;
      saveUser(currentUser);

      // Create investment directly (no approval needed)
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + selectedPlanObj.duration);

      const investment = {
        id: 'inv-' + Date.now(),
        userId: user!.id,
        planId: selectedPlanObj.id,
        amount: amt,
        status: 'active' as const,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        lastProfitDate: startDate.toISOString(),
        totalProfit: 0,
        reinvested: true,
      };
      saveInvestment(investment);

      setSuccess('Re-investasi berhasil! Investasi baru telah aktif.');
      setAmount('');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Re-Investasi</h1>
        <p className="text-slate-400">Investasikan kembali profit Anda tanpa persetujuan admin</p>
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
          <h2 className="text-lg font-semibold text-white mb-4">Form Re-Investasi</h2>
          <div className="mb-4 p-4 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Saldo Tersedia</p>
            <p className="text-2xl font-bold text-white">{formatRp(currentUser.balance)}</p>
          </div>
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
              <label className="block text-sm font-medium text-slate-300 mb-1">Jumlah Re-Investasi (Rp)</label>
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

            <button
              type="submit"
              disabled={loading || currentUser.balance <= 0}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-900 font-semibold rounded-lg transition-colors"
            >
              <RefreshCw size={18} />
              {loading ? 'Memproses...' : 'Re-Investasi Sekarang'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Investasi Aktif</h2>
            {activeInvestments.length === 0 ? (
              <div className="text-center py-4">
                <TrendingUp className="mx-auto text-slate-600 mb-2" size={32} />
                <p className="text-slate-500 text-sm">Belum ada investasi aktif</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeInvestments.map(inv => {
                  const plan = plans.find(p => p.id === inv.planId);
                  const dailyProfit = plan ? (inv.amount * plan.profitPercent) / 100 : 0;
                  return (
                    <div key={inv.id} className="p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">{plan?.name || 'Unknown'}</span>
                        <span className="text-xs text-amber-400">{inv.reinvested ? 'Re-investasi' : 'Deposit'}</span>
                      </div>
                      <p className="text-xs text-slate-400">{formatRp(inv.amount)} - Profit: {formatRp(dailyProfit)}/hari</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Informasi</h2>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <RefreshCw size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <p>Re-investasi tidak memerlukan persetujuan admin dan langsung aktif.</p>
              </div>
              <div className="flex items-start gap-3">
                <Wallet size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <p>Saldo akan langsung dipotong untuk re-investasi.</p>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp size={16} className="text-blue-400 mt-0.5 shrink-0" />
                <p>Profit masuk otomatis setiap 24 jam.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
