import { useEffect, useState } from 'react';
import { getUsers, getInvestments, getDeposits, getWithdrawals, processDailyProfits } from '../../lib/storage';
import { Users, Wallet, TrendingUp, ArrowDownLeft, ArrowUpRight, PiggyBank, Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInvestments: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    totalBalance: 0,
  });

  useEffect(() => {
    processDailyProfits();
    const users = getUsers().filter(u => u.role === 'member');
    const investments = getInvestments();
    const deposits = getDeposits();
    const withdrawals = getWithdrawals();

    setStats({
      totalUsers: users.length,
      totalInvestments: investments.filter(i => i.status === 'active').length,
      totalDeposits: deposits.filter(d => d.status === 'approved').reduce((s, d) => s + d.amount, 0),
      totalWithdrawals: withdrawals.filter(w => w.status === 'approved').reduce((s, w) => s + w.amount, 0),
      pendingDeposits: deposits.filter(d => d.status === 'pending').length,
      pendingWithdrawals: withdrawals.filter(w => w.status === 'pending').length,
      totalBalance: users.reduce((s, u) => s + u.balance, 0),
    });
  }, []);

  const formatRp = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  const cards = [
    { label: 'Total Member', value: stats.totalUsers.toString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Investasi Aktif', value: stats.totalInvestments.toString(), icon: PiggyBank, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Total Deposit', value: formatRp(stats.totalDeposits), icon: ArrowDownLeft, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Withdraw', value: formatRp(stats.totalWithdrawals), icon: ArrowUpRight, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Deposit Pending', value: stats.pendingDeposits.toString(), icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Withdraw Pending', value: stats.pendingWithdrawals.toString(), icon: Clock, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Total Saldo Member', value: formatRp(stats.totalBalance), icon: Wallet, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Total Profit Dibayar', value: formatRp(getUsers().filter(u => u.role === 'member').reduce((s, u) => s + u.totalProfit, 0)), icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  const recentDeposits = getDeposits().slice(-5).reverse();
  const recentWithdrawals = getWithdrawals().slice(-5).reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
        <p className="text-slate-400">Kelola platform investasi dari sini</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">{card.label}</span>
              <div className={`w-9 h-9 ${card.bg} rounded-lg flex items-center justify-center`}>
                <card.icon className={card.color} size={18} />
              </div>
            </div>
            <p className="text-xl font-bold text-white">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Deposit Terbaru</h2>
          <div className="space-y-2">
            {recentDeposits.map(d => (
              <div key={d.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div>
                  <p className="text-sm text-white">{d.username}</p>
                  <p className="text-xs text-slate-500">{new Date(d.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-emerald-400">{formatRp(d.amount)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    d.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                    d.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {d.status === 'approved' ? 'Disetujui' : d.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                  </span>
                </div>
              </div>
            ))}
            {recentDeposits.length === 0 && <p className="text-slate-500 text-sm text-center py-4">Belum ada deposit</p>}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Withdraw Terbaru</h2>
          <div className="space-y-2">
            {recentWithdrawals.map(w => (
              <div key={w.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div>
                  <p className="text-sm text-white">{w.username}</p>
                  <p className="text-xs text-slate-500">{new Date(w.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-400">{formatRp(w.amount)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    w.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                    w.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {w.status === 'approved' ? 'Disetujui' : w.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                  </span>
                </div>
              </div>
            ))}
            {recentWithdrawals.length === 0 && <p className="text-slate-500 text-sm text-center py-4">Belum ada withdraw</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
