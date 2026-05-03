import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Shield, Clock, Users, ArrowRight, Wallet, BarChart3, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: TrendingUp,
      title: 'Profit Harian',
      desc: 'Dapatkan profit setiap 24 jam secara otomatis masuk ke saldo akun Anda.',
    },
    {
      icon: Shield,
      title: 'Sistem Aman',
      desc: 'Platform dengan keamanan tingkat tinggi untuk melindungi investasi Anda.',
    },
    {
      icon: Clock,
      title: 'Investasi Fleksibel',
      desc: 'Pilih dari 5 plan investasi dengan durasi dan return yang bervariasi.',
    },
    {
      icon: Users,
      title: 'Program Referral',
      desc: 'Dapatkan bonus dengan mengajak teman bergabung menggunakan link referral.',
    },
  ];

  const stats = [
    { label: 'Total Member', value: '500+', icon: Users },
    { label: 'Total Investasi', value: 'Rp 2.750.000,-', icon: Wallet },
    { label: 'Profit Dibayar', value: 'Rp 1.350.000,-', icon: BarChart3 },
    { label: 'Hari Beroperasi', value: '200+', icon: Award },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-slate-950 to-slate-950" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-6">
                <TrendingUp size={14} />
                <span>Platform Investasi Terpercaya</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Investasi Cerdas untuk{' '}
                <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  Masa Depan
                </span>
              </h1>
              <p className="text-lg text-slate-400 mb-8 max-w-lg">
                Mulai investasi dengan modal minimal Rp 10.000. Profit masuk otomatis setiap 24 jam.
                Pilih dari 5 plan investasi sesuai kebutuhan Anda.
              </p>
              <div className="flex flex-wrap gap-4">
                {user ? (
                  <Link
                    to={user.role === 'admin' ? '/admin' : '/member'}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-xl transition-colors"
                  >
                    Dashboard Saya <ArrowRight size={18} />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-xl transition-colors"
                    >
                      Mulai Investasi <ArrowRight size={18} />
                    </Link>
                    <Link
                      to="/plans"
                      className="inline-flex items-center gap-2 px-6 py-3 border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 font-semibold rounded-xl transition-colors"
                    >
                      Lihat Plan
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-slate-400 text-sm">Total Saldo</p>
                    <p className="text-3xl font-bold text-white">Rp 12.500.000,-</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <Wallet className="text-emerald-400" size={24} />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                        <TrendingUp size={16} className="text-amber-400" />
                      </div>
                      <span className="text-sm text-slate-300">Profit Hari Ini</span>
                    </div>
                    <span className="text-emerald-400 font-semibold text-sm">Rp 250.000,-</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <BarChart3 size={16} className="text-blue-400" />
                      </div>
                      <span className="text-sm text-slate-300">Total Investasi</span>
                    </div>
                    <span className="text-white font-semibold text-sm">Rp 5.000.000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <Users size={16} className="text-purple-400" />
                      </div>
                      <span className="text-sm text-slate-300">Referral</span>
                    </div>
                    <span className="text-white font-semibold text-sm">15 Member</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="mx-auto text-amber-400 mb-3" size={28} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Mengapa Memilih Kami?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Kami menyediakan platform investasi yang aman, transparan, dan menguntungkan untuk semua kalangan.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-amber-500/30 transition-colors"
              >
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
                  <feat.icon className="text-amber-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feat.title}</h3>
                <p className="text-slate-400 text-sm">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-600 to-amber-500 rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Siap Memulai Investasi?
            </h2>
            <p className="text-slate-800 mb-8 max-w-xl mx-auto">
              Daftar sekarang dan mulai perjalanan investasi Anda. hanya dengan uang Rp 10.000,-
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors"
            >
              Daftar Sekarang <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
