import { getPlans } from '../lib/storage';
import { Clock, Wallet, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Plans() {
  const plans = getPlans();

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">Paket Investasi</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Pilih paket investasi yang sesuai dengan tujuan finansial Anda. Semua plan memberikan profit harian otomatis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all hover:shadow-lg hover:shadow-amber-500/5 flex flex-col"
            >
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="text-amber-400" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-slate-500 text-sm mb-4">{plan.description}</p>

              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-3">
                  <Wallet size={16} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Min. Investasi</p>
                    <p className="text-sm font-semibold text-white">{formatRupiah(plan.minInvest)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Wallet size={16} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Max. Investasi</p>
                    <p className="text-sm font-semibold text-white">{formatRupiah(plan.maxInvest)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp size={16} className="text-emerald-400" />
                  <div>
                    <p className="text-xs text-slate-500">Profit Harian</p>
                    <p className="text-sm font-semibold text-emerald-400">{plan.profitPercent}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Durasi</p>
                    <p className="text-sm font-semibold text-white">{plan.duration} hari</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Min. Withdraw</p>
                    <p className="text-sm font-semibold text-white">{formatRupiah(plan.minWithdraw)}</p>
                  </div>
                </div>
              </div>

              <Link
                to="/register"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors text-sm"
              >
                Investasi Sekarang <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
