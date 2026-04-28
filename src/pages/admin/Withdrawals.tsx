import { useState, useEffect } from 'react';
import { getWithdrawals, saveWithdrawal, getUserById, saveUser } from '../../lib/storage';
import type { Withdrawal } from '../../types';
import { CheckCircle, XCircle, Clock, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    setWithdrawals(getWithdrawals().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  const formatRp = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  const handleApprove = (wd: Withdrawal) => {
    wd.status = 'approved';
    wd.approvedAt = new Date().toISOString();
    saveWithdrawal(wd);

    const user = getUserById(wd.userId);
    if (user) {
      user.totalWithdrawn += wd.amount;
      saveUser(user);
    }

    setWithdrawals(getWithdrawals().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleReject = (wd: Withdrawal) => {
    wd.status = 'rejected';
    wd.approvedAt = new Date().toISOString();
    saveWithdrawal(wd);

    // Refund balance
    const user = getUserById(wd.userId);
    if (user) {
      user.balance += wd.amount;
      saveUser(user);
    }

    setWithdrawals(getWithdrawals().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const filtered = filter === 'all' ? withdrawals : withdrawals.filter(w => w.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Persetujuan Withdraw</h1>
        <p className="text-slate-400">Kelola dan setujui withdraw member</p>
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
                {filtered.map(wd => (
                  <motion.tr
                    key={wd.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm text-white font-medium">{wd.username}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-red-400 font-medium">{formatRp(wd.amount)}</td>
                    <td className="px-6 py-4 text-sm text-slate-300 capitalize">{wd.method}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{new Date(wd.createdAt).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        wd.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                        wd.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {wd.status === 'approved' ? <CheckCircle size={12} /> :
                         wd.status === 'pending' ? <Clock size={12} /> :
                         <XCircle size={12} />}
                        {wd.status === 'approved' ? 'Disetujui' : wd.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {wd.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(wd)}
                            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs rounded-lg transition-colors"
                          >
                            Setuju
                          </button>
                          <button
                            onClick={() => handleReject(wd)}
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
            <ArrowUpRight className="mx-auto text-slate-600 mb-3" size={40} />
            <p className="text-slate-500 text-sm">Tidak ada withdraw</p>
          </div>
        )}
      </div>
    </div>
  );
}
