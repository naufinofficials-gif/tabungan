import { useState, useEffect } from 'react';
import { getDeposits, saveDeposit, getUserById, saveUser, getPlans, saveInvestment } from '../../lib/storage';
import type { Deposit } from '../../types';
import { CheckCircle, XCircle, Clock, Wallet, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    setDeposits(getDeposits().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  const formatRp = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  const handleApprove = (deposit: Deposit) => {
    deposit.status = 'approved';
    deposit.approvedAt = new Date().toISOString();
    saveDeposit(deposit);

    // Create investment
    const plans = getPlans();
    // Find best matching plan or default to first
    const plan = plans[0];
    if (plan) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + plan.duration);

      const investment = {
        id: 'inv-' + Date.now(),
        userId: deposit.userId,
        planId: plan.id,
        amount: deposit.amount,
        status: 'active' as const,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        lastProfitDate: startDate.toISOString(),
        totalProfit: 0,
        reinvested: false,
      };
      saveInvestment(investment);

      const user = getUserById(deposit.userId);
      if (user) {
        user.totalInvested += deposit.amount;
        saveUser(user);
      }
    }

    setDeposits(getDeposits().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleReject = (deposit: Deposit) => {
    deposit.status = 'rejected';
    deposit.approvedAt = new Date().toISOString();
    saveDeposit(deposit);
    setDeposits(getDeposits().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const filtered = filter === 'all' ? deposits : deposits.filter(d => d.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Persetujuan Deposit</h1>
        <p className="text-slate-400">Kelola dan setujui deposit member</p>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-amber-500 text-slate-900'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {f === 'all' ? 'Semua' : f === 'pending' ? 'Menunggu' : f === 'approved' ? 'Disetujui' : 'Ditolak'}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Member</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Jumlah</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Metode</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Tanggal</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((d, i) => (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm text-white font-medium">{d.username}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-emerald-400 font-medium">{formatRp(d.amount)}</td>
                    <td className="px-6 py-4 text-sm text-slate-300 capitalize">{d.method}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{new Date(d.createdAt).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        d.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                        d.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {d.status === 'approved' ? <CheckCircle size={12} /> :
                         d.status === 'pending' ? <Clock size={12} /> :
                         <XCircle size={12} />}
                        {d.status === 'approved' ? 'Disetujui' : d.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {d.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(d)}
                            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs rounded-lg transition-colors"
                          >
                            Setuju
                          </button>
                          <button
                            onClick={() => handleReject(d)}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition-colors"
                          >
                            Tolak
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Wallet className="mx-auto text-slate-600 mb-3" size={40} />
            <p className="text-slate-500 text-sm">Tidak ada deposit</p>
          </div>
        )}
      </div>
    </div>
  );
}
