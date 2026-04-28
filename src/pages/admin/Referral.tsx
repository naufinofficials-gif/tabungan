import { useAuth } from '../../context/AuthContext';
import { getUserReferrals } from '../../lib/storage';
import { Users, Copy, CheckCircle, Link2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AdminReferral() {
  const { user } = useAuth();
  const referrals = getUserReferrals(user!.id);
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/register?ref=${user?.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Program Referral</h1>
        <p className="text-slate-400">Bagikan link referral Anda</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Link Referral Anda</h2>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 truncate">
                {referralLink}
              </div>
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                {copied ? 'Tersalin' : 'Salin'}
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <Link2 size={14} />
              <span>Kode Referral: <span className="text-amber-400 font-mono">{user?.referralCode}</span></span>
            </div>
          </motion.div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Statistik Referral</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                <Users className="mx-auto text-amber-400 mb-2" size={24} />
                <p className="text-2xl font-bold text-white">{referrals.length}</p>
                <p className="text-xs text-slate-500">Total Referral</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                <Users className="mx-auto text-emerald-400 mb-2" size={24} />
                <p className="text-2xl font-bold text-white">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                    referrals.reduce((sum, r) => sum + r.bonus, 0)
                  )}
                </p>
                <p className="text-xs text-slate-500">Total Bonus</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Daftar Referral</h2>
          {referrals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto text-slate-600 mb-3" size={40} />
              <p className="text-slate-500 text-sm">Belum ada referral</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {referrals.map((ref, i) => (
                <motion.div
                  key={ref.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center">
                      <span className="text-amber-400 text-xs font-bold">{ref.referredUsername.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm text-white">{ref.referredUsername}</p>
                      <p className="text-xs text-slate-500">{new Date(ref.createdAt).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-medium">
                    +{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(ref.bonus)}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
