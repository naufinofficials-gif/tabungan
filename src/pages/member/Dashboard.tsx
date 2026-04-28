import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserInvestments, getPlans, getUserDeposits, getUserWithdrawals, processDailyProfits, getUserById, saveUser } from '../../lib/storage';
import type { Investment, InvestmentPlan, Deposit, Withdrawal } from '../../types';
import { Wallet, TrendingUp, PiggyBank, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function MemberDashboard() {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    if (!user) return;
    processDailyProfits();
    const u = getUserById(user.id);
    if (u) setCurrentUser(u);
    setInvestments(getUserInvestments(user.id));
    setPlans(getPlans());
    setDeposits(getUserDeposits(user.id).slice(-5));
    setWithdrawals(getUserWithdrawals(user.id).slice(-5));
  }, [user]);

  const formatRp = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  const activeInvestments = investments.filter(i => i.status === 'active');
  const totalActive = activeInvestments.reduce((sum, i) => sum + i.amount, 0);

  const stats = [
    { label: 'Saldo', value: formatRp(currentUser?.balance || 0), icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Investasi Aktif', value: formatRp(totalActive), icon: PiggyBank, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Total Profit', value: formatRp(currentUser?.totalProfit || 0), icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Total Withdraw', value: formatRp(currentUser?.totalWithdrawn || 0), icon: ArrowUpRight, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  const getPlanName = (planId: string) => plans.find(p => p.id === planId)?.name || 'Unknown';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard Member</h1>
        <p className="text-slate-400">Selamat datang, {currentUser?.fullName}</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">{stat.label}</span>
              <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={stat.color} size={18} />
              </div>
            </div>
            <p className="text-xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Investments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Investasi Aktif</h2>
              <Link to="/member/deposit" className="text-sm text-amber-400 hover:text-amber-300">+ Deposit</Link>
            </div>
            {activeInvestments.length === 0 ? (
              <div className="text-center py-8">
                <PiggyBank className="mx-auto text-slate-600 mb-3" size={40} />
                <p className="text-slate-500 text-sm">Belum ada investasi aktif</p>
                <Link to="/member/deposit" className="inline-block mt-3 text-amber-400 text-sm hover:underline">
                  Lakukan deposit untuk mulai berinvestasi
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeInvestments.map(inv => {
                  const plan = plans.find(p => p.id === inv.planId);
                  const dailyProfit = plan ? (inv.amount * plan.profitPercent) / 100 : 0;
                  const progress = plan ? ((new Date().getTime() - new Date(inv.startDate).getTime()) / (new Date(inv.endDate).getTime() - new Date(inv.startDate).getTime())) * 100 : 0;
                  return (
                    <div key={inv.id} className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-white">{getPlanName(inv.planId)}</p>
                          <p className="text-xs text-slate-400">{formatRp(inv.amount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-emerald-400 font-medium">+{formatRp(dailyProfit)}/hari</p>
                          <p className="text-xs text-slate-500">Profit: {formatRp(inv.totalProfit)}</p>
                        </div>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                        <span>{new Date(inv.startDate).toLocaleDateString('id-ID')}</span>
                        <span>{new Date(inv.endDate).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Transaksi Terakhir</h2>
            <div className="space-y-2">
              {[...deposits.map(d => ({ ...d, type: 'deposit' as const })), ...withdrawals.map(w => ({ ...w, type: 'withdrawal' as const }))]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((tx, i) => (
                  <div key={tx.id + i} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'deposit' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                        {tx.type === 'deposit' ? <ArrowDownLeft size={16} className="text-emerald-400" /> : <ArrowUpRight size={16} className="text-red-400" />}
                      </div>
                      <div>
                        <p className="text-sm text-white capitalize">{tx.type === 'deposit' ? 'Deposit' : 'Withdraw'}</p>
                        <p className="text-xs text-slate-500">{new Date(tx.createdAt).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {tx.type === 'deposit' ? '+' : '-'}{formatRp(tx.amount)}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        tx.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                        tx.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {tx.status === 'approved' ? 'Disetujui' : tx.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                      </span>
                    </div>
                  </div>
                ))}
              {deposits.length === 0 && withdrawals.length === 0 && (
                <p className="text-center text-slate-500 text-sm py-4">Belum ada transaksi</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Menu Cepat</h2>
            <div className="space-y-2">
              <Link to="/member/deposit" className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors">
                <ArrowDownLeft size={18} className="text-emerald-400" />
                <span className="text-sm text-white">Deposit</span>
              </Link>
              <Link to="/member/withdraw" className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors">
                <ArrowUpRight size={18} className="text-red-400" />
                <span className="text-sm text-white">Withdraw</span>
              </Link>
              <Link to="/member/referral" className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors">
                <TrendingUp size={18} className="text-blue-400" />
                <span className="text-sm text-white">Referral</span>
              </Link>
              <Link to="/member/bank" className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors">
                <Wallet size={18} className="text-purple-400" />
                <span className="text-sm text-white">Rekening</span>
              </Link>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Status Deposit</h2>
            <div className="space-y-2">
              {deposits.slice(0, 3).map(d => (
                <div key={d.id} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                  <span className="text-sm text-white">{formatRp(d.amount)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    d.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                    d.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {d.status === 'approved' ? <CheckCircle size={12} className="inline mr-1" /> :
                     d.status === 'pending' ? <Clock size={12} className="inline mr-1" /> :
                     <AlertCircle size={12} className="inline mr-1" />}
                    {d.status === 'approved' ? 'Disetujui' : d.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                  </span>
                </div>
              ))}
              {deposits.length === 0 && <p className="text-slate-500 text-sm">Belum ada deposit</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
