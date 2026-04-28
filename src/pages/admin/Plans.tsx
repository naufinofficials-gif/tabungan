import { useState } from 'react';
import { getPlans, savePlans } from '../../lib/storage';
import type { InvestmentPlan } from '../../types';
import { Package, Save, Plus, Trash2, Edit3, X, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPlans() {
  const [plans, setPlans] = useState<InvestmentPlan[]>(getPlans());
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<InvestmentPlan>>({});
  const [success, setSuccess] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newPlan, setNewPlan] = useState<Partial<InvestmentPlan>>({
    name: '',
    minInvest: 50000,
    maxInvest: 500000,
    profitPercent: 1.5,
    duration: 30,
    minWithdraw: 25000,
    description: '',
  });

  const formatRp = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  const handleEdit = (plan: InvestmentPlan) => {
    setEditing(plan.id);
    setEditForm({ ...plan });
  };

  const handleSave = () => {
    if (!editForm.name || !editForm.minInvest || !editForm.profitPercent || !editForm.duration) return;

    const updated = plans.map(p =>
      p.id === editing
        ? { ...p, ...editForm, minInvest: Number(editForm.minInvest), maxInvest: Number(editForm.maxInvest), profitPercent: Number(editForm.profitPercent), duration: Number(editForm.duration), minWithdraw: Number(editForm.minWithdraw) } as InvestmentPlan
        : p
    );
    setPlans(updated);
    savePlans(updated);
    setEditing(null);
    setSuccess('Plan berhasil diperbarui');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleAdd = () => {
    if (!newPlan.name) return;
    const plan: InvestmentPlan = {
      id: 'plan-' + Date.now(),
      name: newPlan.name,
      minInvest: Number(newPlan.minInvest) || 50000,
      maxInvest: Number(newPlan.maxInvest) || 500000,
      profitPercent: Number(newPlan.profitPercent) || 1.5,
      duration: Number(newPlan.duration) || 30,
      minWithdraw: Number(newPlan.minWithdraw) || 25000,
      description: newPlan.description || '',
    };
    const updated = [...plans, plan];
    setPlans(updated);
    savePlans(updated);
    setShowAdd(false);
    setNewPlan({ name: '', minInvest: 50000, maxInvest: 500000, profitPercent: 1.5, duration: 30, minWithdraw: 25000, description: '' });
    setSuccess('Plan berhasil ditambahkan');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Yakin ingin menghapus plan ini?')) return;
    const updated = plans.filter(p => p.id !== id);
    setPlans(updated);
    savePlans(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Kelola Plan Investasi</h1>
          <p className="text-slate-400">Atur plan investasi sesuai keinginan</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium rounded-lg transition-colors"
        >
          {showAdd ? <X size={16} /> : <Plus size={16} />}
          {showAdd ? 'Batal' : 'Tambah Plan'}
        </button>
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

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Tambah Plan Baru</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nama Plan"
                value={newPlan.name}
                onChange={e => setNewPlan({ ...newPlan, name: e.target.value })}
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
              <input
                type="number"
                placeholder="Min Investasi"
                value={newPlan.minInvest}
                onChange={e => setNewPlan({ ...newPlan, minInvest: Number(e.target.value) })}
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
              <input
                type="number"
                placeholder="Max Investasi"
                value={newPlan.maxInvest}
                onChange={e => setNewPlan({ ...newPlan, maxInvest: Number(e.target.value) })}
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Profit % per hari"
                value={newPlan.profitPercent}
                onChange={e => setNewPlan({ ...newPlan, profitPercent: Number(e.target.value) })}
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
              <input
                type="number"
                placeholder="Durasi (hari)"
                value={newPlan.duration}
                onChange={e => setNewPlan({ ...newPlan, duration: Number(e.target.value) })}
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
              <input
                type="number"
                placeholder="Min Withdraw"
                value={newPlan.minWithdraw}
                onChange={e => setNewPlan({ ...newPlan, minWithdraw: Number(e.target.value) })}
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
              <input
                type="text"
                placeholder="Deskripsi"
                value={newPlan.description}
                onChange={e => setNewPlan({ ...newPlan, description: e.target.value })}
                className="md:col-span-2 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <button
              onClick={handleAdd}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-medium rounded-lg transition-colors"
            >
              <Save size={16} /> Simpan Plan
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <motion.div
            key={plan.id}
            layout
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            {editing === plan.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={editForm.minInvest || ''}
                    onChange={e => setEditForm({ ...editForm, minInvest: Number(e.target.value) })}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={editForm.maxInvest || ''}
                    onChange={e => setEditForm({ ...editForm, maxInvest: Number(e.target.value) })}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                    placeholder="Max"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.profitPercent || ''}
                    onChange={e => setEditForm({ ...editForm, profitPercent: Number(e.target.value) })}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                    placeholder="Profit %"
                  />
                  <input
                    type="number"
                    value={editForm.duration || ''}
                    onChange={e => setEditForm({ ...editForm, duration: Number(e.target.value) })}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                    placeholder="Hari"
                  />
                </div>
                <input
                  type="number"
                  value={editForm.minWithdraw || ''}
                  onChange={e => setEditForm({ ...editForm, minWithdraw: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                  placeholder="Min Withdraw"
                />
                <input
                  type="text"
                  value={editForm.description || ''}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                  placeholder="Deskripsi"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 text-sm font-medium rounded-lg transition-colors"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <Package className="text-amber-400" size={20} />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{plan.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Min Invest</span>
                    <span className="text-white font-medium">{formatRp(plan.minInvest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Max Invest</span>
                    <span className="text-white font-medium">{formatRp(plan.maxInvest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Profit</span>
                    <span className="text-emerald-400 font-medium">{plan.profitPercent}% / hari</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Durasi</span>
                    <span className="text-white font-medium">{plan.duration} hari</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Min Withdraw</span>
                    <span className="text-white font-medium">{formatRp(plan.minWithdraw)}</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
